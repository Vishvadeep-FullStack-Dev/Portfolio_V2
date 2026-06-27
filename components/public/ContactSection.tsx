'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Linkedin, Twitter, Github } from 'lucide-react';
import { toast } from 'sonner';
import { useScrollSection } from '@/hooks/useScrollSection';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  subject: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactSection({ profile }: { profile: any }) {
  const { ref, isVisible } = useScrollSection();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success('Message sent successfully!');
        reset();
      } else {
        toast.error('Failed to send message. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
    <div id="contact" ref={ref} className="py-20 px-4 max-w-6xl mx-auto">
      <motion.div
        initial="hidden"
        animate={isVisible ? 'visible' : 'hidden'}
        variants={containerVariants}
      >
        <div className="mb-12">
          <p className="text-sm font-semibold text-primary uppercase tracking-wide mb-2">
            Get In Touch
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Let's Work Together
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div variants={itemVariants} className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Contact Information
              </h3>
              <div className="space-y-4">
                <a
                  href={`mailto:${profile?.email || 'hello@vishvadeep.dev'}`}
                  className="flex items-center gap-3 text-foreground/70 hover:text-foreground transition-colors"
                >
                  <Mail size={20} className="text-primary" />
                  <span>{profile?.email || 'hello@vishvadeep.dev'}</span>
                </a>

                <div className="flex items-center gap-3 text-foreground/70">
                  <span className="text-primary font-medium">Location</span>
                  <span>{profile?.location || 'India'}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Follow Me
              </h3>
              <div className="flex gap-4">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-lg bg-accent/10 hover:bg-accent/20 border border-border/50 hover:border-primary/50 transition-all"
                >
                  <Github size={20} className="text-foreground" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-lg bg-accent/10 hover:bg-accent/20 border border-border/50 hover:border-primary/50 transition-all"
                >
                  <Linkedin size={20} className="text-foreground" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-lg bg-accent/10 hover:bg-accent/20 border border-border/50 hover:border-primary/50 transition-all"
                >
                  <Twitter size={20} className="text-foreground" />
                </a>
              </div>
            </div>
          </motion.div>

          <motion.form
            variants={itemVariants}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Name
              </label>
              <input
                {...register('name')}
                type="text"
                className="w-full px-4 py-2 rounded-lg bg-accent/5 border border-border/50 text-foreground placeholder-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                placeholder="Your name"
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <input
                {...register('email')}
                type="email"
                className="w-full px-4 py-2 rounded-lg bg-accent/5 border border-border/50 text-foreground placeholder-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Subject (Optional)
              </label>
              <input
                {...register('subject')}
                type="text"
                className="w-full px-4 py-2 rounded-lg bg-accent/5 border border-border/50 text-foreground placeholder-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                placeholder="Message subject"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Message
              </label>
              <textarea
                {...register('message')}
                rows={4}
                className="w-full px-4 py-2 rounded-lg bg-accent/5 border border-border/50 text-foreground placeholder-foreground/40 focus:outline-none focus:border-primary/50 transition-colors resize-none"
                placeholder="Your message..."
              />
              {errors.message && (
                <p className="text-sm text-red-500 mt-1">{errors.message.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </motion.form>
        </div>
      </motion.div>
    </div>
  );
}
