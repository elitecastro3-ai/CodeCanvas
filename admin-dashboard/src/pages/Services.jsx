import { useMemo, useState } from 'react'
import { Plus, Pencil, Trash2, Wrench } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useTable } from '../lib/useTable'
import { errorText, formatUGX } from '../lib/format'
import { useFeedback } from '../components/ui/feedback.jsx'
import { Badge, Button, Card, EmptyState, ErrorState, FilterTabs, IconButton, Input, Modal, Notice, PageHeader, Select, Skeleton, Toggle } from '../components/ui/index.jsx'

const CATEGORIES = ['Web', 'App', 'Design']
const TONE = { Web: 'blue', App: 'neutral', Design: 'gold' }

function ServiceModal({ service, onClose, onSaved }) {
  const { toast } = useFeedback()
  const editing = Boolean(service)
  const [form, setForm] = useState({ name: service?.name || '', category: service?.category || 'Web', min: service?.pricemin ?? '', max: service?.pricemax ?? '' })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  async function save() {
    const next = {}
    const min = Number(form.min), max = Number(form.max)
    if (!form.name.trim()) next.name = 'Give the service a name.'
    if (form.min === '' || !Number.isFinite(min) || min < 0) next.min = 'Enter a starting price.'
    if (form.max === '' || !Number.isFinite(max) || max < 0) next.max = 'Enter a top price.'
    else if (Number.isFinite(min) && max < min) next.max = 'The top price can’t be lower than the starting price.'
    setErrors(next)
    if (Object.keys(next).length) return

    setSaving(true)
    const payload = { name: form.name.trim(), category: form.category, pricemin: min, pricemax: max }
    if (!editing) payload.active = true
    const q = editing ? supabase.from('services').update(payload).eq('id', service.id).select() : supabase.from('services').insert([payload]).select()
    const { data, error } = await q
    setSaving(false)
    if (error || !data?.[0]) { console.error(error); toast.error(`Couldn’t save the service: ${errorText(error)}`); return }
    toast.success(editing ? 'Service updated.' : 'Service added.')
    onSaved(data[0], editing)
  }

  return (
    <Modal title={editing ? 'Edit service' : 'Add service'} onClose={onClose}
      footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button onClick={save} loading={saving}>{saving ? 'Saving…' : editing ? 'Save changes' : 'Add service'}</Button></>}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Service name" placeholder="e.g. Business Website (5 pages)" value={form.name} onChange={set('name')} error={errors.name} className="sm:col-span-2" data-autofocus />
        <Select label="Category" options={CATEGORIES} value={form.category} onChange={set('category')} className="sm:col-span-2" />
        <Input label="Starting price (UGX)" type="number" inputMode="numeric" min="0" placeholder="300000" value={form.min} onChange={set('min')} error={errors.min} />
        <Input label="Top price (UGX)" type="number" inputMode="numeric" min="0" placeholder="600000" value={form.max} onChange={set('max')} error={errors.max} />
      </div>
    </Modal>
  )
}

export default function Services() {
  const { items, setItems, loading, error, reload } = useTable('services', { order: 'id', ascending: true })
  const { toast, confirm } = useFeedback()
  const [modal, setModal] = useState(null)
  const [filter, setFilter] = useState('All')
  const [busyId, setBusyId] = useState(null)

  const categories = useMemo(() => ['All', ...new Set([...CATEGORIES, ...items.map((s) => s.category).filter(Boolean)])], [items])
  const filtered = filter === 'All' ? items : items.filter((s) => s.category === filter)

  async function toggle(s, active) {
    setBusyId(s.id)
    setItems((prev) => prev.map((x) => (x.id === s.id ? { ...x, active } : x))) // optimistic
    const { error: err } = await supabase.from('services').update({ active }).eq('id', s.id)
    setBusyId(null)
    if (err) { console.error(err); setItems((prev) => prev.map((x) => (x.id === s.id ? { ...x, active: !active } : x))); toast.error(`Couldn’t update: ${errorText(err)}`) }
  }

  async function remove(s) {
    const ok = await confirm({ title: 'Delete this service?', message: `“${s.name}” will be permanently removed.`, confirmLabel: 'Delete service', danger: true })
    if (!ok) return
    const { error: err } = await supabase.from('services').delete().eq('id', s.id)
    if (err) { console.error(err); toast.error(`Couldn’t delete: ${errorText(err)}`); return }
    setItems((prev) => prev.filter((x) => x.id !== s.id))
    toast.success('Service deleted.')
  }

  const saved = (row, editing) => { setItems((prev) => (editing ? prev.map((x) => (x.id === row.id ? row : x)) : [...prev, row])); setModal(null) }

  return (
    <>
      <PageHeader title="Services" description={`${items.filter((s) => s.active).length} active of ${items.length} services and their price ranges.`}
        actions={<Button icon={Plus} onClick={() => setModal('new')}>Add service</Button>} />
      <div className="mb-6">
        <Notice title="Heads up">This list is for your own pricing records. The prices shown on your website are written directly into the page, so changing them here doesn’t change the website.</Notice>
      </div>

      {error ? <ErrorState error={error} onRetry={reload} /> : loading ? (
        <div className="space-y-3">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-16" />)}</div>
      ) : items.length === 0 ? (
        <EmptyState icon={Wrench} title="No services yet" action={<Button icon={Plus} onClick={() => setModal('new')}>Add a service</Button>}>Add the services you offer with a price range for each.</EmptyState>
      ) : (
        <>
          <div className="mb-5">
            <FilterTabs label="Filter by category" value={filter} onChange={setFilter}
              options={categories.map((c) => ({ value: c, label: c, count: c === 'All' ? items.length : items.filter((s) => s.category === c).length }))} />
          </div>
          {filtered.length === 0 ? <EmptyState title="Nothing in this category" /> : (
            <ul className="space-y-3">
              {filtered.map((s) => (
                <li key={s.id}>
                  <Card className={`p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 ${s.active ? '' : 'opacity-70'}`}>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold truncate max-w-full">{s.name}</h3>
                        <Badge tone={TONE[s.category] || 'neutral'}>{s.category}</Badge>
                        {!s.active && <Badge>Hidden</Badge>}
                      </div>
                      <p className="font-mono text-sm text-muted mt-1">{formatUGX(s.pricemin)} – {formatUGX(s.pricemax)}</p>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-3">
                      <label className="flex items-center gap-2 text-[13px] text-muted">
                        <Toggle checked={Boolean(s.active)} onChange={(v) => toggle(s, v)} label={`${s.name} active`} disabled={busyId === s.id} />
                        {s.active ? 'Active' : 'Inactive'}
                      </label>
                      <div className="flex gap-1">
                        <IconButton icon={Pencil} label={`Edit ${s.name}`} onClick={() => setModal(s)} />
                        <IconButton icon={Trash2} label={`Delete ${s.name}`} variant="danger" onClick={() => remove(s)} />
                      </div>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
      {modal && <ServiceModal service={modal === 'new' ? null : modal} onClose={() => setModal(null)} onSaved={saved} />}
    </>
  )
}
