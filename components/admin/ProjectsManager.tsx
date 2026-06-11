'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Loader, X } from 'lucide-react';
import { toast } from 'sonner';
import UploadDropzone from './UploadDropzone';

interface Project {
  id?: string;
  title: string;
  slug: string;
  description: string;
  demo_url: string;
  repo_url: string;
  tags: string[];
  tech_stack: string[];
  featured: boolean;
  cover_url?: string;
}

const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

export default function ProjectsManager() {
  const supabase = createClient();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [form, setForm] = useState<Project>({
    title: '',
    slug: '',
    description: '',
    demo_url: '',
    repo_url: '',
    tags: [],
    tech_stack: [],
    featured: false,
    cover_url: '',
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      toast.error('Failed to load projects');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));

    if (name === 'title' && !editingId) {
      setForm((prev) => ({
        ...prev,
        slug: generateSlug(value),
      }));
    }
  };

  const handleTagsChange = (value: string, field: 'tags' | 'tech_stack') => {
    const items = value.split(',').map((item) => item.trim());
    setForm((prev) => ({
      ...prev,
      [field]: items.filter((item) => item),
    }));
  };

  const generateDescription = async () => {
    if (!form.title) {
      toast.error('Title is required');
      return;
    }

    setGenerating(true);
    try {
      const response = await fetch('/api/ai/gen-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: form.title, tech_stack: form.tech_stack }),
      });

      if (!response.ok) throw new Error('Failed to generate description');

      const data = await response.json();
      setForm((prev) => ({ ...prev, description: data.description }));
      toast.success('Description generated');
    } catch (error) {
      toast.error('Failed to generate description');
      console.error(error);
    } finally {
      setGenerating(false);
    }
  };

  const handleCoverUpload = async (files: File[]) => {
    if (files.length === 0) return;

    setUploading(true);
    try {
      const file = files[0];
      const fileName = `${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('project-images')
        .getPublicUrl(fileName);

      setForm((prev) => ({ ...prev, cover_url: data.publicUrl }));
      toast.success('Cover image uploaded');
    } catch (error) {
      toast.error('Failed to upload cover');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const saveProject = async () => {
    if (!form.title || !form.slug) {
      toast.error('Title and slug are required');
      return;
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from('projects')
          .update(form)
          .eq('id', editingId);

        if (error) throw error;
        toast.success('Project updated');
      } else {
        const { error } = await supabase.from('projects').insert([form]);

        if (error) throw error;
        toast.success('Project created');
      }

      setDrawerOpen(false);
      loadProjects();
    } catch (error) {
      toast.error('Failed to save project');
      console.error(error);
    }
  };

  const editProject = (project: Project) => {
    setForm(project);
    setEditingId(project.id || null);
    setDrawerOpen(true);
  };

  const deleteProject = async (id: string) => {
    setDeleting(id);
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);

      if (error) throw error;

      toast.success('Project deleted');
      loadProjects();
      setDeleteConfirm(null);
    } catch (error) {
      toast.error('Failed to delete project');
      console.error(error);
    } finally {
      setDeleting(null);
    }
  };

  const resetForm = () => {
    setForm({
      title: '',
      slug: '',
      description: '',
      demo_url: '',
      repo_url: '',
      tags: [],
      tech_stack: [],
      featured: false,
      cover_url: '',
    });
    setEditingId(null);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    resetForm();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <motion.button
          onClick={() => {
            resetForm();
            setDrawerOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          whileHover={{ scale: 1.05 }}
        >
          <Plus className="w-5 h-5" />
          Add Project
        </motion.button>
      </div>

      <div className="grid gap-4">
        {projects.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            No projects yet. Create one to get started.
          </div>
        ) : (
          projects.map((project) => (
            <motion.div
              key={project.id}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
              whileHover={{ y: -2 }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">
                      {project.title}
                    </h3>
                    {project.featured && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {project.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <motion.button
                    onClick={() => editProject(project)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Edit2 className="w-5 h-5 text-gray-600" />
                  </motion.button>
                  <motion.button
                    onClick={() => setDeleteConfirm(project.id!)}
                    className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </motion.button>
                </div>
              </div>

              <AnimatePresence>
                {deleteConfirm === project.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 p-3 bg-red-50 border border-red-200 rounded flex justify-between items-center"
                  >
                    <p className="text-sm text-red-700">
                      Are you sure? This cannot be undone.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="px-3 py-1 text-sm bg-white border border-red-300 rounded hover:bg-red-50"
                      >
                        Cancel
                      </button>
                      <motion.button
                        onClick={() => deleteProject(project.id!)}
                        disabled={deleting === project.id}
                        className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 flex items-center gap-1"
                        whileHover={{ scale: 1.05 }}
                      >
                        {deleting === project.id && (
                          <Loader className="w-3 h-3 animate-spin" />
                        )}
                        Delete
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        )}
      </div>

      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDrawer}
              className="fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-white z-50 overflow-y-auto"
            >
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingId ? 'Edit Project' : 'New Project'}
                  </h2>
                  <button
                    onClick={closeDrawer}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={form.slug}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <motion.button
                    onClick={generateDescription}
                    disabled={generating}
                    className="mt-2 px-3 py-1 text-sm bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50 flex items-center gap-1"
                    whileHover={{ scale: 1.05 }}
                  >
                    {generating && <Loader className="w-3 h-3 animate-spin" />}
                    Generate with AI
                  </motion.button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Demo URL
                  </label>
                  <input
                    type="url"
                    name="demo_url"
                    value={form.demo_url}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Repository URL
                  </label>
                  <input
                    type="url"
                    name="repo_url"
                    value={form.repo_url}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={form.tags.join(', ')}
                    onChange={(e) =>
                      handleTagsChange(e.target.value, 'tags')
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tech Stack (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={form.tech_stack.join(', ')}
                    onChange={(e) =>
                      handleTagsChange(e.target.value, 'tech_stack')
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={form.featured}
                      onChange={handleInputChange}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Featured
                    </span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Image
                  </label>
                  <UploadDropzone
                    onUpload={handleCoverUpload}
                    maxFiles={1}
                    label="Upload cover image"
                  />
                  {form.cover_url && (
                    <img
                      src={form.cover_url}
                      alt="Cover"
                      className="w-full h-32 object-cover rounded mt-2"
                    />
                  )}
                </div>

                <motion.button
                  onClick={saveProject}
                  disabled={uploading}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 font-medium"
                  whileHover={{ scale: 1.02 }}
                >
                  {editingId ? 'Update Project' : 'Create Project'}
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
