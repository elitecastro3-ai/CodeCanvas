import { useEffect, useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FolderOpen, MessageSquare, MessageSquareQuote, Star, ArrowRight, Plus, Upload } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { isUnread } from '../lib/messageState'
import { timeAgo } from '../lib/format'
import { Avatar, Badge, Button, Card, ErrorState, PageHeader, Skeleton, Stars } from '../components/ui/index.jsx'

function Tile({ icon: Icon, label, value, note, to }) {
  return (
    <Link to={to} className="group block bg-ink-900 border border-line rounded-[14px] p-5 hover:border-line-strong transition-colors">
      <div className="flex items-center justify-between text-muted">
        <span className="label-mono">{label}</span>
        <Icon size={17} aria-hidden="true" />
      </div>
      <p className="font-display text-4xl font-extrabold mt-3 leading-none">{value}</p>
      <p className="text-[13px] text-muted mt-2">{note}</p>
    </Link>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setError(null)
    const [p, m, t] = await Promise.all([
      supabase.from('portfolio').select('id', { count: 'exact', head: true }),
      supabase.from('messages').select('*').order('id', { ascending: false }),
      supabase.from('testimonials').select('*').order('id', { ascending: false }),
    ])
    const failed = p.error || m.error || t.error
    if (failed) { setError(failed); return }
    const messages = m.data || []
    const reviews = t.data || []
    const approved = reviews.filter((r) => r.approved)
    setData({
      projects: p.count || 0,
      messages,
      unread: messages.filter((x) => isUnread(x)),
      pending: reviews.filter((r) => !r.approved),
      avg: approved.length ? approved.reduce((s, r) => s + (Number(r.rating) || 0), 0) / approved.length : null,
      approvedCount: approved.length,
    })
  }, [])

  useEffect(() => { load() }, [load])

  if (error) return <ErrorState error={error} onRetry={load} />
  if (!data) {
    return (
      <div className="space-y-6" aria-busy="true">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-32" />)}</div>
        <Skeleton className="h-64" />
      </div>
    )
  }

  const attention = data.unread.length + data.pending.length

  return (
    <>
      <PageHeader title="Overview" description="Where your site and your inbox stand right now. Every number here comes from your live data."
        actions={<Button icon={Plus} onClick={() => navigate('/portfolio?new=1')}>Add project</Button>} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Tile to="/portfolio" icon={FolderOpen} label="Projects" value={data.projects} note="Published in your portfolio" />
        <Tile to="/messages" icon={MessageSquare} label="New messages" value={data.unread.length} note={`${data.messages.length} enquiries in total`} />
        <Tile to="/testimonials" icon={MessageSquareQuote} label="Awaiting review" value={data.pending.length} note="Reviews to approve or remove" />
        <Tile to="/testimonials" icon={Star} label="Average rating" value={data.avg ? data.avg.toFixed(1) : '—'}
          note={data.approvedCount ? `From ${data.approvedCount} published review${data.approvedCount > 1 ? 's' : ''}` : 'No published reviews yet'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mt-6">
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">Needs your attention</h3>
            {attention > 0 && <Badge tone="gold">{attention} open</Badge>}
          </div>

          {attention === 0 ? (
            <p className="text-sm text-muted py-6">You’re all caught up. New enquiries and reviews will appear here.</p>
          ) : (
            <ul className="divide-y divide-line">
              {data.unread.slice(0, 5).map((m) => (
                <li key={`m${m.id}`}>
                  <Link to="/messages" className="flex items-center gap-3 py-3 hover:bg-white/[0.03] -mx-2 px-2 rounded-lg transition-colors">
                    <Avatar name={m.name} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold truncate">{m.name} <span className="font-normal text-muted">· {m.service}</span></p>
                      <p className="text-[13px] text-muted truncate">{m.message}</p>
                    </div>
                    <span className="text-xs text-muted shrink-0 hidden sm:block">{timeAgo(m)}</span>
                  </Link>
                </li>
              ))}
              {data.pending.slice(0, 4).map((r) => (
                <li key={`r${r.id}`}>
                  <Link to="/testimonials" className="flex items-center gap-3 py-3 hover:bg-white/[0.03] -mx-2 px-2 rounded-lg transition-colors">
                    <Avatar name={r.name} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold truncate">{r.name} <span className="font-normal text-muted">· {r.business}</span></p>
                      <p className="text-[13px] text-muted truncate">{r.text}</p>
                    </div>
                    <Stars value={Number(r.rating) || 0} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {attention > 0 && (
            <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3 pt-3 border-t border-line text-sm">
              {data.unread.length > 0 && <Link to="/messages" className="text-brand-400 font-semibold inline-flex items-center gap-1.5 hover:underline">Open messages <ArrowRight size={14} /></Link>}
              {data.pending.length > 0 && <Link to="/testimonials" className="text-brand-400 font-semibold inline-flex items-center gap-1.5 hover:underline">Review testimonials <ArrowRight size={14} /></Link>}
            </div>
          )}
        </Card>

        <Card className="p-5">
          <h3 className="font-bold text-lg mb-4">Quick actions</h3>
          <div className="grid gap-2">
            <Button variant="secondary" icon={Plus} className="justify-start" onClick={() => navigate('/portfolio?new=1')}>Add a portfolio project</Button>
            <Button variant="secondary" icon={Upload} className="justify-start" onClick={() => navigate('/media')}>Upload media</Button>
            <Button variant="secondary" icon={MessageSquare} className="justify-start" onClick={() => navigate('/messages')}>Read messages</Button>
          </div>
          <p className="text-[13px] text-muted mt-5 pt-4 border-t border-line">
            Clients check your portfolio before they get in touch. Projects with a short case study convince more than a screenshot alone.
          </p>
        </Card>
      </div>
    </>
  )
}
