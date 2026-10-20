import { useEffect, useId, useRef, useState } from 'react'
import { X, Loader2, AlertCircle, Inbox, RefreshCw } from 'lucide-react'

/* ── Utilities ───────────────────────────────────────────────────────── */
const cx = (...c) => c.filter(Boolean).join(' ')

/* ── Button ──────────────────────────────────────────────────────────── */
const BTN = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 border-transparent',
  secondary: 'bg-transparent text-white border-line-strong hover:border-white/70 hover:bg-white/5',
  ghost: 'bg-transparent text-muted border-transparent hover:text-white hover:bg-white/5',
  danger: 'bg-transparent text-red-300 border-red-400/40 hover:bg-red-500/10 hover:border-red-400/70',
  dangerSolid: 'bg-red-600 text-white hover:bg-red-700 border-transparent',
}
const BTN_SIZE = { md: 'min-h-[44px] px-4 text-sm', sm: 'min-h-[36px] px-3 text-[13px]' }

export function Button({ variant = 'primary', size = 'md', icon: Icon, loading, className, children, as: As = 'button', ...rest }) {
  const props = As === 'button' ? { type: 'button', ...rest } : rest
  return (
    <As
      {...props}
      disabled={rest.disabled || loading}
      className={cx(
        'inline-flex items-center justify-center gap-2 rounded-[10px] border font-semibold transition-colors',
        'disabled:opacity-60 disabled:cursor-not-allowed', BTN[variant], BTN_SIZE[size], className
      )}
    >
      {loading ? <Loader2 size={16} className="spin" aria-hidden="true" /> : Icon ? <Icon size={16} aria-hidden="true" /> : null}
      {children}
    </As>
  )
}

export function IconButton({ icon: Icon, label, variant = 'ghost', className, ...rest }) {
  return (
    <button
      type="button" aria-label={label} title={label} {...rest}
      className={cx('inline-grid place-items-center w-10 h-10 rounded-[10px] border transition-colors disabled:opacity-50', BTN[variant], className)}
    >
      <Icon size={17} aria-hidden="true" />
    </button>
  )
}

/** Image that falls back to an icon if the file is missing or fails to load. */
export function Thumb({ src, alt = '', className, fallback }) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) return fallback
  return <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} className={className} />
}

/* ── Surfaces ────────────────────────────────────────────────────────── */
export const Card = ({ className, children, ...rest }) => (
  <div {...rest} className={cx('min-w-0 bg-ink-900 border border-line rounded-[14px]', className)}>{children}</div>
)

const BADGE = {
  neutral: 'text-muted border-line-strong',
  blue: 'text-brand-400 border-brand-500/40',
  green: 'text-emerald-300 border-emerald-400/40',
  gold: 'text-gold border-gold/40',
  red: 'text-red-300 border-red-400/40',
}
export const Badge = ({ tone = 'neutral', children, className }) => (
  <span className={cx('inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap', BADGE[tone], className)}>{children}</span>
)

export function PageHeader({ title, description, actions }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6 lg:mb-8">
      <div className="min-w-0">
        <h1 className="text-2xl lg:text-[1.75rem] font-extrabold leading-tight">{title}</h1>
        {description && <p className="text-muted text-sm mt-1.5 max-w-prose">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2 shrink-0">{actions}</div>}
    </div>
  )
}

/* ── Form fields ─────────────────────────────────────────────────────── */
const FIELD = 'w-full min-h-[44px] rounded-[10px] bg-ink-950 border border-line-strong px-3.5 py-2.5 text-base sm:text-sm text-white placeholder:text-slate-500 transition-colors hover:border-slate-400/60 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 aria-[invalid=true]:border-red-400'

function Field({ label, hint, error, id, children, className }) {
  return (
    <div className={cx('block', className)}>
      {label && <label htmlFor={id} className="block text-[13px] font-semibold text-soft mb-1.5">{label}</label>}
      {children}
      {hint && !error && <p className="text-xs text-muted mt-1.5">{hint}</p>}
      {error && <p className="text-xs text-red-300 mt-1.5" role="alert">{error}</p>}
    </div>
  )
}

export function Input({ label, hint, error, className, ...rest }) {
  const id = useId()
  return (
    <Field label={label} hint={hint} error={error} id={id} className={className}>
      <input id={id} aria-invalid={error ? 'true' : undefined} className={FIELD} {...rest} />
    </Field>
  )
}

export function Textarea({ label, hint, error, className, rows = 4, ...rest }) {
  const id = useId()
  return (
    <Field label={label} hint={hint} error={error} id={id} className={className}>
      <textarea id={id} rows={rows} aria-invalid={error ? 'true' : undefined} className={cx(FIELD, 'resize-y leading-relaxed')} {...rest} />
    </Field>
  )
}

export function Select({ label, hint, error, options = [], className, ...rest }) {
  const id = useId()
  return (
    <Field label={label} hint={hint} error={error} id={id} className={className}>
      <select id={id} aria-invalid={error ? 'true' : undefined} className={cx(FIELD, 'appearance-none pr-9 bg-no-repeat')}
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")", backgroundPosition: 'right 0.8rem center', backgroundSize: '1rem' }}
        {...rest}>
        {options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o)).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </Field>
  )
}

