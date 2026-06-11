'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useScrollSection } from '@/hooks/useScrollSection';

interface SectionWrapperProps {
  id: string;
  className?: string;
  children: ReactNode;
}

export default function SectionWrapper({ id, className = '', children }: SectionWrapperProps) {
  const { ref, isVisible } = useScrollSection();

  return (
    <section
      ref={ref}
      id={id}
      data-label={id}
      className={`snap-section relative min-h-screen flex flex-col ${className}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full h-full flex flex-col flex-1"
      >
        {children}
      </motion.div>
    </section>
  );
}
