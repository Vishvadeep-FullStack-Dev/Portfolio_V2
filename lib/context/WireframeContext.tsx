'use client';

import { createContext, useContext, useState, useCallback } from 'react';

interface WireframeContextValue {
  enabled: boolean;
  toggle: () => void;
}

const WireframeContext = createContext<WireframeContextValue | null>(null);

export function WireframeProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(false);

  const toggle = useCallback(() => {
    setEnabled(prev => {
      const next = !prev;
      if (next) {
        document.body.classList.add('wireframe-mode');
      } else {
        document.body.classList.remove('wireframe-mode');
      }
      return next;
    });
  }, []);

  return (
    <WireframeContext.Provider value={{ enabled, toggle }}>
      {children}
    </WireframeContext.Provider>
  );
}

export function useWireframe() {
  const ctx = useContext(WireframeContext);
  if (!ctx) throw new Error('useWireframe must be used within WireframeProvider');
  return ctx;
}
