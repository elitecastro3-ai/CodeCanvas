// ─────────────────────────────────────────────
//  Page: Media Library
//  Grid + list view for uploaded files/images
// ─────────────────────────────────────────────

import { useState, useEffect } from 'react';
import {
  Upload,
  Trash2,
  Download,
  Grid,
  List,
  Image,
  FileText,
  Archive
} from 'lucide-react';

import {
  Badge,
  Button,
  Card,
  SectionHeader
} from '../components/ui/index.jsx';

import { supabase } from '../lib/supabase';

const TYPE_ICON = {
  image: Image,
  pdf: FileText,
  file: Archive
};

const TYPE_COLOR = {
  image: 'blue',
  pdf: 'red',
  file: 'gold'
};

const TAG_COLOR = {
  Portfolio: 'blue',
  Brand: 'gold',
  Deliverable: 'green',
  Draft: 'gray',
  Design: 'purple',
  Marketing: 'teal'
};

const FILE_EMOJIS = {
  'celutamax-hero.jpg': '🚗',
  'deliverygo-screens.png': '📱',
  'codecanvas-logo.png': '🎨',
  'shopease-preview.jpg': '🛒',
  'brand-pack-amara.zip': '📦',
  'logo-concepts-v2.pdf': '📄',
  'biztrack-wireframe.fig': '🖌️',
  'hero-banner-may.jpg': '🌟',
};

