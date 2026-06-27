'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Loader, Edit2, X, Award } from 'lucide-react';
import { toast } from 'sonner';
import UploadDropzone from './UploadDropzone';

interface Certification {
  id?: string;
  title: string;
  issuer: string;
  issue_date: string;
  expiry_date: string | null;
  credential_id: string;
  credential_url: string;
  badge_url?: string;
}

export default function CertificationsManager() {
  const supabase = createClient();
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const [form, setForm] = useState<Certification>({
    title: '',
    issuer: '',
    issue_date: '',
    expiry_date: '',
    credential_id: '',
    credential_url: '',
    badge_url: '',
  });

  useEffect(() => {
    loadCertifications();
  }, []);

  const loadCertifications = async () => {
    try {
      const { data, error } = await supabase
        .from('certifications')
        .select('*')
        .order('issue_date', { ascending: false });

      if (error) throw error;
      setCertifications(data || []);
    } catch (error) {
      toast.error('Failed to load certifications');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBadgeUpload = async (files: File[]) => {
    if (files.length === 0) return;

    setUploading(true);
    try {
      const file = files[0];
      const fileName = `${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from('certifications')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('certifications')
        .getPublicUrl(fileName);

      setForm((prev) => ({ ...prev, badge_url: data.publicUrl }));
      toast.success('Badge uploaded');
    } catch (error) {
      toast.error('Failed to upload badge');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const saveCertification = async () => {
    if (!form.title || !form.issuer || !form.issue_date) {
      toast.error('Title, issuer, and issue date are required');
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        const { error } = await supabase
          .from('certifications')
          .update(form)
          .eq('id', editingId);

        if (error) throw error;
        toast.success('Certification updated');
      } else {
        const { error } = await supabase
          .from('certifications')
          .insert([form]);

        if (error) throw error;
        toast.success('Certification added');
      }

      setModalOpen(false);
      loadCertifications();
      resetForm();
    } catch (error) {
      toast.error('Failed to save certification');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const deleteCertification = async (id: string) => {
    setDeleting(id);
    try {
      const { error } = await supabase
        .from('certifications')
        .delete()
        .eq('id', id);

      if (error) throw error;

      loadCertifications();
      toast.success('Certification deleted');
    } catch (error) {
      toast.error('Failed to delete certification');
      console.error(error);
    } finally {
      setDeleting(null);
    }
  };

  const editCertification = (cert: Certification) => {
    setForm(cert);
    setEditingId(cert.id || null);
    setModalOpen(true);
  };

  const resetForm = () => {
    setForm({
      title: '',
      issuer: '',
      issue_date: '',
      expiry_date: '',
      credential_id: '',
      credential_url: '',
      badge_url: '',
    });
    setEditingId(null);
  };

  const closeModal = () => {
    setModalOpen(false);
    resetForm();
  };

  const isExpired = (expiryDate: string | null) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
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
        <h1 className="text-2xl font-bold text-gray-900">Certifications</h1>
        <motion.button
          onClick={() => {
            resetForm();
            setModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          whileHover={{ scale: 1.05 }}
        >
          <Plus className="w-5 h-5" />
          Add Certification
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {certifications.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 py-12">
            No certifications yet. Add your first certification.
          </div>
        ) : (
          certifications.map((cert) => {
            const expired = isExpired(cert.expiry_date);

            return (
              <motion.div
                key={cert.id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow relative overflow-hidden"
                whileHover={{ y: -4 }}
              >
                {expired && (
                  <div className="absolute top-0 right-0 px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-bl">
                    Expired
                  </div>
                )}

                <div className="flex gap-4 mb-4">
                  {cert.badge_url && (
                    <img
                      src={cert.badge_url}
                      alt={cert.title}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                  )}

                  {!cert.badge_url && (
                    <div className="w-20 h-20 rounded-lg bg-blue-50 flex items-center justify-center">
                      <Award className="w-10 h-10 text-blue-500" />
                    </div>
                  )}

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">
                        {cert.title}
                      </h3>
                      <p className="text-xs text-gray-600">{cert.issuer}</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(cert.issue_date).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                {cert.expiry_date && (
                  <p
                    className={`text-xs mb-3 ${
                      expired ? 'text-red-600' : 'text-gray-600'
                    }`}
                  >
                    Expires:{' '}
                    {new Date(cert.expiry_date).toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                )}

                {cert.credential_url && (
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-500 hover:underline block mb-3"
                  >
                    View Credential
                  </a>
                )}

                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  <motion.button
                    onClick={() => editCertification(cert)}
                    className="flex-1 p-2 hover:bg-gray-100 rounded transition-colors text-sm"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Edit2 className="w-4 h-4 text-gray-600 inline mr-1" />
                    Edit
                  </motion.button>
                  <motion.button
                    onClick={() => deleteCertification(cert.id!)}
                    disabled={deleting === cert.id}
                    className="flex-1 p-2 hover:bg-red-100 rounded transition-colors text-sm disabled:opacity-50"
                    whileHover={{ scale: 1.05 }}
                  >
                    {deleting === cert.id ? (
                      <Loader className="w-4 h-4 animate-spin text-gray-600 inline mr-1" />
                    ) : (
                      <Trash2 className="w-4 h-4 text-red-500 inline mr-1" />
                    )}
                    Delete
                  </motion.button>
                </div>
              </motion.div>
            );
          })
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
                    {editingId ? 'Edit Certification' : 'Add Certification'}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="p-6 space-y-4">
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
                      placeholder="e.g., AWS Solutions Architect"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Issuer
                    </label>
                    <input
                      type="text"
                      name="issuer"
                      value={form.issuer}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Amazon Web Services"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Issue Date
                      </label>
                      <input
                        type="date"
                        name="issue_date"
                        value={form.issue_date}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date (optional)
                      </label>
                      <input
                        type="date"
                        name="expiry_date"
                        value={form.expiry_date || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Credential ID
                    </label>
                    <input
                      type="text"
                      name="credential_id"
                      value={form.credential_id}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., AWS-12345678"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Credential URL
                    </label>
                    <input
                      type="url"
                      name="credential_url"
                      value={form.credential_url}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Badge Image
                    </label>
                    <UploadDropzone
                      onUpload={handleBadgeUpload}
                      maxFiles={1}
                      label="Upload certificate badge"
                    />
                    {form.badge_url && (
                      <img
                        src={form.badge_url}
                        alt="Badge"
                        className="w-24 h-24 object-cover rounded mt-2"
                      />
                    )}
                  </div>

                  <motion.button
                    onClick={saveCertification}
                    disabled={saving || uploading}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 font-medium"
                    whileHover={{ scale: 1.02 }}
                  >
                    {editingId
                      ? 'Update Certification'
                      : 'Add Certification'}
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
