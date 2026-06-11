'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, FolderOpen, Mail, Settings, Grid3x3, Search, ChevronRight, type LucideIcon } from 'lucide-react';
import { useCommand } from '@/lib/context/CommandContext';
import { useWireframe } from '@/hooks/useWireframe';

interface Command {
  id: string;
  label: string;
  icon: LucideIcon;
  action: () => void;
}

export default function CommandPalette() {
  const { open, closePalette, togglePalette } = useCommand();
  const wireframe = useWireframe();
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: Command[] = [
    {
      id: 'home',
      label: 'Go to Home',
      icon: Home,
      action: () => { document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' }); closePalette(); },
    },
    {
      id: 'projects',
      label: 'Go to Projects',
      icon: FolderOpen,
      action: () => { document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }); closePalette(); },
    },
    {
      id: 'contact',
      label: 'Go to Contact',
      icon: Mail,
      action: () => { document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); closePalette(); },
    },
    {
      id: 'admin',
      label: 'Open Admin',
      icon: Settings,
      action: () => { window.location.href = '/admin'; },
    },
    {
      id: 'wireframe',
      label: 'Toggle Wireframe',
      icon: Grid3x3,
      action: () => { wireframe.toggle(); closePalette(); },
    },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        togglePalette();
        setSearch('');
        setSelectedIndex(0);
        return;
      }
      if (!open) return;
      switch (e.key) {
        case 'Escape': closePalette(); break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => prev < filteredCommands.length - 1 ? prev + 1 : 0);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => prev > 0 ? prev - 1 : filteredCommands.length - 1);
          break;
        case 'Enter':
          e.preventDefault();
          filteredCommands[selectedIndex]?.action();
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, closePalette, togglePalette, filteredCommands, selectedIndex]);

  useEffect(() => { if (open && inputRef.current) inputRef.current.focus(); }, [open]);
  useEffect(() => { setSelectedIndex(0); }, [search]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={closePalette}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15 }}
            className="fixed top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md px-4"
          >
            <div className="bg-card rounded-xl shadow-2xl border border-border overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                <Search size={16} className="text-muted-foreground shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search commands..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-sm"
                />
                <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-xs font-mono text-muted-foreground bg-muted rounded border border-border">ESC</kbd>
              </div>
              <div className="max-h-80 overflow-y-auto py-1">
                {filteredCommands.length > 0 ? filteredCommands.map((cmd, index) => {
                  const Icon = cmd.icon;
                  return (
                    <button
                      key={cmd.id}
                      onClick={() => cmd.action()}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full px-4 py-2.5 flex items-center gap-3 text-sm transition-colors ${
                        index === selectedIndex ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon size={16} />
                      <span className="flex-1 text-left font-medium">{cmd.label}</span>
                      <ChevronRight size={14} className={index === selectedIndex ? 'opacity-100' : 'opacity-0'} />
                    </button>
                  );
                }) : (
                  <div className="px-4 py-8 text-center text-sm text-muted-foreground">No commands found</div>
                )}
              </div>
              <div className="px-4 py-2 text-xs text-muted-foreground border-t border-border flex items-center gap-1">
                <kbd className="inline-flex items-center justify-center w-5 h-5 text-xs border border-border rounded font-mono">↑</kbd>
                <kbd className="inline-flex items-center justify-center w-5 h-5 text-xs border border-border rounded font-mono">↓</kbd>
                <span className="ml-1">navigate</span>
                <kbd className="inline-flex items-center justify-center px-1.5 h-5 text-xs border border-border rounded font-mono ml-2">↵</kbd>
                <span className="ml-1">select</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
