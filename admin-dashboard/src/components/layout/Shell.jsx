import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'
import { CountsProvider } from '../../lib/counts.jsx'

const TITLES = {
  '/dashboard': 'Dashboard', '/portfolio': 'Portfolio', '/services': 'Services', '/testimonials': 'Testimonials',
  '/messages': 'Messages', '/media': 'Media library', '/analytics': 'Analytics', '/settings': 'Settings',
}

export default function Shell() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const title = TITLES[pathname] || 'Admin'

  useEffect(() => { document.title = `${title} — CodeCanvas Admin`; window.scrollTo(0, 0) }, [title])

  return (
    <CountsProvider>
      <div className="flex min-h-dvh bg-ink-950">
        <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
        <div className="flex-1 min-w-0 flex flex-col">
          <Topbar title={title} onMenuClick={() => setMenuOpen(true)} />
          <main id="main" className="flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:py-8 pb-16">
            <div className="max-w-[1180px] mx-auto"><Outlet /></div>
          </main>
        </div>
      </div>
    </CountsProvider>
  )
}
