'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import { Loader, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface Meta {
  title: string;
  description: string;
  ogImage: string;
}

export default function MetaManager() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const [meta, setMeta] = useState<Meta>({
    title: '',
    description: '',
    ogImage: '',
  });

  useEffect(() => {
    loadMeta();
  }, []);

  const loadMeta = async () => {
    try {
      const { data, error } = await supabase
        .from('profile')
        .select('meta')
        .single();

      if (error) throw error;

      if (data?.meta) {
        setMeta(data.meta);
      }
    } catch (error) {
      toast.error('Failed to load meta information');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setMeta((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveMeta = async () => {
    setSaving(true);
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;

      if (!userId) {
        throw new Error('Not authenticated');
      }

      const { error } = await supabase
        .from('profile')
        .update({ meta })
        .eq('id', userId);

      if (error) throw error;

      toast.success('Meta information saved');
    } catch (error) {
      toast.error('Failed to save meta information');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateMetaTags = () => {
    return `<meta name="title" content="${meta.title}" />
<meta name="description" content="${meta.description}" />
<meta property="og:title" content="${meta.title}" />
<meta property="og:description" content="${meta.description}" />
<meta property="og:image" content="${meta.ogImage}" />
<meta property="twitter:title" content="${meta.title}" />
<meta property="twitter:description" content="${meta.description}" />
<meta property="twitter:image" content="${meta.ogImage}" />`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <section>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">OG & Meta Tags</h1>
      </section>

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Edit Meta Information</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Page Title
          </label>
          <input
            type="text"
            name="title"
            value={meta.title}
            onChange={handleInputChange}
            placeholder="Your portfolio - Full Stack Developer"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={60}
          />
          <p className="text-xs text-gray-500 mt-1">
            {meta.title.length}/60 characters
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meta Description
          </label>
          <textarea
            name="description"
            value={meta.description}
            onChange={handleInputChange}
            rows={3}
            placeholder="A brief description of your portfolio"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={160}
          />
          <p className="text-xs text-gray-500 mt-1">
            {meta.description.length}/160 characters
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            OG Image URL
          </label>
          <input
            type="url"
            name="ogImage"
            value={meta.ogImage}
            onChange={handleInputChange}
            placeholder="https://example.com/og-image.jpg"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Recommended size: 1200x630px
          </p>
        </div>

        {meta.ogImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 rounded-lg overflow-hidden border border-gray-200"
          >
            <img
              src={meta.ogImage}
              alt="OG Preview"
              className="w-full h-auto max-h-64 object-cover"
              onError={() => (
                <div className="w-full h-64 bg-gray-100 flex items-center justify-center text-gray-500">
                  Image failed to load
                </div>
              )}
            />
          </motion.div>
        )}

        <motion.button
          onClick={saveMeta}
          disabled={saving}
          className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 font-medium flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02 }}
        >
          {saving && <Loader className="w-4 h-4 animate-spin" />}
          Save Meta Information
        </motion.button>
      </div>

      <motion.div
        className="bg-white rounded-lg border border-gray-200 p-6 space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-lg font-semibold text-gray-900">Generated HTML</h2>

        <p className="text-sm text-gray-600">
          Copy these meta tags to your HTML head section:
        </p>

        <div className="relative">
          <pre className="bg-gray-50 border border-gray-300 rounded-lg p-4 text-xs overflow-x-auto text-gray-700">
            {generateMetaTags()}
          </pre>

          <motion.button
            onClick={() => copyToClipboard(generateMetaTags())}
            className="absolute top-2 right-2 p-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
            whileHover={{ scale: 1.1 }}
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4 text-gray-600" />
            )}
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-sm font-semibold text-blue-900">Preview</h3>

        <div className="bg-white rounded border border-blue-200 p-4 text-sm space-y-2">
          <p className="font-semibold text-blue-600">{meta.title || 'Your Page Title'}</p>
          <p className="text-gray-600 text-xs">
            {meta.description || 'Your page description appears here'}
          </p>
        </div>

        <p className="text-xs text-blue-700">
          This is how your portfolio appears in social media sharing.
        </p>
      </motion.div>
    </div>
  );
}
