// ─────────────────────────────────────────────
//  Page: Testimonials Manager
//  Cards with approve/reject + delete actions
// ─────────────────────────────────────────────

import { useState, useEffect } from 'react';
import { Check, X, Trash2, Star } from 'lucide-react';
import { Badge, Button, Card, SectionHeader, Avatar } from '../components/ui/index.jsx';
import { supabase } from '../lib/supabase';

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={12} className={i <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'} />
      ))}
    </div>
  );
}

export default function TestimonialsPage() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
  fetchTestimonials();
}, []);

async function fetchTestimonials() {

  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('id', { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  setItems(data || []);
}

  async function approve(id) {

  const { error } = await supabase
    .from('testimonials')
    .update({ approved: true })
    .eq('id', id);

  if (error) {
    console.error(error);
    return;
  }

  setItems(ts =>
    ts.map(t =>
      t.id === id
        ? { ...t, approved: true }
        : t
    )
  );
}
  async function remove(id) {

  const { error } = await supabase
    .from('testimonials')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(error);
    return;
  }

  setItems(ts => ts.filter(t => t.id !== id));
}
  const filtered = filter === 'All'      ? items
    : filter === 'Approved'  ? items.filter(t => t.approved)
    : items.filter(t => !t.approved);

  const pending  = items.filter(t => !t.approved).length;
  const approved = items.filter(t => t.approved).length;

  const avatarColors = ['blue', 'gold', 'green', 'purple', 'blue'];

  return (
    <div className="p-5 lg:p-7 space-y-6">

      {/* ── Header ── */}
      <SectionHeader
        tag="⭐ Reviews"
        title="Client"
        highlight="Testimonials"
        subtitle={`${approved} approved · ${pending} pending review`}
      />

      {/* ── Summary ── */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-extrabold text-white">{items.length}</div>
          <div className="text-xs text-slate-500 mt-0.5">Total Reviews</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-extrabold text-emerald-400">{approved}</div>
          <div className="text-xs text-slate-500 mt-0.5">Approved</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-extrabold text-amber-400">{pending}</div>
          <div className="text-xs text-slate-500 mt-0.5">Pending</div>
        </Card>
      </div>

      {/* ── Filter Tabs ── */}
      <div className="flex gap-2">
        {['All', 'Approved', 'Pending'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              filter === f
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'border-blue-500/20 text-slate-400 hover:border-blue-500/40 hover:text-white'
            }`}
          >
            {f} {f === 'Pending' && pending > 0 && (
              <span className="ml-1 bg-amber-500 text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full inline-flex items-center justify-center">
                {pending}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Testimonial Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((t, i) => (
          <Card key={t.id} className="p-5 flex flex-col gap-4">

            {/* Top: stars + status */}
            <div className="flex items-center justify-between">
              <StarRating rating={t.rating} />
              <Badge variant={t.approved ? 'green' : 'gold'}>
                {t.approved ? 'Approved' : 'Pending'}
              </Badge>
            </div>

            {/* Quote text */}
            <p className="text-sm text-slate-300 leading-relaxed italic flex-1">
              "{t.text}"
            </p>

            {/* Author */}
            <div className="flex items-center gap-3 pt-3 border-t border-blue-500/10">
              <Avatar name={t.name} color={avatarColors[i % avatarColors.length]} />
              <div>
                <div className="text-sm font-semibold text-white">{t.name}</div>
                <div className="text-xs text-slate-500">{t.business}</div>
              </div>
              <div className="ml-auto text-xs text-slate-600">{t.date}</div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              {!t.approved && (
                <Button variant="success" size="sm" icon={Check} className="flex-1" onClick={() => approve(t.id)}>
                  Approve
                </Button>
              )}
              <Button variant="danger" size="sm" icon={Trash2} className={t.approved ? 'flex-1' : ''} onClick={() => remove(t.id)}>
                {t.approved ? 'Remove' : ''}
              </Button>
            </div>

          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-slate-500">
          <div className="text-4xl mb-3">⭐</div>
          <div className="text-sm">No {filter.toLowerCase()} testimonials</div>
        </div>
      )}

    </div>
  );
}
