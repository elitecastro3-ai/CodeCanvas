// ─────────────────────────────────────────────
//  Page: Portfolio Manager
//  Table of projects + Add Project modal form
// ─────────────────────────────────────────────

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, X, Upload } from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  Input,
  Select,
  Textarea,
  SectionHeader
} from '../components/ui/index.jsx';
import { supabase } from '../lib/supabase';

const CATEGORY_OPTIONS = [
  { value: 'Website',  label: 'Website'  },
  { value: 'App',      label: 'App'      },
  { value: 'Graphics', label: 'Graphics' },
  { value: 'Branding', label: 'Branding' },
];

/* ── Add/Edit Project Modal ── */
function ProjectModal({
  onClose,
  setProjects,
  editingProject
}) {
  const [form, setForm] = useState({

  
  title: editingProject?.title || '',
  category: editingProject?.category || 'Website',
  description: editingProject?.description || '',
  liveurl: editingProject?.liveurl || '',
  featured: editingProject?.featured || true,
});
  const [loading, setLoading] = useState(false);

  const [imageFile, setImageFile] = useState(null);

  const set = (key) => (e) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  async function addProject() {

  setLoading(true);

  let imageUrl = editingProject?.image || '';

  // Upload new image if selected
  if (imageFile) {

    const fileName = `${Date.now()}-${imageFile.name}`;

    const { error: uploadError } = await supabase.storage
      .from('portfolio-images')
      .upload(fileName, imageFile);

    if (uploadError) {
      console.error(uploadError);
      setLoading(false);
      return;
    }

    const { data } = supabase.storage
      .from('portfolio-images')
      .getPublicUrl(fileName);

    imageUrl = data.publicUrl;
  }

  const projectData = {
    title: form.title,
    category: form.category,
    description: form.description,
    liveurl: form.liveurl || null,
    image: imageUrl,
    featured: form.featured,
  };

  // ─────────────────────────
  // UPDATE PROJECT
  // ─────────────────────────
  if (editingProject) {

    const { data, error } = await supabase
      .from('portfolio')
      .update(projectData)
      .eq('id', editingProject.id)
      .select();

    console.log('UPDATE DATA:', data);
    console.log('UPDATE ERROR:', error);

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setProjects(prev =>
      prev.map(project =>
        project.id === editingProject.id
          ? data[0]
          : project
      )
    );

  } else {

    // ─────────────────────────
    // ADD NEW PROJECT
    // ─────────────────────────
    const { data, error } = await supabase
      .from('portfolio')
      .insert([projectData])
      .select();

    console.log('INSERT DATA:', data);
    console.log('INSERT ERROR:', error);

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setProjects(prev => [data[0], ...prev]);
  }

  setLoading(false);

  onClose();
}

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-xl bg-slate-900 border border-blue-500/30 rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-blue-500/10">
          <div>
            <h2 className="font-bold text-white">
  {editingProject ? 'Edit Project' : 'Add New Project'}
</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Fill in the details below
            </p>
          </div>

          <button
            type="button"
            onClick={() => onClose()}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">

          {/* Image upload area */}
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
              Project Image
            </label>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="project-image-upload"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
            <label
              htmlFor="project-image-upload"
              className="border-2 border-dashed border-blue-500/30 rounded-xl p-6 text-center hover:border-blue-500/60 transition-colors cursor-pointer group block"
            >
              <Upload
                size={24}
                className="mx-auto text-slate-600 group-hover:text-blue-400 transition-colors mb-2"
              />

              <p className="text-sm text-slate-500 group-hover:text-slate-400 transition-colors">
                Click to upload or drag & drop
              </p>

              <p className="text-xs text-slate-600 mt-1">
                PNG, JPG up to 5MB
              </p>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Project Name"
              placeholder="e.g. Celutamax Motors"
              value={form.title}
              onChange={set('title')}
              className="col-span-2"
            />
              <Input
              label="Live URL"
              placeholder="https://..."
              value={form.liveurl}
              onChange={set('liveurl')}
            />
            <Select
              label="Category"
              options={CATEGORY_OPTIONS}
              value={form.category}
              onChange={set('category')}
            />
          </div>

          <Textarea
            label="Description"
            placeholder="Brief description of the project..."
            value={form.description}
            onChange={set('description')}
            rows={3}
          />

        </div>

        {/* Footer */}
        <div className="p-5 border-t border-blue-500/10 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>

          <Button
            variant="primary"
            icon={Plus}
            onClick={addProject}
            disabled={loading}
          >
            {loading
              ? 'Uploading...'
              : editingProject
                ? 'Update Project'
                : 'Add Project'}
          </Button>
        </div>

      </div>
    </div>
  );
}

