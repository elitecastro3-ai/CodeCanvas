export const formatUGX = (n) => {
  const v = Number(n)
  if (!Number.isFinite(v)) return '—'
  return 'UGX ' + v.toLocaleString('en-UG')
}

export const initials = (name = '') =>
  name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '').join('') || '?'

const when = (row) => row?.created_at || row?.date || null

export const formatDate = (row) => {
  const d = new Date(typeof row === 'string' ? row : when(row))
  return isNaN(d) ? '' : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export const timeAgo = (row) => {
  const d = new Date(typeof row === 'string' ? row : when(row))
  if (isNaN(d)) return ''
  const s = Math.max(0, Math.floor((Date.now() - d) / 1000))
  const units = [['year', 31536000], ['month', 2592000], ['week', 604800], ['day', 86400], ['hour', 3600], ['minute', 60]]
  for (const [name, secs] of units) {
    const n = Math.floor(s / secs)
    if (n >= 1) return `${n} ${name}${n > 1 ? 's' : ''} ago`
  }
  return 'Just now'
}

export const createdAt = when

/** Only http(s) links are ever rendered from database content. */
export const safeUrl = (raw) => {
  if (!raw) return ''
  let url = String(raw).trim()
  if (!url) return ''
  if (!/^[a-z][a-z0-9+.-]*:/i.test(url)) url = 'https://' + url
  try {
    const u = new URL(url)
    return u.protocol === 'http:' || u.protocol === 'https:' ? u.href : ''
  } catch { return '' }
}

/** Storage-safe file name: keeps the extension, strips spaces and symbols. */
export const safeFileName = (name) => {
  const dot = name.lastIndexOf('.')
  const base = (dot > 0 ? name.slice(0, dot) : name).normalize('NFKD').replace(/[^\w-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').toLowerCase() || 'file'
  const ext = dot > 0 ? name.slice(dot).toLowerCase().replace(/[^.\w]/g, '') : ''
  return `${Date.now()}-${base}${ext}`
}

export const errorText = (err) => (err && (err.message || String(err))) || 'Something went wrong.'
