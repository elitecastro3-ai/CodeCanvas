// ─────────────────────────────────────────────
//  CodeCanvas Admin — Reusable UI Components
//  StatCard | Badge | Button | SectionHeader
//  Table | EmptyState | Avatar | Toggle
// ─────────────────────────────────────────────

import { TrendingUp, TrendingDown } from 'lucide-react';

/* ── Stat Card ──────────────────────────────── */
export function StatCard({ label, value, change, up, colorClass = 'text-blue-400', icon: Icon }) {
  return (
    <div className="bg-slate-800/80 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-5 hover:border-blue-500/40 transition-all duration-300 group">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-slate-700/60 ${colorClass}`}>
          {Icon && <Icon size={18} />}
        </div>
        <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
          up ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
        }`}>
          {up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {change}
        </span>
      </div>
      <div className="mt-1">
        <div className="text-2xl font-bold text-white font-mono tracking-tight">{value}</div>
        <div className="text-xs text-slate-400 mt-1 font-medium">{label}</div>
      </div>
    </div>
  );
}

/* ── Badge ──────────────────────────────────── */
export function Badge({ children, variant = 'blue' }) {
  const variants = {
    blue:   'bg-blue-500/15 text-blue-400 border-blue-500/30',
    green:  'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    gold:   'bg-amber-500/15 text-amber-400 border-amber-500/30',
    red:    'bg-red-500/15 text-red-400 border-red-500/30',
    purple: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
    gray:   'bg-slate-600/40 text-slate-400 border-slate-500/30',
    teal:   'bg-teal-500/15 text-teal-400 border-teal-500/30',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variants[variant] ?? variants.gray}`}>
      {children}
    </span>
  );
}

/* ── Button ─────────────────────────────────── */
export function Button({ children, variant = 'primary', size = 'md', onClick, className = '', icon: Icon, disabled = false }) {
  const base = 'inline-flex items-center gap-2 font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  const variants = {
    primary:  'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 hover:-translate-y-0.5',
    outline:  'border border-blue-500/40 text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/60',
    ghost:    'text-slate-400 hover:text-white hover:bg-slate-700/60',
    danger:   'bg-red-600/20 border border-red-500/40 text-red-400 hover:bg-red-600/30',
    gold:     'bg-amber-500/20 border border-amber-500/40 text-amber-400 hover:bg-amber-500/30',
    success:  'bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-600/30',
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {Icon && <Icon size={size === 'sm' ? 12 : size === 'lg' ? 18 : 14} />}
      {children}
    </button>
  );
}

/* ── Section Header ─────────────────────────── */
export function SectionHeader({ tag, title, highlight, subtitle }) {
  return (
    <div className="mb-8">
      {tag && (
        <span className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-3">
          {tag}
        </span>
      )}
      <h2 className="text-2xl font-extrabold text-white font-display">
        {title}{' '}
        {highlight && <span className="text-blue-400">{highlight}</span>}
      </h2>
      {subtitle && <p className="text-slate-400 text-sm mt-1">{subtitle}</p>}
    </div>
  );
}

/* ── Card ───────────────────────────────────── */
export function Card({ children, className = '', hover = false }) {
  return (
    <div className={`
      bg-slate-800/80 backdrop-blur-sm border border-blue-500/20 rounded-2xl
      ${hover ? 'hover:border-blue-500/40 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
}

/* ── Input ──────────────────────────────────── */
export function Input({ label, placeholder, type = 'text', value, onChange, className = '' }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="bg-slate-900/60 border border-blue-500/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10 transition-all"
      />
    </div>
  );
}

/* ── Select ─────────────────────────────────── */
export function Select({ label, options, value, onChange, className = '' }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">{label}</label>}
      <select
        value={value}
        onChange={onChange}
        className="bg-slate-900/60 border border-blue-500/20 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500/60 transition-all appearance-none cursor-pointer"
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value} className="bg-slate-800">{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

/* ── Textarea ───────────────────────────────── */
export function Textarea({ label, placeholder, value, onChange, rows = 4, className = '' }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">{label}</label>}
      <textarea
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="bg-slate-900/60 border border-blue-500/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10 transition-all resize-none"
      />
    </div>
  );
}

/* ── Toggle ─────────────────────────────────── */
export function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-all duration-300 cursor-pointer ${
          checked ? 'bg-blue-500' : 'bg-slate-600'
        }`}
      >
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${
          checked ? 'left-6' : 'left-1'
        }`} />
      </div>
      {label && <span className="text-sm text-slate-300">{label}</span>}
    </label>
  );
}

/* ── Avatar ─────────────────────────────────── */
export function Avatar({ name = '', size = 'md', color = 'blue' }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const sizes = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-12 h-12 text-base' };
  const colors = {
    blue:   'bg-blue-500/30 text-blue-300',
    gold:   'bg-amber-500/30 text-amber-300',
    green:  'bg-emerald-500/30 text-emerald-300',
    purple: 'bg-violet-500/30 text-violet-300',
  };
  return (
    <div className={`${sizes[size]} ${colors[color] ?? colors.blue} rounded-full flex items-center justify-center font-bold font-display flex-shrink-0`}>
      {initials}
    </div>
  );
}

/* ── Empty State ────────────────────────────── */
export function EmptyState({ icon = '📭', title = 'Nothing here', subtitle = '' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <div className="text-lg font-semibold text-slate-300">{title}</div>
      {subtitle && <div className="text-sm text-slate-500 mt-1">{subtitle}</div>}
    </div>
  );
}

/* ── Status Badge helper ────────────────────── */
export function statusVariant(status) {
  const map = {
    'Live': 'green', 'Active': 'green', 'Approved': 'green',
    'In Progress': 'gold', 'Pending': 'gold', 'Draft': 'gray',
    'Inactive': 'red',
  };
  return map[status] ?? 'gray';
}

/* ── Bar Chart (pure CSS) ───────────────────── */
export function BarChart({ data }) {
  const max = Math.max(...data.map(d => d.revenue));
  return (
    <div className="flex items-end gap-2 h-40 w-full">
      {data.map((d) => (
        <div key={d.month} className="flex flex-col items-center gap-1 flex-1">
          <div
            className="w-full rounded-t-lg bg-gradient-to-t from-blue-600 to-blue-400 opacity-80 hover:opacity-100 transition-opacity cursor-default"
            style={{ height: `${(d.revenue / max) * 100}%`, minHeight: '8px' }}
            title={`UGX ${(d.revenue/1000000).toFixed(1)}M`}
          />
          <span className="text-[10px] text-slate-500">{d.month}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Donut Chart (SVG) ──────────────────────── */
export function DonutChart({ data }) {
  const size = 120;
  const r = 45;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  let offset = 0;

  const slices = data.map((item) => {
    const dash = (item.pct / 100) * circumference;
    const gap  = circumference - dash;
    const slice = { ...item, dash, gap, offset };
    offset += dash;
    return slice;
  });

  return (
    <div className="flex items-center gap-6">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1e293b" strokeWidth="14" />
        {slices.map((s) => (
          <circle
            key={s.name}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={s.color}
            strokeWidth="14"
            strokeDasharray={`${s.dash} ${s.gap}`}
            strokeDashoffset={-s.offset + circumference / 4}
            style={{ transition: 'stroke-dasharray 0.5s ease' }}
          />
        ))}
        <text x={cx} y={cy - 6} textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">100%</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fill="#94a3b8" fontSize="9">Services</text>
      </svg>
      <div className="flex flex-col gap-2">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
            <span className="text-xs text-slate-400">{d.name}</span>
            <span className="text-xs font-bold text-white ml-auto pl-4">{d.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