export default function MediaPage() {

  const [items, setItems] = useState([]);
  const [view, setView] = useState('grid');
  const [filter, setFilter] = useState('All');
  const [dragging, setDragging] = useState(false);
  const [selectedTag, setSelectedTag] = useState('Portfolio');

  useEffect(() => {
    fetchMedia();
  }, []);

  async function fetchMedia() {

    const { data, error } = await supabase
      .from('media')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setItems(data || []);
  }

  const tags = ['All', ...new Set(items.map(i => i.tag))];

  const filtered =
    filter === 'All'
      ? items
      : items.filter(i => i.tag === filter);

  async function handleUpload(e) {

    const file = e.target.files[0];

    if (!file) return;

    const fileName = `${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from('media-files')
      .upload(fileName, file);

    if (uploadError) {
      console.error(uploadError);
      return;
    }

    const { data } = supabase.storage
      .from('media-files')
      .getPublicUrl(fileName);

    const fileUrl = data.publicUrl;

    const mediaItem = {
      name: file.name,

      type: file.type.includes('image')
        ? 'image'
        : file.type.includes('pdf')
        ? 'pdf'
        : 'file',

      tag: selectedTag,

      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,

      url: fileUrl
    };

    const { data: inserted, error } = await supabase
      .from('media')
      .insert([mediaItem])
      .select();

    if (error) {
      console.error(error);
      return;
    }

    setItems(prev => [...inserted, ...prev]);

    e.target.value = '';
  }

  async function remove(id, url) {

    const fileName = url.split('/').pop();

    await supabase.storage
      .from('media-files')
      .remove([fileName]);

    const { error } = await supabase
      .from('media')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(error);
      return;
    }

    setItems(prev => prev.filter(i => i.id !== id));
  }

  return (
    <div className="p-5 lg:p-7 space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <SectionHeader
          tag="🖼️ Media"
          title="Media"
          highlight="Library"
          subtitle={`${items.length} files · ${items.filter(i => i.type === 'image').length} images`}
        />

        <div className="flex gap-2 items-center">

          <button
            onClick={() => setView('grid')}
            className={`p-2 rounded-lg border transition-all ${
              view === 'grid'
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'border-blue-500/20 text-slate-400 hover:text-white'
            }`}
          >
            <Grid size={14} />
          </button>

          <button
            onClick={() => setView('list')}
            className={`p-2 rounded-lg border transition-all ${
              view === 'list'
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'border-blue-500/20 text-slate-400 hover:text-white'
            }`}
          >
            <List size={14} />
          </button>

          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="bg-slate-900 border border-blue-500/20 text-white text-sm rounded-lg px-3 py-2 outline-none"
          >
            <option value="Portfolio">Portfolio</option>
            <option value="Brand">Brand</option>
            <option value="Deliverable">Deliverable</option>
            <option value="Draft">Draft</option>
            <option value="Design">Design</option>
            <option value="Marketing">Marketing</option>
          </select>

          <label
            htmlFor="media-upload"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2 text-sm font-medium transition-all"
          >
            <Upload size={16} />
            Upload File
          </label>

          <input
            type="file"
            id="media-upload"
            className="hidden"
            onChange={handleUpload}
          />

        </div>
      </div>

      {/* ── Drop Zone ── */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}

        onDragLeave={() => setDragging(false)}

        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
        }}

        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
          dragging
            ? 'border-blue-400 bg-blue-500/10'
            : 'border-blue-500/20 hover:border-blue-500/40 hover:bg-slate-800/30'
        }`}
      >

        <Upload
          size={28}
          className={`mx-auto mb-2 transition-colors ${
            dragging ? 'text-blue-400' : 'text-slate-600'
          }`}
        />

        <p
          className={`text-sm transition-colors ${
            dragging ? 'text-blue-300' : 'text-slate-500'
          }`}
        >
          {dragging
            ? 'Drop files here!'
            : 'Drag & drop files here, or click Upload File above'}
        </p>

        <p className="text-xs text-slate-600 mt-1">
          PNG, JPG, PDF, ZIP, FIG — max 20MB
        </p>

      </div>

      {/* ── Filter Tags ── */}
      <div className="flex gap-2 flex-wrap">

        {tags.map(tag => (

          <button
            key={tag}
            onClick={() => setFilter(tag)}
            className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
              filter === tag
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'border-blue-500/20 text-slate-400 hover:border-blue-500/40 hover:text-white'
            }`}
          >
            {tag}
          </button>

        ))}

      </div>

      {/* ── Grid View ── */}
      {view === 'grid' && (

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">

          {filtered.map(item => {

            const IconComp = TYPE_ICON[item.type] ?? Archive;

            return (

              <Card
                key={item.id}
                hover
                className="overflow-hidden group relative"
              >

                {/* Thumbnail */}
                <div className="aspect-square bg-slate-700/40 flex items-center justify-center text-4xl border-b border-blue-500/10">

                  {item.type === 'image'
                    ? (
                      <span>
                        {FILE_EMOJIS[item.name] ?? '🖼️'}
                      </span>
                    )
                    : (
                      <IconComp
                        size={36}
                        className={`text-${TYPE_COLOR[item.type]}-400 opacity-50`}
                      />
                    )
                  }

                </div>

                {/* Info */}
                <div className="p-3">

                  <p className="text-xs font-semibold text-white truncate">
                    {item.name}
                  </p>

                  <div className="flex items-center justify-between mt-1.5">

                    <span className="text-[10px] text-slate-500">
                      {item.size}
                    </span>

                    <Badge variant={TAG_COLOR[item.tag] ?? 'gray'}>
                      {item.tag}
                    </Badge>

                  </div>
                </div>

                {/* Hover actions */}
                <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-2xl">

                  <a
                    href={item.url}
                    download
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Download}
                      className="!p-2"
                    />
                  </a>

                  <Button
                    variant="danger"
                    size="sm"
                    icon={Trash2}
                    className="!p-2"
                    onClick={() => remove(item.id, item.url)}
                  />

                </div>

              </Card>

            );
          })}

        </div>

      )}

      {/* ── List View ── */}
      {view === 'list' && (

        <Card className="overflow-hidden">

          <table className="w-full">

            <thead>

              <tr className="border-b border-blue-500/10">

                <th className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest px-5 py-3">
                  File
                </th>

                <th className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest px-4 py-3 hidden sm:table-cell">
                  Type
                </th>

                <th className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest px-4 py-3">
                  Tag
                </th>

                <th className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest px-4 py-3 hidden md:table-cell">
                  Size
                </th>

                <th className="px-5 py-3" />

              </tr>

            </thead>

            <tbody className="divide-y divide-blue-500/5">

              {filtered.map(item => {

                const IconComp = TYPE_ICON[item.type] ?? Archive;

                return (

                  <tr
                    key={item.id}
                    className="hover:bg-slate-700/20 transition-colors group"
                  >

                    <td className="px-5 py-3">

                      <div className="flex items-center gap-3">

                        <div className="w-8 h-8 rounded-lg bg-slate-700/60 flex items-center justify-center flex-shrink-0">

                          <IconComp
                            size={14}
                            className="text-blue-400"
                          />

                        </div>

                        <span className="text-sm font-medium text-white truncate max-w-[160px]">
                          {item.name}
                        </span>

                      </div>

                    </td>

                    <td className="px-4 py-3 hidden sm:table-cell">

                      <Badge variant={TYPE_COLOR[item.type] ?? 'gray'}>
                        {item.type}
                      </Badge>

                    </td>

                    <td className="px-4 py-3">

                      <Badge variant={TAG_COLOR[item.tag] ?? 'gray'}>
                        {item.tag}
                      </Badge>

                    </td>

                    <td className="px-4 py-3 hidden md:table-cell">

                      <span className="text-xs text-slate-500">
                        {item.size}
                      </span>

                    </td>

                    <td className="px-5 py-3">

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">

                        <a
                          href={item.url}
                          download
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={Download}
                            className="!p-1.5"
                          />
                        </a>

                        <Button
                          variant="danger"
                          size="sm"
                          icon={Trash2}
                          className="!p-1.5"
                          onClick={() => remove(item.id, item.url)}
                        />

                      </div>

                    </td>

                  </tr>

                );
              })}

            </tbody>

          </table>

        </Card>

      )}

    </div>
  );
}