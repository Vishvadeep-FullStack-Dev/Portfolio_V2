import { NextResponse } from 'next/server';

export async function GET() {
  const manifest = {
    name: 'Portfolio — Vishvadeep',
    short_name: 'Portfolio',
    description: 'Full-stack engineer portfolio & admin CMS',
    start_url: '/',
    display: 'standalone',
    background_color: '#0d1117',
    theme_color: '#3B82F6',
    orientation: 'portrait-primary',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
    ],
    shortcuts: [
      { name: 'Admin', short_name: 'Admin', description: 'Open admin panel', url: '/admin' },
    ],
  };

  return NextResponse.json(manifest, {
    headers: { 'Content-Type': 'application/manifest+json' },
  });
}
