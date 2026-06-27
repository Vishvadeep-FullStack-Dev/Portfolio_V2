'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useScrollSection } from '@/hooks/useScrollSection';

export default function SkillsSection({ skills }: { skills: any[] }) {
  const { ref, isVisible } = useScrollSection();

  const groupedSkills = useMemo(() => {
    const groups: { [key: string]: any[] } = {};
    skills.forEach((skill) => {
      const category = skill.category || 'Other';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(skill);
    });
    return groups;
  }, [skills]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const categoryVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  const skillVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
    },
  };

  return (
    <div id="skills" ref={ref} className="py-20 px-4 max-w-6xl mx-auto">
      <motion.div
        initial="hidden"
        animate={isVisible ? 'visible' : 'hidden'}
        variants={containerVariants}
      >
        <div className="mb-12">
          <p className="text-sm font-semibold text-primary uppercase tracking-wide mb-2">
            Skills
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Technical Expertise
          </h2>
        </div>

        <div className="space-y-10">
          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <motion.div key={category} variants={categoryVariants}>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                {category}
              </h3>
              <motion.div
                className="flex flex-wrap gap-3"
                variants={containerVariants}
              >
                {categorySkills.map((skill, index) => (
                  <motion.div
                    key={index}
                    variants={skillVariants}
                    className="flex flex-col"
                  >
                    <div className="px-4 py-2 rounded-full bg-accent/10 border border-border/50 hover:border-primary/50 transition-colors">
                      <p className="text-sm font-medium text-foreground">
                        {skill.name}
                      </p>
                    </div>
                    {skill.level && (
                      <div className="mt-2 w-full h-1 bg-accent/20 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                          initial={{ width: 0 }}
                          animate={isVisible ? { width: `${skill.level}%` } : { width: 0 }}
                          transition={{ duration: 0.8, delay: index * 0.05 }}
                        />
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
