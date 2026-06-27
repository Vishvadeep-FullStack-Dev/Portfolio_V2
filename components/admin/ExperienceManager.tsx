'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Loader, Edit2, X } from 'lucide-react';
import { toast } from 'sonner';
import UploadDropzone from './UploadDropzone';

interface Experience {
  id?: string;
  company: string;
  role: string;
  location: string;
  start_date: string;
  end_date: string | null;
  current: boolean;
  description: string;
  highlights: string[];
  logo_url?: string;
}

export default function ExperienceManager() {
  const supabase = createClient();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const [form, setForm] = useState<Experience>({
    company: '',
    role: '',
    location: '',
    start_date: '',
    end_date: '',
    current: false,
    description: '',
    highlights: [],
    logo_url: '',
  });

  useEffect(() => {
    loadExperiences();
  }, []);

  const loadExperiences = async () => {
    try {
      const { data, error } = await supabase
        .from('experience')
        .select('*')
        .order('start_date', { ascending: false });

      if (error) throw error;
      setExperiences(data || []);
    } catch (error) {
      toast.error('Failed to load experiences');
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
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleHighlightsChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      highlights: value.split('\n').filter((h) => h.trim()),
    }));
  };

  const handleLogoUpload = async (files: File[]) => {
    if (files.length === 0) return;

    setUploading(true);
    try {
      const file = files[0];
      const fileName = `${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      setForm((prev) => ({ ...prev, logo_url: data.publicUrl }));
      toast.success('Logo uploaded');
    } catch (error) {
      toast.error('Failed to upload logo');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const saveExperience = async () => {
    if (!form.company || !form.role || !form.start_date) {
      toast.error('Company, role, and start date are required');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        end_date: form.current ? null : form.end_date,
      };

      if (editingId) {
        const { error } = await supabase
          .from('experience')
          .update(payload)
          .eq('id', editingId);

        if (error) throw error;
        toast.success('Experience updated');
      } else {
        const { error } = await supabase.from('experience').insert([payload]);

        if (error) throw error;
        toast.success('Experience added');
      }

      setModalOpen(false);
      loadExperiences();
      resetForm();
    } catch (error) {
      toast.error('Failed to save experience');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const deleteExperience = async (id: string) => {
    setDeleting(id);
    try {
      const { error } = await supabase.from('experience').delete().eq('id', id);

      if (error) throw error;

      loadExperiences();
      toast.success('Experience deleted');
    } catch (error) {
      toast.error('Failed to delete experience');
      console.error(error);
    } finally {
      setDeleting(null);
    }
  };

  const editExperience = (exp: Experience) => {
    setForm(exp);
    setEditingId(exp.id || null);
    setModalOpen(true);
  };

  const resetForm = () => {
    setForm({
      company: '',
      role: '',
      location: '',
      start_date: '',
      end_date: '',
      current: false,
      description: '',
      highlights: [],
      logo_url: '',
    });
    setEditingId(null);
  };

  const closeModal = () => {
    setModalOpen(false);
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
        <h1 className="text-2xl font-bold text-gray-900">Experience</h1>
        <motion.button
          onClick={() => {
            resetForm();
            setModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          whileHover={{ scale: 1.05 }}
        >
          <Plus className="w-5 h-5" />
          Add Experience
        </motion.button>
      </div>

      <div className="space-y-4">
        {experiences.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            No experience yet. Add your first role.
          </div>
        ) : (
          experiences.map((exp) => (
            <motion.div
              key={exp.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
              whileHover={{ y: -2 }}
            >
              <div className="flex gap-4">
                {exp.logo_url && (
                  <img
                    src={exp.logo_url}
                    alt={exp.company}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                )}

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {exp.role}
                      </h3>
                      <p className="text-sm text-gray-600">{exp.company}</p>
                      {exp.location && (
                        <p className="text-sm text-gray-500">{exp.location}</p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <motion.button
                        onClick={() => editExperience(exp)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        whileHover={{ scale: 1.1 }}
                      >
                        <Edit2 className="w-5 h-5 text-gray-600" />
                      </motion.button>
                      <motion.button
                        onClick={() => deleteExperience(exp.id!)}
                        disabled={deleting === exp.id}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                        whileHover={{ scale: 1.1 }}
                      >
                        {deleting === exp.id ? (
                          <Loader className="w-5 h-5 animate-spin text-gray-600" />
                        ) : (
                          <Trash2 className="w-5 h-5 text-red-500" />
                        )}
                      </motion.button>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-2">
                    {new Date(exp.start_date).toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric',
                    })}{' '}
                    -{' '}
                    {exp.current
                      ? 'Present'
                      : new Date(exp.end_date!).toLocaleDateString('en-US', {
                          month: 'short',
                          year: 'numeric',
                        })}
                  </p>

                  {exp.description && (
                    <p className="text-sm text-gray-700 mb-2">
                      {exp.description}
                    </p>
                  )}

                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="text-sm text-gray-600 space-y-1">
                      {exp.highlights.map((highlight, idx) => (
                        <li key={idx} className="flex gap-2">
                          <span className="text-blue-500">•</span>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingId ? 'Edit Experience' : 'Add Experience'}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={form.company}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Role
                      </label>
                      <input
                        type="text"
                        name="role"
                        value={form.role}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={form.location}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date
                      </label>
                      <input
                        type="date"
                        name="start_date"
                        value={form.start_date}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date
                      </label>
                      <input
                        type="date"
                        name="end_date"
                        value={form.end_date || ''}
                        onChange={handleInputChange}
                        disabled={form.current}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      name="current"
                      checked={form.current}
                      onChange={handleInputChange}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Currently working here
                    </span>
                  </label>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Highlights (one per line)
                    </label>
                    <textarea
                      value={form.highlights.join('\n')}
                      onChange={(e) => handleHighlightsChange(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                      placeholder="Built API using Node.js&#10;Led team of 3 engineers&#10;Improved performance by 40%"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Logo
                    </label>
                    <UploadDropzone
                      onUpload={handleLogoUpload}
                      maxFiles={1}
                      label="Upload company logo"
                    />
                    {form.logo_url && (
                      <img
                        src={form.logo_url}
                        alt="Logo"
                        className="w-20 h-20 object-cover rounded mt-2"
                      />
                    )}
                  </div>

                  <motion.button
                    onClick={saveExperience}
                    disabled={saving || uploading}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 font-medium"
                    whileHover={{ scale: 1.02 }}
                  >
                    {editingId ? 'Update Experience' : 'Add Experience'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
