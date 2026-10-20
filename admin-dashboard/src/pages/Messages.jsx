import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Mail, Trash2, Inbox, RefreshCw, Circle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useTable } from '../lib/useTable'
import { useCounts } from '../lib/counts.jsx'
import { isUnread, setRead } from '../lib/messageState'
import { errorText, formatDate, timeAgo } from '../lib/format'
import { useFeedback } from '../components/ui/feedback.jsx'
import { Avatar, Badge, Button, Card, EmptyState, ErrorState, FilterTabs, PageHeader, Skeleton } from '../components/ui/index.jsx'

export default function Messages() {
  const { items, setItems, loading, error, reload } = useTable('messages')
  const { refresh } = useCounts()
  const { toast, confirm } = useFeedback()
  const [selectedId, setSelectedId] = useState(null)
  const [tab, setTab] = useState('all')
  const [, force] = useState(0)

  const unread = items.filter((m) => isUnread(m)).length
  const shown = useMemo(() => (tab === 'unread' ? items.filter((m) => isUnread(m)) : items), [items, tab, force]) // eslint-disable-line
  const selected = items.find((m) => m.id === selectedId) || null

  // On large screens open the newest message; on phones start at the list.
  useEffect(() => {
    if (!selectedId && items.length && window.matchMedia('(min-width: 1024px)').matches) select(items[0])
  }, [items]) // eslint-disable-line

  async function select(m) {
    setSelectedId(m.id)
    if (isUnread(m)) { await setRead(m, true); force((n) => n + 1); refresh() }
  }

  async function toggleRead(m) {
    await setRead(m, isUnread(m)); force((n) => n + 1); refresh()
  }

  async function remove(m) {
    const ok = await confirm({ title: 'Delete this message?', message: `The message from ${m.name} will be permanently deleted.`, confirmLabel: 'Delete message', danger: true })
    if (!ok) return
    const { error: err } = await supabase.from('messages').delete().eq('id', m.id)
    if (err) { console.error(err); toast.error(`Couldn’t delete: ${errorText(err)}`); return }
    setItems((prev) => prev.filter((x) => x.id !== m.id))
    setSelectedId(null)
    toast.success('Message deleted.')
    refresh()
  }

  const mailto = (m) => `mailto:${m.email}?subject=${encodeURIComponent('Re: your enquiry to CodeCanvas')}&body=${encodeURIComponent(`Hello ${String(m.name || '').split(' ')[0]},\n\nThank you for getting in touch.\n\n`)}`

  return (
    <>
      <PageHeader title="Messages" description={`${items.length} enquir${items.length === 1 ? 'y' : 'ies'} from your contact form${unread ? `, ${unread} unread` : ''}.`}
        actions={<Button variant="secondary" icon={RefreshCw} onClick={() => { reload(); refresh() }}>Refresh</Button>} />

      {error ? <ErrorState error={error} onRetry={reload} /> : loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4"><Skeleton className="h-80 lg:col-span-2" /><Skeleton className="h-80 lg:col-span-3 hidden lg:block" /></div>
      ) : items.length === 0 ? (
        <EmptyState icon={Inbox} title="No messages yet">Enquiries sent through the contact form on your website will appear here.</EmptyState>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-6 items-start">
          {/* List: hidden on phones while a message is open */}
          <div className={`lg:col-span-2 ${selected ? 'hidden lg:block' : ''}`}>
            <div className="mb-3">
              <FilterTabs label="Filter messages" value={tab} onChange={setTab} options={[{ value: 'all', label: 'All', count: items.length }, { value: 'unread', label: 'Unread', count: unread }]} />
            </div>
            {shown.length === 0 ? <EmptyState title="No unread messages">You’re all caught up.</EmptyState> : (
              <Card className="overflow-hidden divide-y divide-line">
                {shown.map((m) => {
                  const un = isUnread(m)
                  return (
                    <button key={m.id} type="button" onClick={() => select(m)} aria-current={m.id === selectedId}
                      className={`w-full text-left flex gap-3 px-4 py-3.5 transition-colors hover:bg-white/[0.04] ${m.id === selectedId ? 'bg-ink-800' : ''}`}>
                      <Avatar name={m.name} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className={`text-sm truncate ${un ? 'font-bold text-white' : 'font-medium text-soft'}`}>{m.name}</p>
                          <span className="text-[11px] text-muted shrink-0">{timeAgo(m)}</span>
                        </div>
                        <p className="text-[13px] text-muted truncate">{m.service}</p>
                        <p className="text-[13px] text-muted truncate">{m.message}</p>
                      </div>
                      {un && <><Circle size={9} className="mt-2 shrink-0 fill-brand-500 text-brand-500" aria-hidden="true" /><span className="sr-only">Unread</span></>}
                    </button>
                  )
                })}
              </Card>
            )}
          </div>

          {/* Detail */}
          <div className={`lg:col-span-3 ${selected ? '' : 'hidden lg:block'}`}>
            {selected ? (
              <Card className="p-5 sm:p-6 lg:sticky lg:top-24">
                <button type="button" onClick={() => setSelectedId(null)} className="lg:hidden inline-flex items-center gap-2 min-h-[44px] -ml-1 mb-2 text-sm font-semibold text-muted hover:text-white">
                  <ArrowLeft size={16} aria-hidden="true" /> All messages
                </button>
                <div className="flex items-start gap-3">
                  <Avatar name={selected.name} size={44} />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xl font-bold [overflow-wrap:anywhere]">{selected.name}</h3>
                    <a href={`mailto:${selected.email}`} className="text-sm text-brand-400 hover:underline [overflow-wrap:anywhere]">{selected.email}</a>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-4 text-sm">
                  <Badge tone="blue">{selected.service}</Badge>
                  {formatDate(selected) && <span className="text-muted">{formatDate(selected)}</span>}
                </div>
                <p className="mt-5 pt-5 border-t border-line text-[15px] leading-relaxed text-soft whitespace-pre-wrap [overflow-wrap:anywhere]">{selected.message}</p>
                <div className="flex flex-wrap gap-2 mt-6 pt-5 border-t border-line">
                  <Button as="a" href={mailto(selected)} icon={Mail}>Reply by email</Button>
                  <Button variant="secondary" onClick={() => toggleRead(selected)}>{isUnread(selected) ? 'Mark as read' : 'Mark as unread'}</Button>
                  <Button variant="danger" icon={Trash2} onClick={() => remove(selected)}>Delete</Button>
                </div>
              </Card>
            ) : <EmptyState icon={Inbox} title="Select a message">Choose a message from the list to read it.</EmptyState>}
          </div>
        </div>
      )}
    </>
  )
}
