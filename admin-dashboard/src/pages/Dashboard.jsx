// ─────────────────────────────────────────────
//  Page: Dashboard Home
//  Stats cards, revenue bar chart, donut chart,
//  recent activity feed, quick action buttons.
// ─────────────────────────────────────────────

import { FolderOpen, Users, MessageSquare, TrendingUp, ArrowRight, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StatCard, Card, Button, BarChart, DonutChart } from '../components/ui/index.jsx';
import { analyticsStats, recentActivity, monthlyRevenue, serviceBreakdown } from '../data/mockData.js';
import { supabase } from "../lib/supabase";
import { useEffect } from "react";

const STAT_ICONS = [FolderOpen, Users, MessageSquare, TrendingUp];
const STAT_COLORS = ['text-blue-400', 'text-emerald-400', 'text-amber-400', 'text-violet-400'];

export default function DashboardPage() {
  useEffect(() => {
  console.log(supabase);
}, []);
  const navigate = useNavigate();

  return (
    <div className="p-5 lg:p-7 space-y-7">

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {analyticsStats.map((stat, i) => (
          <StatCard
            key={stat.label}
            {...stat}
            icon={STAT_ICONS[i]}
            colorClass={STAT_COLORS[i]}
          />
        ))}
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Revenue Bar Chart — takes 2/3 */}
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-white text-sm">Monthly Revenue</h3>
              <p className="text-xs text-slate-500 mt-0.5">UGX — last 8 months</p>
            </div>
            <span className="text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded-full font-semibold">
              ↑ 22% overall
            </span>
          </div>
          <BarChart data={monthlyRevenue} />
        </Card>

        {/* Service Breakdown Donut — 1/3 */}
        <Card className="p-5">
          <div className="mb-5">
            <h3 className="font-bold text-white text-sm">Service Mix</h3>
            <p className="text-xs text-slate-500 mt-0.5">Revenue by service type</p>
          </div>
          <DonutChart data={serviceBreakdown} />
        </Card>

      </div>

      {/* ── Bottom Row: Activity + Quick Actions ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Recent Activity Feed — 2/3 */}
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-white text-sm">Recent Activity</h3>

            <button
              onClick={() => navigate('/messages')}
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              View all <ArrowRight size={11} />
            </button>
          </div>

          <div className="space-y-1">
            {recentActivity.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-700/30 transition-colors group"
              >
                <div className="w-9 h-9 rounded-xl bg-slate-700/60 flex items-center justify-center text-lg flex-shrink-0">
                  {item.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-300 truncate">
                    <span className="text-slate-500">{item.action}</span>{' '}
                    <span className="text-white font-semibold">{item.subject}</span>
                  </p>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-slate-500 flex-shrink-0">
                  <Clock size={10} />
                  {item.time}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions — 1/3 */}
        <div className="space-y-4">

          <Card className="p-5">
            <h3 className="font-bold text-white text-sm mb-4">Quick Actions</h3>

            <div className="space-y-2">
              {[
                { label: 'Add Portfolio Project', page: 'portfolio', color: 'primary' },
                { label: 'View Messages', page: 'messages', color: 'outline' },
                { label: 'Upload Media', page: 'media', color: 'outline' },
                { label: 'Edit Services', page: 'services', color: 'outline' },
              ].map(action => (
                <Button
                  key={action.label}
                  variant={action.color}
                  className="w-full justify-start"
                  onClick={() => navigate(`/${action.page}`)}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          </Card>

          {/* Tip card */}
          <div className="bg-gradient-to-br from-blue-600/20 to-violet-600/10 border border-blue-500/30 rounded-2xl p-4">
            <div className="text-amber-400 text-lg mb-2">💡</div>

            <p className="text-xs text-slate-300 leading-relaxed">
              <span className="font-bold text-white">Pro tip:</span> Keep your portfolio updated regularly — clients check it before reaching out.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}