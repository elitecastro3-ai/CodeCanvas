import { useMemo } from 'react'
import { useTable } from '../lib/useTable'
import { createdAt } from '../lib/format'
import { Card, ErrorState, Notice, PageHeader, Skeleton, Stars } from '../components/ui/index.jsx'

function Bars({ rows, empty }) {
  const max = Math.max(1, ...rows.map((r) => r.value))
  if (!rows.length) return <p className="text-sm text-muted py-4">{empty}</p>
  return (
    <ul className="space-y-3">
      {rows.map((r) => (
        <li key={r.label}>
          <div className="flex justify-between gap-3 text-sm mb-1.5">
            <span className="truncate">{r.label}</span><span className="font-mono text-muted">{r.value}</span>
          </div>
          <div className="h-2 rounded-full bg-ink-800 overflow-hidden"><div className="h-full rounded-full bg-brand-500" style={{ width: `${(r.value / max) * 100}%` }} /></div>
        </li>
      ))}
    </ul>
  )
}

export default function Analytics() {
  const msgs = useTable('messages')
  const reviews = useTable('testimonials')
  const projects = useTable('portfolio')
  const loading = msgs.loading || reviews.loading || projects.loading
  const error = msgs.error || reviews.error || projects.error

  const stats = useMemo(() => {
    // Enquiries per month, last 6 months
    const now = new Date()
    const months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
      return { key: `${d.getFullYear()}-${d.getMonth()}`, label: d.toLocaleDateString('en-GB', { month: 'short' }), value: 0 }
    })
    let dated = 0
    msgs.items.forEach((m) => {
      const d = new Date(createdAt(m)); if (isNaN(d)) return
      dated++
      const row = months.find((x) => x.key === `${d.getFullYear()}-${d.getMonth()}`); if (row) row.value++
    })
    const count = (arr, fn) => Object.entries(arr.reduce((a, x) => { const k = fn(x) || 'Other'; a[k] = (a[k] || 0) + 1; return a }, {})).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value)
    const approved = reviews.items.filter((r) => r.approved)
    const dist = [5, 4, 3, 2, 1].map((n) => ({ label: `${n} star${n > 1 ? 's' : ''}`, value: approved.filter((r) => Number(r.rating) === n).length }))
    return {
      months, dated, byService: count(msgs.items, (m) => m.service), byCategory: count(projects.items, (p) => p.category), dist,
      avg: approved.length ? approved.reduce((s, r) => s + (Number(r.rating) || 0), 0) / approved.length : null, approved: approved.length,
    }
  }, [msgs.items, reviews.items, projects.items])

  if (error) return <ErrorState error={error} onRetry={() => { msgs.reload(); reviews.reload(); projects.reload() }} />
  if (loading) return <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-64" />)}</div>

  const maxMonth = Math.max(1, ...stats.months.map((m) => m.value))

  return (
    <>
      <PageHeader title="Analytics" description="What your enquiries, reviews and projects say about the business." />
      <div className="mb-6">
        <Notice title="About these numbers">
          Everything here is calculated from your messages, reviews and projects. Website visitor tracking isn’t set up yet; a privacy-friendly tool such as Plausible or Vercel Analytics would add that.
        </Notice>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <Card className="p-5 md:col-span-2">
          <div className="flex items-baseline justify-between mb-5">
            <h3 className="font-bold text-lg">Enquiries per month</h3>
            <span className="text-sm text-muted">{msgs.items.length} total</span>
          </div>
          {stats.dated === 0 && msgs.items.length > 0 ? (
            <p className="text-sm text-muted">Your messages don’t have dates, so a monthly breakdown isn’t possible. Add a <code className="font-mono text-soft">created_at</code> column to the messages table to enable it.</p>
          ) : (
            <div className="flex items-end gap-2 sm:gap-4 h-44" role="img" aria-label={`Enquiries per month: ${stats.months.map((m) => `${m.label} ${m.value}`).join(', ')}`}>
              {stats.months.map((m) => (
                <div key={m.key} className="flex-1 flex flex-col items-center justify-end h-full min-w-0">
                  <span className="font-mono text-xs text-muted mb-1.5">{m.value}</span>
                  <div className="w-full max-w-[56px] rounded-t-md bg-brand-500" style={{ height: `${Math.max(4, (m.value / maxMonth) * 100)}%`, opacity: m.value ? 1 : 0.25 }} />
                  <span className="label-mono text-muted mt-2">{m.label}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-5">
          <h3 className="font-bold text-lg mb-5">Enquiries by service</h3>
          <Bars rows={stats.byService} empty="No enquiries yet." />
        </Card>

        <Card className="p-5">
          <h3 className="font-bold text-lg mb-5">Portfolio by category</h3>
          <Bars rows={stats.byCategory} empty="No projects yet." />
        </Card>

        <Card className="p-5 md:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <h3 className="font-bold text-lg">Published reviews</h3>
            {stats.avg ? <span className="inline-flex items-center gap-2"><Stars value={Math.round(stats.avg)} /><span className="font-mono text-sm text-muted">{stats.avg.toFixed(1)} from {stats.approved}</span></span> : null}
          </div>
          {stats.approved ? <Bars rows={stats.dist} empty="" /> : <p className="text-sm text-muted">No published reviews yet. Approve a review in Testimonials and it will show here.</p>}
        </Card>
      </div>
    </>
  )
}