/* ── Main Portfolio Page ── */
export default function PortfolioPage() {
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('All');
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    console.log("Fetching portfolio...");

    const { data, error } = await supabase
      .from('portfolio')
      .select('*')
      .order('id', { ascending: false });

    console.log("DATA:", data);
    console.log("ERROR:", error);

    if (error) {
      console.error(error);
    } else {
      setProjects(data);
    }
  }

  const categories = ['All', 'Website', 'App', 'Graphics', 'Branding'];

  const filtered =
    filter === 'All'
      ? projects
      : projects.filter(p => p.category === filter);

  async function deleteProject(id) {

  const confirmDelete = window.confirm(
    'Delete this project?'
  );

  if (!confirmDelete) return;

  const { error } = await supabase
    .from('portfolio')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(error);
    return;
  }

  setProjects(prev =>
    prev.filter(project => project.id !== id)
  );
}

  return (
    <div className="p-5 lg:p-7 space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SectionHeader
          tag="🖼️ Portfolio"
          title="Project"
          highlight="Showcase"
          subtitle={`${projects.length} projects total`}
        />

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setShowModal(true)}
        >
          Add Project
        </Button>
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
                <th className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest px-5 py-3">
                  Project
                </th>

                <th className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest px-4 py-3 hidden sm:table-cell">
                  Category
                </th>

                <th className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest px-4 py-3 hidden md:table-cell">
                  Description
                </th>

                <th className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest px-4 py-3">
                  Status
                </th>

                <th className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest px-4 py-3 hidden lg:table-cell">
                  Date
                </th>

                <th className="px-5 py-3" />
              </tr>
            </thead>

            <tbody className="divide-y divide-blue-500/5">
              {filtered.map(project => (
                <tr
                  key={project.id}
                  className="hover:bg-slate-700/20 transition-colors group"
                >

                  {/* Project */}
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">

                      <div className="w-9 h-9 rounded-xl bg-blue-500/20 flex items-center justify-center text-sm font-bold text-blue-400 flex-shrink-0">
                        {project.title?.charAt(0)}
                      </div>

                      <span className="text-sm font-semibold text-white">
                        {project.title}
                      </span>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <Badge variant="blue">
                      {project.category}
                    </Badge>
                  </td>

                  {/* Description */}
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-sm text-slate-400">
                      {project.description?.slice(0, 40)}...
                    </span>
                  </td>

                  {/* Featured */}
                  <td className="px-4 py-3">
                    <Badge variant={project.featured ? 'green' : 'gray'}>
                      {project.featured ? 'Featured' : 'Normal'}
                    </Badge>
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-xs text-slate-500">
                      {new Date(project.created_at).toLocaleDateString()}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">

                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Eye}
                        className="!p-1.5"
                        onClick={() => {
                          if (project.liveurl) {
                            window.open(project.liveurl, '_blank');
                          } else {
                            alert('No live URL for this project');
                          }
                        }}
                      />

                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Edit2}
                        className="!p-1.5"
                        onClick={() => {
                          setEditingProject(project);
                          setShowModal(true);
                        }}
                      />

                      <Button
                        variant="danger"
                        size="sm"
                        icon={Trash2}
                        className="!p-1.5"
                        onClick={() => deleteProject(project.id)}
                      />

                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-slate-500 text-sm">
              No projects found for{' '}
              <strong className="text-slate-400">
                "{filter}"
              </strong>
            </div>
          )}

        </div>
      </Card>

      {/* ── Modal ── */}
      {showModal && (
  <ProjectModal
    onClose={() => {
      setShowModal(false);
      setEditingProject(null);
    }}
    setProjects={setProjects}
    editingProject={editingProject}
  />
)}

    </div>
  );
}