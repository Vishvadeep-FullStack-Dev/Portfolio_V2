'use client';

import { createContext, useContext, useState, useCallback } from 'react';

interface CommandContextValue {
  open: boolean;
  openPalette: () => void;
  closePalette: () => void;
  togglePalette: () => void;
}

const CommandContext = createContext<CommandContextValue | null>(null);

export function CommandProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const openPalette  = useCallback(() => setOpen(true), []);
  const closePalette = useCallback(() => setOpen(false), []);
  const togglePalette = useCallback(() => setOpen(v => !v), []);

  return (
    <CommandContext.Provider value={{ open, openPalette, closePalette, togglePalette }}>
      {children}
    </CommandContext.Provider>
  );
}

export function useCommand() {
  const ctx = useContext(CommandContext);
  if (!ctx) throw new Error('useCommand must be used within CommandProvider');
  return ctx;
}
