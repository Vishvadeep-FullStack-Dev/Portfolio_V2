'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Calendar } from 'lucide-react';
import { useScrollSection } from '@/hooks/useScrollSection';

export default function ExperienceSection({ experience }: { experience: any[] }) {
  const { ref, isVisible } = useScrollSection();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
    },
  };

  return (
    <div id="experience" ref={ref} className="py-20 px-4 max-w-6xl mx-auto">
      <motion.div
        initial="hidden"
        animate={isVisible ? 'visible' : 'hidden'}
        variants={containerVariants}
      >
        <div className="mb-12">
          <p className="text-sm font-semibold text-primary uppercase tracking-wide mb-2">
            Experience
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Professional Journey
          </h2>
        </div>

        <div className="relative">
          <div className="absolute left-0 md:left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-transparent" />

          <div className="space-y-8">
            {experience.map((exp, index) => (
              <motion.div
                key={exp.id}
                variants={itemVariants}
                className="relative pl-8 md:pl-24"
              >
                <div className="absolute left-0 md:left-4 top-0 w-4 h-4 rounded-full bg-primary border-4 border-background" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                  <div className="md:col-span-1">
                    <div className="space-y-3 md:sticky md:top-24">
                      <div className="flex items-center gap-2 text-foreground">
                        <Briefcase size={18} />
                        <span className="font-semibold text-lg">{exp.role}</span>
                      </div>
                      <p className="text-foreground/60 font-medium">{exp.company}</p>

                      <div className="flex items-center gap-2 text-sm text-foreground/50">
                        <Calendar size={16} />
                        <span>{exp.start_date}</span>
                        {exp.end_date && <span> - {exp.end_date}</span>}
                        {!exp.end_date && (
                          <span className="ml-auto bg-emerald-500/10 text-emerald-600 px-2 py-1 rounded text-xs font-medium">
                            Present
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-foreground/50">
                        <MapPin size={16} />
                        <span>{exp.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <p className="text-foreground/70 leading-relaxed mb-4">
                      {exp.description}
                    </p>
                    {exp.highlights && (
                      <ul className="space-y-2">
                        {exp.highlights.map((highlight: string, i: number) => (
                          <li key={i} className="flex gap-2 text-foreground/60 text-sm">
                            <span className="text-primary mt-1">→</span>
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
