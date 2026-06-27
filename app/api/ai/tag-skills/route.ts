import { NextRequest, NextResponse } from 'next/server';
import { getFlashModel } from '@/lib/gemini/client';
import { PROMPTS } from '@/lib/gemini/prompts';

export async function POST(req: NextRequest) {
  const { skills } = await req.json();
  if (!Array.isArray(skills) || skills.length === 0) {
    return NextResponse.json({ error: 'skills array is required' }, { status: 400 });
  }

  try {
    const model = getFlashModel();
    const result = await model.generateContent(PROMPTS.tagSkills(skills));
    const text = result.response.text().trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return NextResponse.json({ error: 'Invalid AI response' }, { status: 500 });
    const tagged = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ tagged });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'AI error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
