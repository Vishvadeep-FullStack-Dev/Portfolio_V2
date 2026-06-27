'use client';

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Filter } from 'lucide-react';
import { useScrollSection } from '@/hooks/useScrollSection';

export default function ProjectsSection({ projects }: { projects: any[] }) {
  const { ref, isVisible } = useScrollSection();
  const [activeTag, setActiveTag] = useState('All');

  const tags = useMemo(() => {
    const allTags = new Set<string>(['All']);
    projects.forEach((project) => {
      if (project.tags && Array.isArray(project.tags)) {
        project.tags.forEach((tag: string) => allTags.add(tag));
      }
    });
    return Array.from(allTags);
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (activeTag === 'All') return projects;
    return projects.filter((project) =>
      project.tags && project.tags.includes(activeTag)
    );
  }, [projects, activeTag]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
    exit: {
      opacity: 0,
      y: -20,
    },
  };

  return (
    <div id="projects" ref={ref} className="py-20 px-4 max-w-6xl mx-auto">
      <motion.div
        initial="hidden"
        animate={isVisible ? 'visible' : 'hidden'}
        variants={containerVariants}
      >
        <div className="mb-12">
          <p className="text-sm font-semibold text-primary uppercase tracking-wide mb-2">
            Portfolio
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
            Featured Projects
          </h2>

          <div className="flex flex-wrap gap-3">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTag === tag
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-accent/10 text-foreground hover:bg-accent/20 border border-border/50'
                }`}
              >
                <span className="flex items-center gap-2">
                  {tag === 'All' && <Filter size={14} />}
                  {tag}
                </span>
              </button>
            ))}
          </div>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                variants={cardVariants}
                layout
                className="group rounded-lg overflow-hidden bg-accent/5 border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg"
              >
                <div className="relative overflow-hidden h-48 bg-accent/10">
                  {project.cover_url && (
                    <img
                      src={project.cover_url}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  {project.featured && (
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                      Featured
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {project.title}
                  </h3>
                  <p className="text-sm text-foreground/60 line-clamp-2 mb-4">
                    {project.description}
                  </p>

                  {project.tags && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.slice(0, 3).map((tech: string) => (
                        <span
                          key={tech}
                          className="px-2 py-1 text-xs bg-accent/10 text-foreground/70 rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-3">
                    {project.demo_url && (
                      <a
                        href={project.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                      >
                        <ExternalLink size={16} />
                        Demo
                      </a>
                    )}
                    {project.repo_url && (
                      <a
                        href={project.repo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                      >
                        <Github size={16} />
                        Code
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}
