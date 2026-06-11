import { NextRequest } from 'next/server';
import { getFlashModel } from '@/lib/gemini/client';
import { PROMPTS } from '@/lib/gemini/prompts';

export async function POST(req: NextRequest) {
  const { message, context } = await req.json();
  if (!message) {
    return new Response(JSON.stringify({ error: 'message is required' }), { status: 400 });
  }

  const model = getFlashModel();
  const chat = model.startChat({
    history: [
      {
        role: 'user',
        parts: [{ text: PROMPTS.visitorChat(context ?? '') }],
      },
      {
        role: 'model',
        parts: [{ text: "Hi! I'm an AI assistant for this portfolio. Ask me anything about the work, skills, or background here." }],
      },
    ],
  });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const result = await chat.sendMessageStream(message);
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) controller.enqueue(encoder.encode(text));
        }
        controller.close();
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'stream error';
        controller.enqueue(encoder.encode(`[ERROR] ${msg}`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
