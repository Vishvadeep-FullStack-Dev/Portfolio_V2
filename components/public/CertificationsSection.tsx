'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Award, ExternalLink, Calendar } from 'lucide-react';
import { useScrollSection } from '@/hooks/useScrollSection';

export default function CertificationsSection({ certifications }: { certifications: any[] }) {
  const { ref, isVisible } = useScrollSection();

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
  };

  return (
    <div id="certifications" ref={ref} className="py-20 px-4 max-w-6xl mx-auto">
      <motion.div
        initial="hidden"
        animate={isVisible ? 'visible' : 'hidden'}
        variants={containerVariants}
      >
        <div className="mb-12">
          <p className="text-sm font-semibold text-primary uppercase tracking-wide mb-2">
            Credentials
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Certifications & Awards
          </h2>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
        >
          {certifications.map((cert) => (
            <motion.div
              key={cert.id}
              variants={cardVariants}
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-lg bg-accent/5 border border-border/50 hover:border-primary/50 transition-all"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  {cert.badge_url ? (
                    <img
                      src={cert.badge_url}
                      alt={cert.title}
                      className="w-12 h-12 object-contain"
                    />
                  ) : (
                    <Award size={24} className="text-primary" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-lg">
                    {cert.title}
                  </h3>
                  <p className="text-sm text-foreground/60">{cert.issuer}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-foreground/50 mb-4">
                <Calendar size={16} />
                <span>
                  {cert.issue_date && new Date(cert.issue_date).toLocaleDateString()}
                </span>
              </div>

              {cert.description && (
                <p className="text-sm text-foreground/70 mb-4 line-clamp-2">
                  {cert.description}
                </p>
              )}

              {cert.credential_url && (
                <a
                  href={cert.credential_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  View Credential
                  <ExternalLink size={14} />
                </a>
              )}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
