import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY ?? '';

let _client: GoogleGenerativeAI | null = null;

export function getGeminiClient(): GoogleGenerativeAI {
  if (!_client) {
    if (!apiKey) throw new Error('GEMINI_API_KEY is not configured');
    _client = new GoogleGenerativeAI(apiKey);
  }
  return _client;
}

export function getFlashModel() {
  return getGeminiClient().getGenerativeModel({ model: 'gemini-1.5-flash' });
}

export function getProModel() {
  return getGeminiClient().getGenerativeModel({ model: 'gemini-1.5-pro' });
}
