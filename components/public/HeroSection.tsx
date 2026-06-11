'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, ChevronDown } from 'lucide-react';
import StatusBadge from './StatusBadge';

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

const letterVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
    },
  }),
};

export default function HeroSection({ profile }: { profile: any }) {
  const handleScroll = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const name = profile?.name?.split(' ')[0] ?? 'Vishvadeep';
  const social = profile?.social ?? {};

  return (
    <section
      id="home"
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden pt-16"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/5" />
        <svg className="absolute inset-0 w-full h-full opacity-5">
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <motion.div
        className="relative z-10 max-w-4xl mx-auto px-4 text-center"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={item} className="mb-8">
          <StatusBadge available={profile?.available ?? true} />
        </motion.div>

        <div className="mb-8">
          <motion.h1 className="text-6xl md:text-8xl font-bold mb-4 text-foreground">
            {name.split('').map((letter: string, i: number) => (
              <motion.span
                key={i}
                custom={i}
                variants={letterVariants}
                initial="hidden"
                animate="visible"
                style={{ display: 'inline-block' }}
              >
                {letter}
              </motion.span>
            ))}
          </motion.h1>
        </div>

        <motion.p
          variants={item}
          className="text-xl md:text-2xl font-light text-foreground/70 mb-4"
        >
          {profile?.tagline ?? 'Full-Stack Engineer & Creative Developer'}
        </motion.p>

        <motion.p variants={item} className="text-lg text-foreground/60 mb-8 max-w-2xl mx-auto">
          {profile?.bio?.slice(0, 80) ?? 'Crafting digital experiences with modern web technologies and a passion for clean code.'}
        </motion.p>

        <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={() => handleScroll('#projects')}
            className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            View Projects
          </button>
          <a
            href={profile?.resume_url ?? '#'}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="px-8 py-3 border border-foreground/20 text-foreground rounded-lg font-semibold hover:bg-foreground/5 transition-colors"
          >
            Download CV
          </a>
        </motion.div>

        <motion.div variants={item} className="flex items-center justify-center gap-6 mb-16">
          <a
            href={social?.github ?? '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:bg-accent/10 rounded-lg transition-colors"
          >
            <Github size={24} className="text-foreground" />
          </a>
          <a
            href={social?.linkedin ?? '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:bg-accent/10 rounded-lg transition-colors"
          >
            <Linkedin size={24} className="text-foreground" />
          </a>
          <a
            href={social?.twitter ?? '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:bg-accent/10 rounded-lg transition-colors"
          >
            <Twitter size={24} className="text-foreground" />
          </a>
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex justify-center pt-8"
        >
          <button
            onClick={() => handleScroll('#about')}
            className="p-2 hover:bg-accent/10 rounded-lg transition-colors"
          >
            <ChevronDown size={28} className="text-foreground/50" />
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}
