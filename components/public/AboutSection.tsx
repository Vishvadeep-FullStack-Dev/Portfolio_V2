'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useScrollSection } from '@/hooks/useScrollSection';

export default function AboutSection({ profile }: { profile: any }) {
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <div id="about" ref={ref} className="py-20 px-4 max-w-6xl mx-auto">
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? 'visible' : 'hidden'}
      >
        <motion.div variants={itemVariants} className="relative">
          <div className="relative overflow-hidden rounded-lg">
            <img
              src={profile?.avatar_url || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg'}
              alt="Vishvadeep"
              className="w-full aspect-square object-cover rounded-lg"
            />
            <div className="absolute inset-0 rounded-lg border-2 border-primary/30 pointer-events-none" />
          </div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-accent/10 rounded-lg -z-10" />
        </motion.div>

        <motion.div variants={containerVariants} className="space-y-6">
          <motion.div variants={itemVariants}>
            <p className="text-sm font-semibold text-primary uppercase tracking-wide">About Me</p>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mt-2">
              Who I Am
            </h2>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-4">
            {profile?.bio?.split('\n').map((paragraph: string, i: number) => (
              <p key={i} className="text-lg text-foreground/70 leading-relaxed">
                {paragraph}
              </p>
            )) ?? <p className="text-lg text-foreground/70 leading-relaxed">Bio loading...</p>}
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4 pt-4">
            <div className="p-4 rounded-lg bg-accent/5 border border-border/50">
              <p className="text-xs text-foreground/60 uppercase tracking-wide">Location</p>
              <p className="text-sm font-semibold text-foreground mt-1">
                {profile?.location || 'India'}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-accent/5 border border-border/50">
              <p className="text-xs text-foreground/60 uppercase tracking-wide">Email</p>
              <p className="text-sm font-semibold text-foreground mt-1 truncate">
                {profile?.email || 'hello@vishvadeep.dev'}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-accent/5 border border-border/50">
              <p className="text-xs text-foreground/60 uppercase tracking-wide">Status</p>
              <p className="text-sm font-semibold text-foreground mt-1">{profile?.available ? 'Available' : 'Not Available'}</p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
