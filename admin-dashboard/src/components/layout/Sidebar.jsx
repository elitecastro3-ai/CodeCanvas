// ─────────────────────────────────────────────
//  CodeCanvas Admin — Sidebar Navigation
// ─────────────────────────────────────────────

import {
  LayoutDashboard,
  FolderOpen,
  Wrench,
  MessageSquareQuote,
  MessageSquare,
  Image,
  BarChart2,
  Settings,
  X,
  Code2,
  ChevronRight,
  Zap,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const NAV_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
    section: null,
  },
  {
    id: "portfolio",
    label: "Portfolio",
    path: "/portfolio",
    icon: FolderOpen,
    section: "Manage",
  },
  {
    id: "services",
    label: "Services",
    path: "/services",
    icon: Wrench,
    section: "Manage",
  },
  {
    id: "testimonials",
    label: "Testimonials",
    path: "/testimonials",
    icon: MessageSquareQuote,
    section: "Manage",
  },
  {
    id: "messages",
    label: "Messages",
    path: "/messages",
    icon: MessageSquare,
    section: "Manage",
    badge: 2,
  },
  {
    id: "media",
    label: "Media Library",
    path: "/media",
    icon: Image,
    section: "Content",
  },
  {
    id: "analytics",
    label: "Analytics",
    path: "/analytics",
    icon: BarChart2,
    section: "Insights",
  },
  {
    id: "settings",
    label: "Settings",
    path: "/settings",
    icon: Settings,
    section: "System",
  },
];

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const sections = [...new Set(NAV_ITEMS.map((i) => i.section))];

  const SidebarLink = ({ item }) => {
    return (
      <NavLink
        to={item.path}
        onClick={() => setMobileOpen(false)}
        className={({ isActive }) => `
          w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
          transition-all duration-200 group relative
          ${
            isActive
              ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
              : "text-slate-400 hover:text-white hover:bg-slate-700/50"
          }
        `}
      >
        {({ isActive }) => (
          <>
            {/* Active indicator bar */}
            {isActive && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-400 rounded-full" />
            )}

            <item.icon
              size={16}
              className={
                isActive
                  ? "text-blue-400"
                  : "text-slate-500 group-hover:text-slate-300"
              }
            />

            <span className="flex-1 text-left">{item.label}</span>

            {/* Unread badge */}
            {item.badge && (
              <span className="bg-blue-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {item.badge}
              </span>
            )}

            {isActive && (
              <ChevronRight size={12} className="text-blue-400/60" />
            )}
          </>
        )}
      </NavLink>
    );
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* ── Logo ── */}
      <div className="p-5 pb-4 border-b border-blue-500/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 flex-shrink-0">
            <Code2 size={16} className="text-white" />
          </div>

          <div>
            <div className="font-extrabold text-white text-sm font-display leading-tight">
              Code<span className="text-blue-400">Canvas</span>
            </div>

            <div className="text-[10px] text-amber-400/80 font-semibold tracking-widest uppercase">
              Admin Panel
            </div>
          </div>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 p-3 space-y-5 overflow-y-auto">
        {/* Dashboard */}
        <div>
          <SidebarLink item={NAV_ITEMS[0]} />
        </div>

        {/* Grouped sections */}
        {sections.filter(Boolean).map((section) => (
          <div key={section}>
            <div className="px-3 mb-2">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                {section}
              </span>
            </div>

            <div className="space-y-0.5">
              {NAV_ITEMS.filter((i) => i.section === section).map((item) => (
                <SidebarLink key={item.id} item={item} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* ── Footer: User Info ── */}
      <div className="p-3 border-t border-blue-500/10">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 transition-colors cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
            EE
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-white truncate">
              Elijah Enrique
            </div>

            <div className="text-[10px] text-slate-500 truncate">
              Admin
            </div>
          </div>

          <Zap size={12} className="text-amber-400 flex-shrink-0" />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex flex-col w-56 flex-shrink-0 bg-slate-900 border-r border-blue-500/10 h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* ── Mobile Overlay ── */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer */}
          <aside className="relative z-10 w-56 bg-slate-900 border-r border-blue-500/10 h-full flex flex-col">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>

            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
}