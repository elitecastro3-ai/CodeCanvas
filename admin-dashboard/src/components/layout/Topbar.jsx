import { Menu, ExternalLink } from 'lucide-react'
import { SITE_URL } from '../../lib/supabase'

export default function Topbar({ title, onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 h-16 bg-ink-950 border-b border-line">
      <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <button type="button" onClick={onMenuClick} aria-label="Open menu"
            className="lg:hidden w-11 h-11 -ml-2 grid place-items-center rounded-[10px] text-white hover:bg-white/5">
            <Menu size={22} />
          </button>
          <p className="font-display font-bold text-lg truncate lg:hidden">{title}</p>
          <p className="hidden lg:block label-mono text-muted">Admin<span className="text-slate-600 mx-2">/</span><span className="text-soft">{title}</span></p>
        </div>
        <a href={SITE_URL} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 min-h-[40px] px-3 rounded-[10px] border border-line-strong text-[13px] font-semibold text-soft hover:text-white hover:border-white/60 transition-colors">
          <ExternalLink size={14} aria-hidden="true" />
          <span className="hidden sm:inline">View live site</span>
          <span className="sm:hidden">Site</span>
        </a>
      </div>
    </header>
  )
}
