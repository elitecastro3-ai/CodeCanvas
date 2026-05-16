// ─────────────────────────────────────────────
//  CodeCanvas Admin — Top Navigation Bar
// ─────────────────────────────────────────────

import { Menu, Bell, Search, ExternalLink } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const PAGE_TITLES = {
  dashboard: {
    title: 'Dashboard',
    subtitle: 'Welcome back, Elijah 👋',
  },
  portfolio: {
    title: 'Portfolio',
    subtitle: 'Manage your project showcase',
  },
  services: {
    title: 'Services',
    subtitle: 'Manage your service offerings & pricing',
  },
  testimonials: {
    title: 'Testimonials',
    subtitle: 'Manage client reviews & approvals',
  },
  messages: {
    title: 'Messages',
    subtitle: 'Client enquiries & contact form submissions',
  },
  media: {
    title: 'Media Library',
    subtitle: 'Manage your uploaded files and images',
  },
  analytics: {
    title: 'Analytics',
    subtitle: 'Track your business performance',
  },
  settings: {
    title: 'Settings',
    subtitle: 'Manage your website and profile settings',
  },
};

export default function Topbar({ onMenuClick }) {
  const location = useLocation();
  const navigate = useNavigate();

  const currentPage =
    location.pathname.replace('/', '') || 'dashboard';

  const { title, subtitle } =
    PAGE_TITLES[currentPage] ?? PAGE_TITLES.dashboard;

  return (
    <header className="h-16 flex items-center justify-between px-5 bg-slate-900/80 backdrop-blur-sm border-b border-blue-500/10 flex-shrink-0 sticky top-0 z-40">

      {/* ── Left: hamburger (mobile) + page title ── */}
      <div className="flex items-center gap-3">

        {/* Mobile menu toggle */}
        <button
          onClick={onMenuClick}
          className="lg:hidden w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700/60 rounded-lg transition-colors"
        >
          <Menu size={18} />
        </button>

        <div>
          <h1 className="text-base font-bold text-white font-display leading-tight">
            {title}
          </h1>

          <p className="text-xs text-slate-500 hidden sm:block">
            {subtitle}
          </p>
        </div>
      </div>

      {/* ── Right: Search + Actions ── */}
      <div className="flex items-center gap-2">

        {/* Search bar */}
        <div className="hidden md:flex items-center gap-2 bg-slate-800/60 border border-blue-500/20 rounded-xl px-3 py-1.5 w-52">
          <Search
            size={13}
            className="text-slate-500 flex-shrink-0"
          />

          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm text-white placeholder-slate-600 outline-none w-full"
          />
        </div>

        {/* View live site */}
        <a
          
          href="https://codecanvas-topaz.vercel.app"
          target="_blank"
          rel="noreferrer"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-blue-400 border border-blue-500/20 hover:border-blue-500/40 rounded-xl transition-all"
        >
          <ExternalLink size={11} />
          Live Site
        </a>

        {/* Notifications */}
        <button
          onClick={() => alert('Notifications coming soon')}
          className="relative w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700/60 rounded-lg transition-colors"
        >
          <Bell size={16} />

          {/* Unread dot */}
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-400 rounded-full" />
        </button>

        {/* Avatar */}
        <button
          onClick={() => navigate('/settings')}
          className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-xs font-bold text-white cursor-pointer hover:ring-2 hover:ring-blue-400/40 transition-all"
        >
          EE
        </button>

      </div>
    </header>
  );
}