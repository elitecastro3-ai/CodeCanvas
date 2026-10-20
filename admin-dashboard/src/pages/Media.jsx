import { useMemo, useRef, useState } from 'react'
import { Upload, Trash2, Copy, ExternalLink, FileText, File as FileIcon, Image as ImageIcon, LayoutGrid, List, Search } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useTable } from '../lib/useTable'
import { errorText, safeFileName, safeUrl } from '../lib/format'
import { useFeedback } from '../components/ui/feedback.jsx'
import { Badge, Button, Card, EmptyState, ErrorState, FilterTabs, IconButton, PageHeader, Select, Skeleton, Thumb } from '../components/ui/index.jsx'

const DEFAULT_TAGS = ['Portfolio', 'Brand', 'Marketing', 'Design', 'Deliverable']
const MAX_MB = 10
const ICON = { image: ImageIcon, pdf: FileText, file: FileIcon }

export default function Media() {
  const { items, setItems, loading, error, reload } = useTable('media')
  const { toast, confirm } = useFeedback()
  const [view, setView] = useState('grid')
  const [filter, setFilter] = useState('All')
  const [query, setQuery] = useState('')
  const [tag, setTag] = useState('Portfolio')
  const [uploading, setUploading] = useState(false)
  const [drag, setDrag] = useState(false)
  const input = useRef(null)

  const tags = useMemo(() => ['All', ...new Set(items.map((i) => i.tag).filter(Boolean))], [items])
  const filtered = items.filter((i) => (filter === 'All' || i.tag === filter) && (!query.trim() || (i.name || '').toLowerCase().includes(query.trim().toLowerCase())))

  async function upload(fileList) {
    const files = [...fileList]
    if (!files.length) return
    setUploading(true)
    let ok = 0
    for (const file of files) {
      if (file.size > MAX_MB * 1048576) { toast.error(`${file.name} is over ${MAX_MB} MB, so it was skipped.`); continue }
      const fileName = safeFileName(file.name)
      const { error: upErr } = await supabase.storage.from('media-files').upload(fileName, file)
      if (upErr) { console.error(upErr); toast.error(`${file.name}: ${errorText(upErr)}`); continue }
      const url = supabase.storage.from('media-files').getPublicUrl(fileName).data.publicUrl
      const row = {
        name: file.name, tag,
        type: file.type.includes('image') ? 'image' : file.type.includes('pdf') ? 'pdf' : 'file',
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`, url,
      }
      const { data, error: dbErr } = await supabase.from('media').insert([row]).select()
      if (dbErr || !data?.length) { console.error(dbErr); toast.error(`${file.name}: uploaded but couldn’t be saved to the library.`); continue }
      setItems((prev) => [...data, ...prev]); ok++
    }
    setUploading(false)
    if (input.current) input.current.value = ''
    if (ok) toast.success(`${ok} file${ok > 1 ? 's' : ''} uploaded.`)
  }

  async function copy(item) {
    try { await navigator.clipboard.writeText(item.url); toast.success('Link copied. Paste it wherever you need it.') }
    catch { toast.error('Couldn’t copy automatically. Open the file and copy the address from there.') }
  }

  async function remove(item) {
    const ok = await confirm({ title: 'Delete this file?', message: `“${item.name}” will be removed from the library and from storage. Any page using its link will lose it.`, confirmLabel: 'Delete file', danger: true })
    if (!ok) return
    const fileName = decodeURIComponent(String(item.url || '').split('/').pop().split('?')[0])
    const { error: stErr } = await supabase.storage.from('media-files').remove([fileName])
    if (stErr) console.error(stErr)
    const { error: err } = await supabase.from('media').delete().eq('id', item.id)
    if (err) { console.error(err); toast.error(`Couldn’t delete: ${errorText(err)}`); return }
    setItems((prev) => prev.filter((x) => x.id !== item.id))
    toast.success('File deleted.')
  }

  const Actions = ({ item }) => (
    <div className="flex gap-1">
      <IconButton icon={Copy} label={`Copy link to ${item.name}`} onClick={() => copy(item)} />
      {safeUrl(item.url) && <IconButton icon={ExternalLink} label={`Open ${item.name}`} onClick={() => window.open(safeUrl(item.url), '_blank', 'noopener')} />}
      <IconButton icon={Trash2} label={`Delete ${item.name}`} variant="danger" onClick={() => remove(item)} />
    </div>
  )

  return (
    <>
      <PageHeader title="Media library" description={`${items.length} file${items.length === 1 ? '' : 's'} · ${items.filter((i) => i.type === 'image').length} images. Copy a link to use any file on your website or in a case study.`} />

      <Card className={`p-4 sm:p-5 mb-6 border-dashed transition-colors ${drag ? 'border-brand-500 bg-brand-500/5' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDrag(true) }} onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); upload(e.dataTransfer.files) }}>
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="flex-1">
            <p className="font-semibold">Upload files</p>
            <p className="text-sm text-muted mt-0.5">Drag files here or choose them. Up to {MAX_MB} MB each.</p>
          </div>
          <Select label="Tag" options={[...new Set([...DEFAULT_TAGS, ...items.map((i) => i.tag).filter(Boolean)])]} value={tag} onChange={(e) => setTag(e.target.value)} className="sm:w-44" />
          <input ref={input} type="file" multiple className="sr-only" tabIndex={-1} onChange={(e) => upload(e.target.files)} />
          <Button icon={Upload} loading={uploading} onClick={() => input.current.click()}>{uploading ? 'Uploading…' : 'Choose files'}</Button>
        </div>
      </Card>

      {error ? <ErrorState error={error} onRetry={reload} /> : loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-48" />)}</div>
      ) : items.length === 0 ? (
        <EmptyState icon={ImageIcon} title="Your library is empty">Upload screenshots, logos or documents and they’ll be kept here.</EmptyState>
      ) : (
        <>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-5">
            <FilterTabs label="Filter by tag" value={filter} onChange={setFilter} options={tags.map((t) => ({ value: t, label: t, count: t === 'All' ? items.length : items.filter((i) => i.tag === t).length }))} />
            <div className="flex gap-2">
              <div className="relative flex-1 lg:w-64">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" aria-hidden="true" />
                <input type="search" aria-label="Search files" placeholder="Search files" value={query} onChange={(e) => setQuery(e.target.value)}
                  className="w-full min-h-[44px] rounded-[10px] bg-ink-950 border border-line-strong pl-10 pr-3 text-base sm:text-sm placeholder:text-slate-500 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30" />
              </div>
              <IconButton icon={LayoutGrid} label="Grid view" variant={view === 'grid' ? 'secondary' : 'ghost'} aria-pressed={view === 'grid'} onClick={() => setView('grid')} className="w-11 h-11" />
              <IconButton icon={List} label="List view" variant={view === 'list' ? 'secondary' : 'ghost'} aria-pressed={view === 'list'} onClick={() => setView('list')} className="w-11 h-11" />
            </div>
          </div>

          {filtered.length === 0 ? <EmptyState title="No files match">Try a different tag or search term.</EmptyState> : view === 'grid' ? (
            <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {filtered.map((item) => {
                const Icon = ICON[item.type] || FileIcon
                return (
                  <li key={item.id}>
                    <Card className="overflow-hidden h-full flex flex-col">
                      <div className="aspect-[4/3] bg-ink-800 grid place-items-center">
                        {item.type === 'image' && safeUrl(item.url)
                          ? <Thumb src={safeUrl(item.url)} className="w-full h-full object-cover" fallback={<Icon size={34} className="text-slate-500" aria-hidden="true" />} />
                          : <Icon size={34} className="text-slate-500" aria-hidden="true" />}
                      </div>
                      <div className="p-3 flex-1 flex flex-col gap-2">
                        <p className="text-sm font-medium truncate" title={item.name}>{item.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted"><span className="font-mono">{item.size}</span>{item.tag && <Badge>{item.tag}</Badge>}</div>
                        <div className="mt-auto -ml-1.5"><Actions item={item} /></div>
                      </div>
                    </Card>
                  </li>
                )
              })}
            </ul>
          ) : (
            <Card className="divide-y divide-line">
              {filtered.map((item) => {
                const Icon = ICON[item.type] || FileIcon
                return (
                  <div key={item.id} className="flex items-center gap-3 p-3">
                    <div className="w-12 h-12 rounded-lg bg-ink-800 border border-line overflow-hidden grid place-items-center shrink-0">
                      {item.type === 'image' && safeUrl(item.url) ? <Thumb src={safeUrl(item.url)} className="w-full h-full object-cover" fallback={<Icon size={20} className="text-slate-500" aria-hidden="true" />} /> : <Icon size={20} className="text-slate-500" aria-hidden="true" />}
                    </div>
                    <div className="min-w-0 flex-1"><p className="text-sm font-medium truncate">{item.name}</p><p className="text-xs text-muted font-mono">{item.size}{item.tag ? ` · ${item.tag}` : ''}</p></div>
                    <Actions item={item} />
                  </div>
                )
              })}
            </Card>
          )}
        </>
      )}
    </>
  )
}
