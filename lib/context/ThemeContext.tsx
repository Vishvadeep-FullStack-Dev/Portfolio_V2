'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';

export interface ThemeConfig {
  brandPrimary: string;
  brandAccent: string;
  preset: string;
}

const PRESETS: Record<string, ThemeConfig> = {
  ocean:    { brandPrimary: '#3B82F6', brandAccent: '#06B6D4', preset: 'ocean' },
  forest:   { brandPrimary: '#10B981', brandAccent: '#84CC16', preset: 'forest' },
  sunset:   { brandPrimary: '#F59E0B', brandAccent: '#EF4444', preset: 'sunset' },
  midnight: { brandPrimary: '#8B5CF6', brandAccent: '#6366F1', preset: 'midnight' },
  rose:     { brandPrimary: '#F43F5E', brandAccent: '#EC4899', preset: 'rose' },
  slate:    { brandPrimary: '#64748B', brandAccent: '#94A3B8', preset: 'slate' },
};

interface ThemeContextValue {
  theme: ThemeConfig;
  presets: typeof PRESETS;
  setTheme: (t: ThemeConfig) => void;
  applyPreset: (name: string) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function hexToHsl(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

function applyThemeToCss(theme: ThemeConfig) {
  const root = document.documentElement;
  const primaryHsl = hexToHsl(theme.brandPrimary);
  const accentHsl  = hexToHsl(theme.brandAccent);
  root.style.setProperty('--primary', primaryHsl);
  root.style.setProperty('--ring', primaryHsl);
  root.style.setProperty('--brand-500', primaryHsl);
  root.style.setProperty('--accent', accentHsl);
}

export function ThemeProvider({ children, initial }: { children: React.ReactNode; initial?: ThemeConfig }) {
  const [theme, setThemeState] = useState<ThemeConfig>(initial ?? PRESETS.ocean);

  useEffect(() => {
    applyThemeToCss(theme);
  }, [theme]);

  const setTheme = useCallback((t: ThemeConfig) => {
    setThemeState(t);
    applyThemeToCss(t);
  }, []);

  const applyPreset = useCallback((name: string) => {
    const preset = PRESETS[name];
    if (preset) setTheme(preset);
  }, [setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, presets: PRESETS, setTheme, applyPreset }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
