import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Plus, Pencil, Trash2, ExternalLink, Upload, Search, FolderOpen, FileText, ImageOff } from 'lucide-react'
import { supabase, SITE_URL } from '../lib/supabase'
import { useTable, useColumnProbe } from '../lib/useTable'
import { errorText, safeFileName, safeUrl } from '../lib/format'
import { useFeedback } from '../components/ui/feedback.jsx'
import { Badge, Button, Card, EmptyState, ErrorState, FilterTabs, IconButton, Input, Modal, Notice, PageHeader, Select, Skeleton, Textarea, Thumb, Toggle } from '../components/ui/index.jsx'

const CATEGORIES = ['Website', 'App', 'Graphics', 'Branding']
const MAX_IMAGE_MB = 5
const hasCaseStudy = (p) => ['problem', 'solution', 'result'].some((k) => String(p[k] || '').trim())

function ProjectModal({ project, caseFields, onClose, onSaved }) {
  const { toast } = useFeedback()
  const editing = Boolean(project)
  const [form, setForm] = useState({
    title: project?.title || '', category: project?.category || 'Website', description: project?.description || '',
    liveurl: project?.liveurl || '', featured: editing ? Boolean(project.featured) : true,
    client: project?.client || '', year: project?.year || '', problem: project?.problem || '', solution: project?.solution || '',
    result: project?.result || '', gallery: project?.gallery || '',
  })
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(project?.image || '')
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [drag, setDrag] = useState(false)
  const fileInput = useRef(null)
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  useEffect(() => () => { preview?.startsWith('blob:') && URL.revokeObjectURL(preview) }, [preview])

  function pick(f) {
    if (!f) return
    if (!f.type.startsWith('image/')) return setErrors((e) => ({ ...e, image: 'Please choose an image (PNG, JPG or WebP).' }))
    if (f.size > MAX_IMAGE_MB * 1024 * 1024) return setErrors((e) => ({ ...e, image: `That image is ${(f.size / 1048576).toFixed(1)} MB. Please keep it under ${MAX_IMAGE_MB} MB.` }))
    setErrors((e) => ({ ...e, image: undefined }))
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  async function save() {
    const next = {}
    if (!form.title.trim()) next.title = 'Give the project a name.'
    if (form.liveurl.trim() && !safeUrl(form.liveurl)) next.liveurl = 'Enter a valid web address, for example https://example.com'
    setErrors(next)
    if (Object.keys(next).length) return

    setSaving(true)
    let image = project?.image || ''
    if (file) {
      const fileName = safeFileName(file.name)
      const { error: upErr } = await supabase.storage.from('portfolio-images').upload(fileName, file)
      if (upErr) { console.error(upErr); toast.error(`Image upload failed: ${errorText(upErr)}`); setSaving(false); return }
      image = supabase.storage.from('portfolio-images').getPublicUrl(fileName).data.publicUrl
    }

    const payload = {
      title: form.title.trim(), category: form.category, description: form.description.trim(),
      liveurl: form.liveurl.trim() ? safeUrl(form.liveurl) : null, image, featured: form.featured,
    }
    if (caseFields) {
      ;['client', 'year', 'problem', 'solution', 'result', 'gallery'].forEach((k) => { payload[k] = form[k].trim() || null })
    }

    const q = editing ? supabase.from('portfolio').update(payload).eq('id', project.id).select() : supabase.from('portfolio').insert([payload]).select()
    const { data, error } = await q
    setSaving(false)
    if (error || !data?.[0]) { console.error(error); toast.error(`Couldn’t save the project: ${errorText(error) || 'no data returned'}`); return }
    toast.success(editing ? 'Project updated.' : 'Project added to your portfolio.')
    onSaved(data[0], editing)
  }

  return (
    <Modal title={editing ? 'Edit project' : 'Add project'} description="This is what visitors see in your portfolio." onClose={onClose} size="xl"
      footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button onClick={save} loading={saving}>{saving ? 'Saving…' : editing ? 'Save changes' : 'Add project'}</Button></>}>
      <div className="space-y-5">
        <div>
          <p className="text-[13px] font-semibold text-soft mb-1.5">Screenshot</p>
          <input ref={fileInput} type="file" accept="image/*" className="sr-only" tabIndex={-1} onChange={(e) => pick(e.target.files[0])} />
          <div onDragOver={(e) => { e.preventDefault(); setDrag(true) }} onDragLeave={() => setDrag(false)}
            onDrop={(e) => { e.preventDefault(); setDrag(false); pick(e.dataTransfer.files[0]) }}
            className={`rounded-[12px] border border-dashed transition-colors ${drag ? 'border-brand-500 bg-brand-500/5' : 'border-line-strong'}`}>
            {preview ? (
              <div className="p-3 flex flex-col sm:flex-row gap-4 items-start">
                <img src={preview} alt="Project preview" className="w-full sm:w-56 aspect-[16/10] object-cover object-top rounded-lg border border-line" />
                <div className="text-sm text-muted">
                  <p className="text-soft font-medium mb-1">{file ? file.name : 'Current image'}</p>
                  <Button variant="secondary" size="sm" icon={Upload} onClick={() => fileInput.current.click()}>Replace image</Button>
                </div>
              </div>
            ) : (
              <button type="button" onClick={() => fileInput.current.click()} className="w-full px-4 py-8 text-center">
                <Upload size={22} className="mx-auto text-muted mb-2" aria-hidden="true" />
                <span className="block text-sm text-soft font-medium">Click to upload, or drag an image here</span>
                <span className="block text-xs text-muted mt-1">A desktop screenshot works best (about 1600×1000). PNG, JPG or WebP, up to {MAX_IMAGE_MB} MB.</span>
              </button>
            )}
          </div>
          {errors.image && <p className="text-xs text-red-300 mt-1.5" role="alert">{errors.image}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Project name" placeholder="e.g. Vendora POS" value={form.title} onChange={set('title')} error={errors.title} className="sm:col-span-2" data-autofocus />
          <Select label="Category" options={CATEGORIES} value={form.category} onChange={set('category')} />
          <Input label="Live website (optional)" placeholder="https://…" inputMode="url" value={form.liveurl} onChange={set('liveurl')} error={errors.liveurl} />
          <Textarea label="Short description" rows={3} placeholder="One or two sentences about what it is and who it’s for." value={form.description} onChange={set('description')} className="sm:col-span-2" />
          <div className="sm:col-span-2 flex items-center justify-between gap-4 rounded-[12px] border border-line px-4 py-3">
            <div><p className="text-sm font-semibold">Featured</p><p className="text-xs text-muted">Marks this as one of your best projects.</p></div>
            <Toggle checked={form.featured} onChange={(v) => setForm((f) => ({ ...f, featured: v }))} label="Featured project" />
          </div>
        </div>

        <fieldset className="border-t border-line pt-5">
          <legend className="font-display font-bold text-base pr-3 flex items-center gap-2"><FileText size={16} className="text-gold" aria-hidden="true" />Case study (optional)</legend>
          {!caseFields ? (
            <Notice tone="warn" title="One-time setup needed">
              To add case-study text, run the SQL shown in <strong>Settings → Setup</strong> once. Until then this section stays off and nothing else is affected.
            </Notice>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
              <p className="sm:col-span-2 text-xs text-muted -mt-1">Fill in the problem, what you built, or the result and the project’s card on your website will link to a full case-study page. Only write what you can stand behind.</p>
              <Input label="Client" placeholder="Business name" value={form.client} onChange={set('client')} />
              <Input label="Year" placeholder="2026" inputMode="numeric" value={form.year} onChange={set('year')} />
              <Textarea label="The problem" rows={3} placeholder="What did the client need to fix or achieve?" value={form.problem} onChange={set('problem')} className="sm:col-span-2" />
              <Textarea label="What we built" rows={3} placeholder="What did you design and build?" value={form.solution} onChange={set('solution')} className="sm:col-span-2" />
              <Textarea label="The result" rows={3} placeholder="What changed? Leave blank if you don’t have a verified result." value={form.result} onChange={set('result')} className="sm:col-span-2" />
              <Textarea label="Extra screenshots" rows={3} placeholder={'One image link per line.\nCopy links from the Media library.'} value={form.gallery} onChange={set('gallery')} className="sm:col-span-2" />
            </div>
          )}
        </fieldset>
      </div>
    </Modal>
  )
}

export default function Portfolio() {
  const { items, setItems, loading, error, reload } = useTable('portfolio')
  const caseFields = useColumnProbe('portfolio', 'problem')
  const { toast, confirm } = useFeedback()
  const [params, setParams] = useSearchParams()
  const [modal, setModal] = useState(null) // null | 'new' | project
  const [filter, setFilter] = useState('All')
  const [query, setQuery] = useState('')

  useEffect(() => { if (params.get('new')) { setModal('new'); setParams({}, { replace: true }) } }, [params, setParams])

  const categories = useMemo(() => ['All', ...new Set([...CATEGORIES.filter((c) => items.some((p) => p.category === c)), ...items.map((p) => p.category).filter(Boolean)])], [items])
  const filtered = useMemo(() => items.filter((p) => (filter === 'All' || p.category === filter) && (!query.trim() || `${p.title} ${p.description}`.toLowerCase().includes(query.trim().toLowerCase()))), [items, filter, query])

  async function remove(p) {
    const ok = await confirm({ title: 'Delete this project?', message: `“${p.title}” will be removed from your website. This can’t be undone.`, confirmLabel: 'Delete project', danger: true })
    if (!ok) return
    const { error: err } = await supabase.from('portfolio').delete().eq('id', p.id)
    if (err) { console.error(err); toast.error(`Couldn’t delete: ${errorText(err)}`); return }
    setItems((prev) => prev.filter((x) => x.id !== p.id))
    toast.success('Project deleted.')
  }

  function saved(row, editing) {
    setItems((prev) => (editing ? prev.map((x) => (x.id === row.id ? row : x)) : [row, ...prev]))
    setModal(null)
  }

  return (
    <>
      <PageHeader title="Portfolio" description={`${items.length} project${items.length === 1 ? '' : 's'} shown on your website.`}
        actions={<Button icon={Plus} onClick={() => setModal('new')}>Add project</Button>} />

      {error ? <ErrorState error={error} onRetry={reload} /> : loading ? (
        <div className="space-y-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-24" />)}</div>
      ) : items.length === 0 ? (
        <EmptyState icon={FolderOpen} title="No projects yet" action={<Button icon={Plus} onClick={() => setModal('new')}>Add your first project</Button>}>
          Add a project with a screenshot and it appears on your website straight away.
        </EmptyState>
      ) : (
        <>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-5">
            <FilterTabs label="Filter by category" value={filter} onChange={setFilter}
              options={categories.map((c) => ({ value: c, label: c, count: c === 'All' ? items.length : items.filter((p) => p.category === c).length }))} />
            <div className="relative lg:w-72">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" aria-hidden="true" />
              <input type="search" aria-label="Search projects" placeholder="Search projects" value={query} onChange={(e) => setQuery(e.target.value)}
                className="w-full min-h-[44px] rounded-[10px] bg-ink-950 border border-line-strong pl-10 pr-3 text-base sm:text-sm placeholder:text-slate-500 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30" />
            </div>
          </div>

          {filtered.length === 0 ? <EmptyState title="No matching projects">Try a different category or search term.</EmptyState> : (
            <ul className="space-y-3">
              {filtered.map((p) => {
                const live = safeUrl(p.liveurl)
                return (
                  <li key={p.id}>
                    <Card className="p-3 sm:p-4 flex flex-col sm:flex-row gap-4 sm:items-center">
                      <div className="w-full sm:w-36 shrink-0 aspect-[16/10] rounded-lg overflow-hidden bg-ink-800 border border-line grid place-items-center">
                        <Thumb src={p.image} className="w-full h-full object-cover object-top" fallback={<ImageOff size={20} className="text-slate-500" aria-label="No image" />} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-bold text-base truncate max-w-full">{p.title}</h3>
                          <Badge tone="blue">{p.category}</Badge>
                          {p.featured && <Badge tone="gold">Featured</Badge>}
                          {hasCaseStudy(p) && <Badge tone="green">Case study</Badge>}
                        </div>
                        <p className="text-sm text-muted line-clamp-2">{p.description || 'No description yet.'}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 -mx-1 sm:mx-0">
                        {hasCaseStudy(p) && <IconButton icon={FileText} label="Preview case study" onClick={() => window.open(`${SITE_URL}/project.html?id=${encodeURIComponent(p.id)}`, '_blank', 'noopener')} />}
                        {live && <IconButton icon={ExternalLink} label="Open live site" onClick={() => window.open(live, '_blank', 'noopener')} />}
                        <IconButton icon={Pencil} label={`Edit ${p.title}`} onClick={() => setModal(p)} />
                        <IconButton icon={Trash2} label={`Delete ${p.title}`} variant="danger" onClick={() => remove(p)} />
                      </div>
                    </Card>
                  </li>
                )
              })}
            </ul>
          )}
        </>
      )}

      {modal && <ProjectModal project={modal === 'new' ? null : modal} caseFields={caseFields === true} onClose={() => setModal(null)} onSaved={saved} />}
    </>
  )
}
