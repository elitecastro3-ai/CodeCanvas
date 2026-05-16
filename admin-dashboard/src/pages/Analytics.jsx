// ─────────────────────────────────────────────
//  Page: Analytics
//  Revenue chart, service breakdown, KPI cards
// ─────────────────────────────────────────────

import { TrendingUp, Users, FolderOpen, MessageSquare, Eye, Star, Zap, Globe } from 'lucide-react';
import { Card, SectionHeader, BarChart, DonutChart } from '../components/ui/index.jsx';
import { analyticsStats, monthlyRevenue, serviceBreakdown } from '../data/mockData.js';

function KpiCard({ icon: Icon, label, value, sub, color }) {
  const colorMap = {
    blue:   { bg: 'bg-blue-500/15',    text: 'text-blue-400',    ring: 'ring-blue-500/30' },
    green:  { bg: 'bg-emerald-500/15', text: 'text-emerald-400', ring: 'ring-emerald-500/30' },
    gold:   { bg: 'bg-amber-500/15',   text: 'text-amber-400',   ring: 'ring-amber-500/30' },
    purple: { bg: 'bg-violet-500/15',  text: 'text-violet-400',  ring: 'ring-violet-500/30' },
    teal:   { bg: 'bg-teal-500/15',    text: 'text-teal-400',    ring: 'ring-teal-500/30' },
  };

  const c = colorMap[color] ?? colorMap.blue;

  return (
    <Card className="p-4 sm:p-5 flex items-center gap-3 min-w-0">
      <div
        className={`w-11 h-11 ${c.bg} ring-1 ${c.ring} rounded-2xl flex items-center justify-center flex-shrink-0`}
      >
        <Icon size={18} className={c.text} />
      </div>

      <div className="min-w-0">
        <div className="text-lg sm:text-xl font-extrabold text-white font-mono break-words">
          {value}
        </div>

        <div className="text-xs font-medium text-slate-400">
          {label}
        </div>

        {sub && (
          <div className="text-[11px] text-emerald-400 mt-0.5">
            {sub}
          </div>
        )}
      </div>
    </Card>
  );
}

export default function AnalyticsPage() {
  const kpis = [
    { icon: TrendingUp,    label: 'Total Revenue',    value: 'UGX 14.4M', sub: '↑ 22% this year',    color: 'blue' },
    { icon: FolderOpen,    label: 'Projects Done',    value: '52',        sub: '↑ 8 this month',     color: 'green' },
    { icon: Users,         label: 'Active Clients',   value: '24',        sub: '↑ 3 new this month', color: 'gold' },
    { icon: MessageSquare, label: 'Enquiries',        value: '6',         sub: '2 unread',            color: 'purple' },
    { icon: Eye,           label: 'Website Views',    value: '3,840',     sub: 'Estimated monthly',  color: 'teal' },
    { icon: Star,          label: 'Avg. Rating',      value: '4.9 / 5',   sub: '5 reviews',          color: 'gold' },
    { icon: Zap,           label: 'Completion Rate',  value: '96%',       sub: 'On-time delivery',   color: 'green' },
    { icon: Globe,         label: 'Countries Served', value: '3',         sub: 'UG · KE · TZ',       color: 'blue' },
  ];

  const monthlyProjects = monthlyRevenue;
  const maxRev = Math.max(...monthlyProjects.map(d => d.revenue));

  return (
    <div className="p-3 sm:p-5 lg:p-7 space-y-6">

      <SectionHeader
        tag="📊 Insights"
        title="Business"
        highlight="Analytics"
        subtitle="Track your agency's growth and performance"
      />

      {/* ── KPI Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(kpi => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Bar Chart */}
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-white text-sm">
                Revenue Over Time
              </h3>

              <p className="text-xs text-slate-500 mt-0.5">
                Monthly UGX earnings
              </p>
            </div>

            <select className="bg-slate-800 border border-blue-500/20 rounded-lg px-3 py-1.5 text-xs text-slate-400 outline-none">
              <option>Last 8 Months</option>
              <option>Last 12 Months</option>
            </select>
          </div>

          <BarChart data={monthlyProjects} />

          {/* Month labels with project count */}
          <div className="mt-4 border-t border-blue-500/10 pt-3 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Total projects per month shown in bars
            </span>

            <span className="text-xs font-bold text-blue-400">
              Peak: UGX {(maxRev / 1000000).toFixed(1)}M
            </span>
          </div>
        </Card>

        {/* Donut Chart */}
        <Card className="p-5">
          <div className="mb-5">
            <h3 className="font-bold text-white text-sm">
              Revenue by Service
            </h3>

            <p className="text-xs text-slate-500 mt-0.5">
              2026 breakdown
            </p>
          </div>

          <DonutChart data={serviceBreakdown} />

          <div className="mt-5 pt-4 border-t border-blue-500/10">
            <div className="text-xs text-slate-500">
              Web Development leads at{' '}
              <span className="text-blue-400 font-bold">
                42%
              </span>{' '}
              of all revenue.
            </div>
          </div>
        </Card>

      </div>

      {/* ── Monthly Table ── */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-blue-500/10">
          <h3 className="font-bold text-white text-sm">
            Monthly Breakdown
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-blue-500/10">
                {['Month','Revenue (UGX)','Projects','Avg. per Project','Revenue Bar'].map(h => (
                  <th
                    key={h}
                    className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest px-5 py-3"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-blue-500/5">
              {monthlyProjects.map((row) => (
                <tr
                  key={row.month}
                  className="hover:bg-slate-700/20 transition-colors"
                >
                  <td className="px-5 py-3 font-semibold text-white text-sm">
                    {row.month}
                  </td>

                  <td className="px-5 py-3 text-sm text-blue-400 font-bold font-mono">
                    {(row.revenue / 1000000).toFixed(2)}M
                  </td>

                  <td className="px-5 py-3 text-sm text-slate-300">
                    {row.projects}
                  </td>

                  <td className="px-5 py-3 text-sm text-slate-400 font-mono">
                    {Math.round(row.revenue / row.projects / 1000)}K
                  </td>

                  <td className="px-5 py-3 w-40">
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"
                        style={{
                          width: `${(row.revenue / maxRev) * 100}%`
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

    </div>
  );
}