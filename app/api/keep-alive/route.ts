import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = createClient();
  const { data, error } = await supabase.from('profile').select('id').limit(1);
  return NextResponse.json({ ok: !error, ts: new Date().toISOString(), rows: data?.length ?? 0 });
}
