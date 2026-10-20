import { useMemo, useState } from 'react'
import { Check, Trash2, EyeOff, MessageSquareQuote } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useTable } from '../lib/useTable'
import { useCounts } from '../lib/counts.jsx'
import { errorText, timeAgo } from '../lib/format'
import { useFeedback } from '../components/ui/feedback.jsx'
import { Avatar, Badge, Button, Card, EmptyState, ErrorState, FilterTabs, PageHeader, Skeleton, Stars } from '../components/ui/index.jsx'

export default function Testimonials() {
  const { items, setItems, loading, error, reload } = useTable('testimonials')
  const { refresh } = useCounts()
  const { toast, confirm } = useFeedback()
  const [tab, setTab] = useState('pending')
  const [busy, setBusy] = useState(null)

  const pending = items.filter((t) => !t.approved), approved = items.filter((t) => t.approved)
  const shown = useMemo(() => (tab === 'pending' ? pending : tab === 'approved' ? approved : items), [tab, items]) // eslint-disable-line

  async function setApproved(t, value) {
    setBusy(t.id)
    const { error: err } = await supabase.from('testimonials').update({ approved: value }).eq('id', t.id)
    setBusy(null)
    if (err) { console.error(err); toast.error(`Couldn’t update: ${errorText(err)}`); return }
    setItems((prev) => prev.map((x) => (x.id === t.id ? { ...x, approved: value } : x)))
    toast.success(value ? 'Published on your website.' : 'Hidden from your website.')
    refresh()
  }

  async function remove(t) {
    const ok = await confirm({ title: 'Delete this review?', message: `The review from ${t.name} will be permanently deleted.`, confirmLabel: 'Delete review', danger: true })
    if (!ok) return
    setBusy(t.id)
    const { error: err } = await supabase.from('testimonials').delete().eq('id', t.id)
    setBusy(null)
    if (err) { console.error(err); toast.error(`Couldn’t delete: ${errorText(err)}`); return }
    setItems((prev) => prev.filter((x) => x.id !== t.id))
    toast.success('Review deleted.')
    refresh()
  }

  return (
    <>
      <PageHeader title="Testimonials" description="Reviews arrive here from the form on your website. Only approved reviews are shown to visitors." />
      {error ? <ErrorState error={error} onRetry={reload} /> : loading ? (
        <div className="space-y-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-36" />)}</div>
      ) : (
        <>
          <div className="mb-5">
            <FilterTabs label="Filter reviews" value={tab} onChange={setTab}
              options={[{ value: 'pending', label: 'Awaiting approval', count: pending.length }, { value: 'approved', label: 'Published', count: approved.length }, { value: 'all', label: 'All', count: items.length }]} />
          </div>
          {shown.length === 0 ? (
            <EmptyState icon={MessageSquareQuote} title={tab === 'pending' ? 'Nothing waiting for approval' : 'No reviews here yet'}>
              {tab === 'pending' ? 'When a client submits a review on your website it will show up here for you to approve.' : 'Reviews you approve will be listed here.'}
            </EmptyState>
          ) : (
            <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {shown.map((t) => (
                <li key={t.id}>
                  <Card className="p-5 h-full flex flex-col">
                    <div className="flex items-start gap-3">
                      <Avatar name={t.name} size={40} />
                      <div className="min-w-0 flex-1">
                        <p className="font-bold truncate">{t.name}</p>
                        <p className="text-[13px] text-muted truncate">{t.business}{t.created_at ? ` · ${timeAgo(t)}` : ''}</p>
                      </div>
                      <Badge tone={t.approved ? 'green' : 'gold'}>{t.approved ? 'Published' : 'Pending'}</Badge>
                    </div>
                    <div className="mt-4"><Stars value={Number(t.rating) || 0} /></div>
                    <p className="text-sm text-soft leading-relaxed mt-3 flex-1 whitespace-pre-wrap [overflow-wrap:anywhere]">“{t.text}”</p>
                    <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-line">
                      {t.approved
                        ? <Button variant="secondary" size="sm" icon={EyeOff} loading={busy === t.id} onClick={() => setApproved(t, false)}>Unpublish</Button>
                        : <Button size="sm" icon={Check} loading={busy === t.id} onClick={() => setApproved(t, true)}>Approve &amp; publish</Button>}
                      <Button variant="danger" size="sm" icon={Trash2} disabled={busy === t.id} onClick={() => remove(t)}>Delete</Button>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </>
  )
}
