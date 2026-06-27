import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const { name, email, subject, message } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
  }

  const supabase = createClient();
  const { error } = await supabase
    .from('contact_messages')
    .insert({ name, email, subject: subject ?? '', message });

  if (error) {
    return NextResponse.json({ error: 'Failed to save message' }, { status: 500 });
  }

  // Also log the page view for analytics
  await supabase.from('page_views').insert({ path: '/contact', referrer: req.headers.get('referer') ?? '' });

  return NextResponse.json({ success: true });
}
