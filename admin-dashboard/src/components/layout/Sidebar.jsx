import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, FolderOpen, Wrench, MessageSquareQuote, MessageSquare,
  Image as ImageIcon, BarChart3, Settings, LogOut, X,
} from 'lucide-react'
import { useAuth } from '../../lib/auth.jsx'
import { useCounts } from '../../lib/counts.jsx'

const GROUPS = [
  { label: null, items: [{ to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }] },
  {
    label: 'Manage',
    items: [
      { to: '/portfolio', label: 'Portfolio', icon: FolderOpen },
      { to: '/services', label: 'Services', icon: Wrench },
      { to: '/testimonials', label: 'Testimonials', icon: MessageSquareQuote, badge: 'pending' },
      { to: '/messages', label: 'Messages', icon: MessageSquare, badge: 'unread' },
    ],
  },
  { label: 'Content', items: [{ to: '/media', label: 'Media library', icon: ImageIcon }] },
  { label: 'Insights', items: [{ to: '/analytics', label: 'Analytics', icon: BarChart3 }] },
  { label: 'System', items: [{ to: '/settings', label: 'Settings', icon: Settings }] },
]

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <img src={`${import.meta.env.BASE_URL}logo-mark.png`} alt="" width="38" height="26" className="w-[38px] h-auto" />
      <div className="leading-tight">
        <div className="font-display font-extrabold text-[1.05rem]">Code<span className="text-brand-500">Canvas</span></div>
        <div className="label-mono text-gold mt-0.5">Admin</div>
      </div>
    </div>
  )
}

function Nav({ onNavigate }) {
  const counts = useCounts()
  return (
    <nav aria-label="Admin" className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
      {GROUPS.map((g, i) => (
        <div key={i}>
          {g.label && <p className="label-mono text-slate-500 px-3 mb-2">{g.label}</p>}
          <ul className="space-y-0.5">
            {g.items.map((item) => {
              const n = item.badge ? counts[item.badge] : 0
              return (
                <li key={item.to}>
                  <NavLink to={item.to} onClick={onNavigate}
                    className={({ isActive }) =>
                      `relative flex items-center gap-3 min-h-[44px] px-3 rounded-[10px] text-sm font-medium transition-colors ${
                        isActive ? 'bg-ink-800 text-white' : 'text-muted hover:text-white hover:bg-white/5'}`}>
                    {({ isActive }) => (
                      <>
                        {isActive && <span className="absolute left-0 top-2.5 bottom-2.5 w-[3px] rounded-r bg-gold" aria-hidden="true" />}
                        <item.icon size={17} className={isActive ? 'text-brand-400' : ''} aria-hidden="true" />
                        <span className="flex-1">{item.label}</span>
                        {n > 0 && (
                          <span className="min-w-[22px] h-[22px] px-1.5 grid place-items-center rounded-full bg-brand-600 text-white text-[11px] font-bold">
                            {n > 99 ? '99+' : n}
                            <span className="sr-only"> {item.badge === 'unread' ? 'unread' : 'awaiting approval'}</span>
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}

function Account() {
  const { session, signOut } = useAuth()
  const email = session?.user?.email || ''
  return (
    <div className="border-t border-line p-3">
      <div className="px-3 py-2 min-w-0">
        <p className="label-mono text-slate-500">Signed in as</p>
        <p className="text-sm text-soft truncate" title={email}>{email}</p>
      </div>
      <button type="button" onClick={signOut}
        className="w-full flex items-center gap-3 min-h-[44px] px-3 rounded-[10px] text-sm font-medium text-muted hover:text-white hover:bg-white/5 transition-colors">
        <LogOut size={17} aria-hidden="true" /> Sign out
      </button>
    </div>
  )
}

export default function Sidebar({ open, onClose }) {
  // Escape closes the mobile drawer; page does not scroll behind it.
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = ''; document.removeEventListener('keydown', onKey) }
  }, [open, onClose])

  return (
    <>
      <aside className="hidden lg:flex flex-col w-64 shrink-0 h-dvh sticky top-0 bg-ink-900 border-r border-line">
        <div className="h-16 px-5 flex items-center border-b border-line"><Brand /></div>
        <Nav />
        <Account />
      </aside>

      {open && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-ink-1000/80" onClick={onClose} aria-hidden="true" />
          <aside role="dialog" aria-modal="true" aria-label="Navigation menu"
            className="pop absolute inset-y-0 left-0 w-[17.5rem] max-w-[85vw] flex flex-col bg-ink-900 border-r border-line-strong">
            <div className="h-16 px-5 flex items-center justify-between border-b border-line">
              <Brand />
              <button type="button" onClick={onClose} aria-label="Close menu" className="w-10 h-10 -mr-2 grid place-items-center rounded-[10px] text-muted hover:text-white hover:bg-white/5"><X size={20} /></button>
            </div>
            <Nav onNavigate={onClose} />
            <Account />
          </aside>
        </div>
      )}
    </>
  )
}
