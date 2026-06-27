'use client';

import { Grid3x3 } from 'lucide-react';
import { useWireframe } from '@/hooks/useWireframe';

export default function WireframeOverlay() {
  const { enabled, toggle } = useWireframe();

  return (
    <button
      onClick={toggle}
      className={`fixed bottom-6 left-6 z-50 w-12 h-12 flex items-center justify-center rounded-full transition-all duration-200 ${
        enabled
          ? 'bg-blue-500 border-2 border-blue-600 text-white'
          : 'bg-gray-800 border-2 border-gray-600 text-gray-400'
      } hover:scale-110 group`}
      aria-label="Toggle wireframe mode"
    >
      <div className="flex flex-col items-center justify-center">
        <Grid3x3 size={20} />
        <div className="absolute -bottom-8 text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          {enabled ? 'Grid: ON' : 'Grid: OFF'}
        </div>
      </div>
      {enabled && (
        <div className="absolute top-1 right-1 w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
      )}
    </button>
  );
}
