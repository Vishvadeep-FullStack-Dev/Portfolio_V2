'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface Section {
  id: string;
  label: string;
  icon: LucideIcon;
  component: React.ComponentType;
}

interface SplitWorkspaceProps {
  sections: Section[];
  defaultSection?: string;
}

export default function SplitWorkspace({
  sections,
  defaultSection,
}: SplitWorkspaceProps) {
  const [activeSection, setActiveSection] = useState(
    defaultSection || sections[0]?.id || ''
  );

  const activeSectionData = sections.find((s) => s.id === activeSection);
  const ActiveComponent = activeSectionData?.component;

  return (
    <div className="flex h-full bg-gray-50">
      <aside className="w-60 bg-white border-r border-gray-200 overflow-y-auto">
        <nav className="p-4 space-y-2">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;

            return (
              <motion.button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-500'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                whileHover={{ x: 4 }}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">{section.label}</span>
              </motion.button>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto p-6">
        {ActiveComponent ? (
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ActiveComponent />
          </motion.div>
        ) : (
          <div className="text-center text-gray-500">No section selected</div>
        )}
      </main>
    </div>
  );
}
