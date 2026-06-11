'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { HexColorPicker } from 'react-colorful';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';
import { toast } from 'sonner';

interface ProfileForm {
  id: string;
  name: string;
  tagline: string;
  bio: string;
  email: string;
  location: string;
  avatar_url: string;
  resume_url: string;
  available: boolean;
  github: string;
  linkedin: string;
  twitter: string;
  brand_primary: string;
  brand_accent: string;
}

const THEME_PRESETS = [
  { name: 'Ocean', primary: '#0066cc', accent: '#00d4ff' },
  { name: 'Forest', primary: '#2d5016', accent: '#6ba34d' },
  { name: 'Sunset', primary: '#ff6b35', accent: '#f7931e' },
  { name: 'Midnight', primary: '#1a1a2e', accent: '#16213e' },
  { name: 'Rose', primary: '#e75480', accent: '#f997b6' },
  { name: 'Slate', primary: '#475569', accent: '#94a3b8' },
];

export default function ProfileForm() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [rewriting, setRewriting] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState<'primary' | 'accent' | null>(null);

  const [form, setForm] = useState<ProfileForm>({
    id: '',
    name: '',
    tagline: '',
    bio: '',
    email: '',
    location: '',
    avatar_url: '',
    resume_url: '',
    available: false,
    github: '',
    linkedin: '',
    twitter: '',
    brand_primary: '#0066cc',
    brand_accent: '#00d4ff',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profile')
        .select('*')
        .single();

      if (error) throw error;

      if (data) {
        const social = data.social ?? {};
        const theme = data.theme ?? {};
        setForm((prev) => ({
          ...prev,
          id: data.id,
          name: data.name ?? '',
          tagline: data.tagline ?? '',
          bio: data.bio ?? '',
          email: data.email ?? '',
          location: data.location ?? '',
          avatar_url: data.avatar_url ?? '',
          resume_url: data.resume_url ?? '',
          available: data.available ?? false,
          github: social.github ?? '',
          linkedin: social.linkedin ?? '',
          twitter: social.twitter ?? '',
          brand_primary: theme.brand_primary ?? '#0066cc',
          brand_accent: theme.brand_accent ?? '#00d4ff',
        }));
      }
    } catch (error) {
      toast.error('Failed to load profile');
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

  const handleToggle = (field: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: !prev[field as keyof ProfileForm],
    }));
  };

  const rewriteBio = async () => {
    if (!form.bio) {
      toast.error('Bio is empty');
      return;
    }

    setRewriting(true);
    try {
      const response = await fetch('/api/ai/rewrite-bio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bio: form.bio, tone: 'professional' }),
      });

      if (!response.ok) throw new Error('Failed to rewrite bio');

      const data = await response.json();
      setForm((prev) => ({ ...prev, bio: data.rewritten }));
      toast.success('Bio rewritten with AI');
    } catch (error) {
      toast.error('Failed to rewrite bio');
      console.error(error);
    } finally {
      setRewriting(false);
    }
  };

  const applyPreset = (preset: typeof THEME_PRESETS[0]) => {
    setForm((prev) => ({
      ...prev,
      brand_primary: preset.primary,
      brand_accent: preset.accent,
    }));
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        tagline: form.tagline,
        bio: form.bio,
        email: form.email,
        location: form.location,
        avatar_url: form.avatar_url,
        resume_url: form.resume_url,
        available: form.available,
        social: {
          github: form.github,
          linkedin: form.linkedin,
          twitter: form.twitter,
        },
        theme: {
          brand_primary: form.brand_primary,
          brand_accent: form.brand_accent,
        },
      };

      const { error } = await supabase
        .from('profile')
        .update(payload)
        .eq('id', form.id);

      if (error) throw error;

      toast.success('Profile saved successfully');
    } catch (error) {
      toast.error('Failed to save profile');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8">
      <section className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Basic Info</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tagline
          </label>
          <input
            type="text"
            name="tagline"
            value={form.tagline}
            onChange={handleInputChange}
            placeholder="e.g., Full-stack developer & designer"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bio
          </label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleInputChange}
            rows={5}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <motion.button
            onClick={rewriteBio}
            disabled={rewriting}
            className="mt-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            {rewriting && <Loader className="w-4 h-4 animate-spin" />}
            Rewrite Bio with AI
          </motion.button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
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
        </div>

        <div>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={form.available}
              onChange={() => handleToggle('available')}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm font-medium text-gray-700">
              Available for opportunities
            </span>
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Avatar URL
            </label>
            <input
              type="url"
              name="avatar_url"
              value={form.avatar_url}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resume URL
            </label>
            <input
              type="url"
              name="resume_url"
              value={form.resume_url}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </section>

      <section className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Social Links</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            GitHub
          </label>
          <input
            type="url"
            name="github"
            value={form.github}
            onChange={handleInputChange}
            placeholder="https://github.com/username"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            LinkedIn
          </label>
          <input
            type="url"
            name="linkedin"
            value={form.linkedin}
            onChange={handleInputChange}
            placeholder="https://linkedin.com/in/username"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Twitter
          </label>
          <input
            type="url"
            name="twitter"
            value={form.twitter}
            onChange={handleInputChange}
            placeholder="https://twitter.com/username"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </section>

      <section className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Theme Colors</h2>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Primary Color
            </label>
            <div className="relative">
              <motion.button
                onClick={() =>
                  setShowColorPicker(
                    showColorPicker === 'primary' ? null : 'primary'
                  )
                }
                className="w-full h-12 rounded-lg border-2 border-gray-300 flex items-center gap-2 px-4"
                style={{ backgroundColor: form.brand_primary }}
                whileHover={{ scale: 1.02 }}
              >
                <span className="text-white text-sm font-mono">
                  {form.brand_primary}
                </span>
              </motion.button>
              {showColorPicker === 'primary' && (
                <div className="absolute z-10 mt-2 p-3 bg-white rounded-lg shadow-lg border border-gray-200">
                  <HexColorPicker
                    color={form.brand_primary}
                    onChange={(color) =>
                      setForm((prev) => ({ ...prev, brand_primary: color }))
                    }
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Accent Color
            </label>
            <div className="relative">
              <motion.button
                onClick={() =>
                  setShowColorPicker(
                    showColorPicker === 'accent' ? null : 'accent'
                  )
                }
                className="w-full h-12 rounded-lg border-2 border-gray-300 flex items-center gap-2 px-4"
                style={{ backgroundColor: form.brand_accent }}
                whileHover={{ scale: 1.02 }}
              >
                <span className="text-white text-sm font-mono">
                  {form.brand_accent}
                </span>
              </motion.button>
              {showColorPicker === 'accent' && (
                <div className="absolute z-10 mt-2 p-3 bg-white rounded-lg shadow-lg border border-gray-200">
                  <HexColorPicker
                    color={form.brand_accent}
                    onChange={(color) =>
                      setForm((prev) => ({ ...prev, brand_accent: color }))
                    }
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">Presets</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {THEME_PRESETS.map((preset) => (
              <motion.button
                key={preset.name}
                onClick={() => applyPreset(preset)}
                className="p-3 border border-gray-300 rounded-lg hover:border-blue-500 transition-all flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex gap-1">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: preset.primary }}
                  />
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: preset.accent }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-700">
                  {preset.name}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <motion.button
        onClick={saveProfile}
        disabled={saving}
        className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 font-medium flex items-center justify-center gap-2"
        whileHover={{ scale: 1.02 }}
      >
        {saving && <Loader className="w-4 h-4 animate-spin" />}
        Save Profile
      </motion.button>
    </div>
  );
}
