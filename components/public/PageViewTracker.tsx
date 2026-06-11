'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function PageViewTracker() {
  useEffect(() => {
    const sid = sessionStorage.getItem('sid') ?? crypto.randomUUID();
    sessionStorage.setItem('sid', sid);

    createClient().from('page_views').insert({
      path: window.location.pathname,
      referrer: document.referrer,
      ua: navigator.userAgent,
    }).then(() => {});
  }, []);

  return null;
}
