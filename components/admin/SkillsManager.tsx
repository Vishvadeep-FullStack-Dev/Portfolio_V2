'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Loader, GripVertical } from 'lucide-react';
import { toast } from 'sonner';

interface Skill {
  id?: string;
  name: string;
  category: string;
  level: number;
  sort_order: number;
}

export default function SkillsManager() {
  const supabase = createClient();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [autoTagging, setAutoTagging] = useState(false);
  const [newSkill, setNewSkill] = useState<Skill>({
    name: '',
    category: '',
    level: 50,
    sort_order: 0,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;

      setSkills(data || []);

      const uniqueCategories = Array.from(
        new Set((data || []).map((s: Skill) => s.category))
      ) as string[];
      setCategories(uniqueCategories.filter((c) => c));
    } catch (error) {
      toast.error('Failed to load skills');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const saveSkill = async () => {
    if (!newSkill.name || !newSkill.category) {
      toast.error('Name and category are required');
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        const { error } = await supabase
          .from('skills')
          .update(newSkill)
          .eq('id', editingId);

        if (error) throw error;
      } else {
        const { error } = await supabase.from('skills').insert([newSkill]);

        if (error) throw error;
      }

      loadSkills();
      resetForm();
      toast.success(editingId ? 'Skill updated' : 'Skill added');
    } catch (error) {
      toast.error('Failed to save skill');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const deleteSkill = async (id: string) => {
    try {
      const { error } = await supabase.from('skills').delete().eq('id', id);

      if (error) throw error;

      loadSkills();
      toast.success('Skill deleted');
    } catch (error) {
      toast.error('Failed to delete skill');
      console.error(error);
    }
  };

  const resetForm = () => {
    setNewSkill({
      name: '',
      category: '',
      level: 50,
      sort_order: 0,
    });
    setEditingId(null);
    setNewCategory('');
  };

  const autoTagSkills = async () => {
    if (skills.length === 0) {
      toast.error('No skills to tag');
      return;
    }

    setAutoTagging(true);
    try {
      const skillNames = skills.map((s) => s.name);
      const response = await fetch('/api/ai/tag-skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skills: skillNames }),
      });

      if (!response.ok) throw new Error('Failed to tag skills');

      const data = await response.json();

      const tagged = data.tagged ?? {};
      const skillToCategory: Record<string, string> = {};
      for (const [category, skillNames] of Object.entries(tagged)) {
        for (const name of skillNames as string[]) {
          skillToCategory[name] = category;
        }
      }

      for (const skill of skills) {
        const newCategory = skillToCategory[skill.name];
        if (newCategory) {
          await supabase
            .from('skills')
            .update({ category: newCategory })
            .eq('id', skill.id);
        }
      }

      loadSkills();
      toast.success('Skills auto-tagged');
    } catch (error) {
      toast.error('Failed to auto-tag skills');
      console.error(error);
    } finally {
      setAutoTagging(false);
    }
  };

  const groupedSkills = skills.reduce(
    (acc, skill) => {
      const category = skill.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(skill);
      return acc;
    },
    {} as Record<string, Skill[]>
  );

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
        <h1 className="text-2xl font-bold text-gray-900">Skills</h1>
        <motion.button
          onClick={autoTagSkills}
          disabled={autoTagging || skills.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50"
          whileHover={{ scale: 1.05 }}
        >
          {autoTagging && <Loader className="w-4 h-4 animate-spin" />}
          AI Auto-tag
        </motion.button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">
          {editingId ? 'Edit Skill' : 'Add Skill'}
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skill Name
            </label>
            <input
              type="text"
              value={newSkill.name}
              onChange={(e) =>
                setNewSkill((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., React"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <div className="flex gap-2">
              <select
                value={newSkill.category}
                onChange={(e) =>
                  setNewSkill((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select or create</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {newSkill.category === '' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Category
            </label>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => {
                setNewCategory(e.target.value);
                setNewSkill((prev) => ({
                  ...prev,
                  category: e.target.value,
                }));
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter new category"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Proficiency Level: {newSkill.level}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={newSkill.level}
            onChange={(e) =>
              setNewSkill((prev) => ({
                ...prev,
                level: parseInt(e.target.value),
              }))
            }
            className="w-full"
          />
        </div>

        <div className="flex gap-2">
          <motion.button
            onClick={saveSkill}
            disabled={saving}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 font-medium"
            whileHover={{ scale: 1.02 }}
          >
            {editingId ? 'Update Skill' : 'Add Skill'}
          </motion.button>
          {editingId && (
            <motion.button
              onClick={resetForm}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
              whileHover={{ scale: 1.02 }}
            >
              Cancel
            </motion.button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedSkills).map(([category, categorySkills]) => (
          <motion.div
            key={category}
            className="bg-white rounded-lg border border-gray-200 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {category}
            </h3>

            <div className="space-y-2">
              {categorySkills.map((skill) => (
                <motion.div
                  key={skill.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{skill.name}</p>
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                        <motion.div
                          className="h-full bg-blue-500"
                          style={{ width: `${skill.level}%` }}
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600">
                      {skill.level}%
                    </span>
                    <motion.button
                      onClick={() => {
                        setNewSkill(skill);
                        setEditingId(skill.id || null);
                      }}
                      className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                      whileHover={{ scale: 1.05 }}
                    >
                      Edit
                    </motion.button>
                    <motion.button
                      onClick={() => deleteSkill(skill.id!)}
                      className="p-1 hover:bg-red-100 rounded transition-colors"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
