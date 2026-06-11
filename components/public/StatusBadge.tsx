import React from 'react';

interface StatusBadgeProps {
  available: boolean;
}

export default function StatusBadge({ available }: StatusBadgeProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div
          className={`
            h-3 w-3 rounded-full
            ${available ? 'bg-emerald-500' : 'bg-gray-400'}
          `}
        />
        {available && (
          <div className="absolute inset-0 h-3 w-3 rounded-full bg-emerald-500 animate-pulse-ring" />
        )}
      </div>
      <span className="text-sm font-medium text-foreground">
        {available ? 'Available for work' : 'Not available'}
      </span>
    </div>
  );
}
