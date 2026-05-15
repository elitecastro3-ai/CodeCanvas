// ─────────────────────────────────────────────
//  Page: Messages Inbox
//  Two-panel layout: list + detail view
// ─────────────────────────────────────────────

import { useState, useEffect } from 'react';
import { Trash2, Reply, Circle, CheckCircle } from 'lucide-react';
import { Badge, Button, Card, SectionHeader, Avatar } from '../components/ui/index.jsx';
import { supabase } from '../lib/supabase';

const SERVICE_COLORS = {
  'Website Development': 'blue',
  'App Development':     'purple',
  'Branding & Strategy': 'gold',
  'E-Commerce':          'teal',
  'Graphic Design':      'green',
};

export default function MessagesPage() {
  const [msgs, setMsgs] = useState([]);
  const [selected, setSelected] = useState(null);
  useEffect(() => {
  fetchMessages();
}, []);

async function fetchMessages() {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('id', { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  setMsgs(data);

  if (data.length > 0) {
    setSelected(data[0]);
  }
}
  const markRead = (id) => setMsgs(ms => ms.map(m => m.id === id ? { ...m, read: true } : m));
  const remove = async (id) => {

  const { error } = await supabase
    .from('messages')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(error);
    return;
  }

  setMsgs(ms => ms.filter(m => m.id !== id));

  if (selected?.id === id) {
    setSelected(null);
  }
};
  const selectMsg = (msg) => {
    setSelected(msg);
    markRead(msg.id);
  };

  const unread = msgs.filter(m => !m.read).length;

  return (
    <div className="p-5 lg:p-7 space-y-6">

      <SectionHeader
        tag="💬 Inbox"
        title="Client"
        highlight="Messages"
        subtitle={`${unread} unread · ${msgs.length} total`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5" style={{ minHeight: '520px' }}>

        {/* ── Message List (left panel) ── */}
        <Card className="lg:col-span-2 overflow-hidden flex flex-col">
          <div className="p-3 border-b border-blue-500/10 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Inbox</span>
            {unread > 0 && (
              <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {unread} new
              </span>
            )}
          </div>

          <div className="overflow-y-auto flex-1 divide-y divide-blue-500/5">
            {msgs.map(msg => (
              <div
                key={msg.id}
                onClick={() => selectMsg(msg)}
                className={`p-4 cursor-pointer transition-colors hover:bg-slate-700/30 ${
                  selected?.id === msg.id ? 'bg-blue-600/10 border-l-2 border-blue-500' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <Avatar name={msg.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold truncate ${msg.read ? 'text-slate-300' : 'text-white'}`}>
                        {msg.name}
                      </span>
                      {!msg.read && <span className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {msg.message || msg.subject}
                    </p>
                    <div className="flex items-center justify-between mt-1.5">
                      <Badge variant={SERVICE_COLORS[msg.service] ?? 'gray'}>
                        {msg.service}
                      </Badge>
                      <span className="text-[10px] text-slate-600">{new Date(msg.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* ── Message Detail (right panel) ── */}
        <Card className="lg:col-span-3 flex flex-col">
          {selected ? (
            <>
              {/* Detail header */}
              <div className="p-5 border-b border-blue-500/10 flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Avatar name={selected.name} size="lg" />
                  <div>
                    <div className="font-bold text-white">{selected.name}</div>
                    <div className="text-xs text-slate-500">{selected.email}</div>
                    <Badge variant={SERVICE_COLORS[selected.service] ?? 'gray'} className="mt-1">
                      {selected.service}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button variant="ghost"  size="sm" icon={CheckCircle} onClick={() => markRead(selected.id)} />
                  <Button variant="danger" size="sm" icon={Trash2}      onClick={() => remove(selected.id)} />
                </div>
              </div>

              {/* Message body */}
              <div className="flex-1 p-5">
                <div className="text-xs text-slate-600 mb-3">{new Date(selected.created_at).toLocaleString()}</div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {selected.message}
                </p>
              </div>

              {/* Reply area */}
              <div className="p-5 border-t border-blue-500/10">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Quick Reply</div>
                <textarea
                  rows={3}
                  placeholder={`Reply to ${selected.name}...`}
                  className="w-full bg-slate-900/60 border border-blue-500/20 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-blue-500/60 transition-all resize-none mb-3"
                />
                <div className="flex gap-2">
                  <Button variant="primary" icon={Reply} size="sm">Send Reply</Button>
                  <Button variant="outline" size="sm">
                    <a href={`mailto:${selected.email}`} className="no-underline text-inherit">Open in Email</a>
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
              <div className="text-5xl mb-4">💬</div>
              <div className="text-slate-400 text-sm">Select a message to read</div>
            </div>
          )}
        </Card>

      </div>
    </div>
  );
}
