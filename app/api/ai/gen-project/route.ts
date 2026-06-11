import { NextRequest, NextResponse } from 'next/server';
import { getFlashModel } from '@/lib/gemini/client';
import { PROMPTS } from '@/lib/gemini/prompts';

export async function POST(req: NextRequest) {
  const { title, techStack, brief } = await req.json();
  if (!title) return NextResponse.json({ error: 'title is required' }, { status: 400 });

  try {
    const model = getFlashModel();
    const result = await model.generateContent(
      PROMPTS.genProjectDescription(title, techStack ?? [], brief ?? '')
    );
    return NextResponse.json({ description: result.response.text() });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'AI error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
