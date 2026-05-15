// ─────────────────────────────────────────────
//  Page: Services Manager
//  Table of services with pricing + active toggle
// ─────────────────────────────────────────────

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { Badge, Button, Card, Input, Select, SectionHeader, Toggle } from '../components/ui/index.jsx';
import { supabase } from '../lib/supabase';

const CATEGORY_OPTIONS = [
  { value: 'Web',    label: 'Web'    },
  { value: 'App',    label: 'App'    },
  { value: 'Design', label: 'Design' },
];

function formatUGX(n) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000)    return `${(n / 1000).toFixed(0)}K`;
  return `${n}`;
}

/* ── Add Service Modal ── */
function ServiceModal({ onClose, setServices, editingService }) {
 const [form, setForm] = useState({
  name: editingService?.name || '',
  category: editingService?.category || 'Web',
  priceMin: editingService?.pricemin || '',
  priceMax: editingService?.pricemax || '',
});
  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));
  const addService = async () => {
  const newService = {
    name: form.name,
    category: form.category,
    pricemin: Number(form.priceMin),
    pricemax: Number(form.priceMax),
    active: true,
  };

  if (editingService) {
    const { data, error } = await supabase
      .from('services')
      .update(newService)
      .eq('id', editingService.id)
      .select();

    if (error) {
      console.log('UPDATE ERROR:', error);
      return;
    }

    setServices(ss =>
      ss.map(s => s.id === editingService.id ? data[0] : s)
    );

  } else {
    const { data, error } = await supabase
      .from('services')
      .insert([newService])
      .select();

    if (error) {
      console.log('INSERT ERROR:', error);
      return;
    }

    setServices(ss => [...ss, ...data]);
  }

  onClose();
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-slate-900 border border-blue-500/30 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-blue-500/10">
          <h2 className="font-bold text-white">Add Service</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={18} /></button>
        </div>
        <div className="p-5 space-y-4">
          <Input  label="Service Name" placeholder="e.g. Basic Website (5 pages)" value={form.name}     onChange={set('name')} />
          <Select label="Category"     options={CATEGORY_OPTIONS}                  value={form.category} onChange={set('category')} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Min Price (UGX)" placeholder="e.g. 300000" type="number" value={form.priceMin} onChange={set('priceMin')} />
            <Input label="Max Price (UGX)" placeholder="e.g. 600000" type="number" value={form.priceMax} onChange={set('priceMax')} />
          </div>
        </div>
        <div className="p-5 border-t border-blue-500/10 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" icon={Plus} onClick={addService}>
  Add Service
</Button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function ServicesPage() {
  const [showModal, setShowModal]   = useState(false);
  const [services, setServices] = useState([]);
  const [filter, setFilter]         = useState('All');
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [editingService, setEditingService] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
  console.log("Fetching services...");

  const { data, error } = await supabase
    .from('services')
    .select('*');

  console.log("DATA:", data);
  console.log("ERROR:", error);

  if (error) {
    console.error(error);
  } else {
    setServices(data);
  }
}

  const categories = ['All', 'Web', 'App', 'Design'];
  const filtered = filter === 'All' ? services : services.filter(s => s.category === filter);

  const toggleActive = (id) => setServices(ss =>
    ss.map(s => s.id === id ? { ...s, active: !s.active } : s)
  );
  const deleteService = (id) => setServices(ss => ss.filter(s => s.id !== id));

  const catColor = { Web: 'blue', App: 'purple', Design: 'gold' };

  return (
    <div className="p-5 lg:p-7 space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SectionHeader
          tag="⚙️ Services"
          title="Service"
          highlight="Offerings"
          subtitle={`${services.filter(s => s.active).length} active of ${services.length} total`}
        />
        <Button variant="primary" icon={Plus} onClick={() => setShowModal(true)}>
          Add Service
        </Button>
      </div>

      {/* ── Summary cards ── */}
      <div className="grid grid-cols-3 gap-4">
        {['Web', 'App', 'Design'].map(cat => {
          const items = services.filter(s => s.category === cat);
          return (
            <Card key={cat} className="p-4 text-center">
              <div className="text-2xl font-extrabold text-white">{items.length}</div>
              <div className="text-xs text-slate-500 mt-0.5">{cat} Services</div>
              <div className="text-[11px] text-emerald-400 mt-1">{items.filter(i => i.active).length} active</div>
            </Card>
          );
        })}
      </div>

      {/* ── Filter Tabs ── */}
      <div className="flex gap-2 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              filter === cat
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'border-blue-500/20 text-slate-400 hover:border-blue-500/40 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Table ── */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-blue-500/10">
                <th className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest px-5 py-3">Service</th>
                <th className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest px-4 py-3 hidden sm:table-cell">Category</th>
                <th className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest px-4 py-3">Price Range (UGX)</th>
                <th className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest px-4 py-3">Active</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-500/5">
              {filtered.map(service => (
                <tr key={service.id} className="hover:bg-slate-700/20 transition-colors group">
                  <td className="px-5 py-3.5">
                    <span className={`text-sm font-semibold ${service.active ? 'text-white' : 'text-slate-500'}`}>
                      {service.name}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 hidden sm:table-cell">
                    <Badge variant={catColor[service.category] ?? 'gray'}>{service.category}</Badge>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-sm font-bold text-blue-400">
                      {formatUGX(service.pricemin)} – {formatUGX(service.pricemax)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <Toggle checked={service.active} onChange={() => toggleActive(service.id)} />
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Edit2}
                        className="!p-1.5"
                        onClick={() => {
                          setEditingService(service);
                          setShowEditModal(true);
                        }}
                      />
                      <Button variant="danger" size="sm" icon={Trash2} className="!p-1.5" onClick={() => deleteService(service.id)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

     {showModal && (
        <ServiceModal
          onClose={() => setShowModal(false)}
          setServices={setServices}
        />
      )}

{showEditModal && (
  <ServiceModal
    onClose={() => setShowEditModal(false)}
    setServices={setServices}
    editingService={editingService}
  />
)}
    </div>
  );
}