export function Toggle({ checked, onChange, label, disabled }) {
  return (
    <button
      type="button" role="switch" aria-checked={checked} aria-label={label} disabled={disabled} onClick={() => onChange(!checked)}
      className={cx('relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors disabled:opacity-50',
        checked ? 'bg-brand-600 border-brand-600' : 'bg-ink-800 border-line-strong')}
    >
      <span className={cx('inline-block h-4 w-4 rounded-full bg-white transition-transform', checked ? 'translate-x-[22px]' : 'translate-x-[3px]')} />
    </button>
  )
}

/** Segmented filter (All / Website / App …) with optional counts. */
export function FilterTabs({ value, onChange, options, label = 'Filter' }) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-1.5">
      {options.map((o) => {
        const opt = typeof o === 'string' ? { value: o, label: o } : o
        const active = value === opt.value
        return (
          <button key={opt.value} type="button" aria-pressed={active} onClick={() => onChange(opt.value)}
            className={cx('min-h-[36px] px-3 rounded-lg border text-[13px] font-semibold transition-colors',
              active ? 'bg-white text-ink-900 border-white' : 'text-muted border-line-strong hover:text-white hover:border-slate-400/70')}>
            {opt.label}{opt.count != null && <span className={cx('ml-1.5 font-mono text-[11px]', active ? 'text-ink-700' : 'text-slate-500')}>{opt.count}</span>}
          </button>
        )
      })}
    </div>
  )
}

/* ── Feedback states ─────────────────────────────────────────────────── */
export const Skeleton = ({ className }) => <div className={cx('skeleton', className)} aria-hidden="true" />

export function EmptyState({ icon: Icon = Inbox, title, children, action }) {
  return (
    <div className="border border-dashed border-line-strong rounded-[14px] px-6 py-12 text-center">
      <Icon size={28} className="mx-auto text-slate-500 mb-3" aria-hidden="true" />
      <p className="font-display font-bold text-lg">{title}</p>
      {children && <p className="text-muted text-sm mt-1.5 max-w-sm mx-auto">{children}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function ErrorState({ title = 'We couldn’t load this', error, onRetry }) {
  return (
    <div className="border border-red-400/30 bg-red-500/5 rounded-[14px] px-6 py-8 text-center" role="alert">
      <AlertCircle size={26} className="mx-auto text-red-300 mb-3" aria-hidden="true" />
      <p className="font-display font-bold text-lg">{title}</p>
      <p className="text-muted text-sm mt-1.5 max-w-md mx-auto">{error?.message || 'Check your connection and try again.'}</p>
      {onRetry && <Button variant="secondary" size="sm" icon={RefreshCw} className="mt-5" onClick={onRetry}>Try again</Button>}
    </div>
  )
}

export function Notice({ tone = 'info', title, children }) {
  const t = tone === 'warn' ? 'border-gold/40 bg-gold/5' : 'border-brand-500/30 bg-brand-500/5'
  return (
    <div className={cx('border rounded-[12px] px-4 py-3 text-sm', t)}>
      {title && <p className="font-semibold mb-0.5">{title}</p>}
      <div className="text-soft">{children}</div>
    </div>
  )
}

/* ── Modal (accessible: Escape, focus trap, scroll lock, labelled) ───── */
export function Modal({ title, description, onClose, children, footer, size = 'lg' }) {
  const ref = useRef(null)
  const titleId = useId()
  useEffect(() => {
    const prev = document.activeElement
    document.body.style.overflow = 'hidden'
    const root = ref.current
    const focusables = () => root.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])')
    const first = root.querySelector('[data-autofocus]') || focusables()[0]
    first && first.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') { e.stopPropagation(); onClose() }
      if (e.key === 'Tab') {
        const f = [...focusables()]; if (!f.length) return
        const a = f[0], z = f[f.length - 1]
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus() }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus() }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; prev && prev.focus && prev.focus() }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-4">
      <div className="absolute inset-0 bg-ink-1000/80" onClick={onClose} aria-hidden="true" />
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby={titleId}
        className={cx('pop relative w-full bg-ink-900 border border-line-strong shadow-2xl flex flex-col max-h-[92dvh] sm:max-h-[90vh]',
          'rounded-t-[18px] sm:rounded-[16px]', size === 'sm' ? 'sm:max-w-md' : size === 'xl' ? 'sm:max-w-3xl' : 'sm:max-w-xl')}>
        <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-line">
          <div className="min-w-0">
            <h3 id={titleId} className="text-lg font-bold">{title}</h3>
            {description && <p className="text-sm text-muted mt-0.5">{description}</p>}
          </div>
          <IconButton icon={X} label="Close" onClick={onClose} className="-mr-2 -mt-1" />
        </div>
        <div className="px-5 py-5 overflow-y-auto">{children}</div>
        {footer && <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 px-5 py-4 border-t border-line pb-[max(1rem,env(safe-area-inset-bottom))]">{footer}</div>}
      </div>
    </div>
  )
}

export const Stars = ({ value = 0, size = 14 }) => (
  <span className="inline-flex gap-0.5" role="img" aria-label={`${value} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((i) => (
      <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i <= value ? '#e3ab3d' : 'none'} stroke={i <= value ? '#e3ab3d' : '#475569'} strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ))}
  </span>
)

export const Avatar = ({ name, size = 36 }) => (
  <span className="inline-grid place-items-center rounded-full bg-ink-800 border border-line-strong text-soft font-bold shrink-0"
    style={{ width: size, height: size, fontSize: size * 0.36 }} aria-hidden="true">
    {(name || '?').trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('') || '?'}
  </span>
)
