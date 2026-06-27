import { NextRequest, NextResponse } from 'next/server';
import { getFlashModel } from '@/lib/gemini/client';
import { PROMPTS } from '@/lib/gemini/prompts';

export async function POST(req: NextRequest) {
  const { bio, tone } = await req.json();
  if (!bio) return NextResponse.json({ error: 'bio is required' }, { status: 400 });

  try {
    const model = getFlashModel();
    const result = await model.generateContent(PROMPTS.rewriteBio(bio, tone));
    const text = result.response.text();
    return NextResponse.json({ rewritten: text });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'AI error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
