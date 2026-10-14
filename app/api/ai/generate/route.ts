import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt, type } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not configured on the server.' },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt || 'Gere uma minuta padrão de direitos conexos musicais.',
    });

    return NextResponse.json({ text: response.text });
  } catch (error: any) {
    console.error('Gemini generation error:', error);
    return NextResponse.json(
      { error: error?.message || 'Falha ao processar solicitação de IA' },
      { status: 500 }
    );
  }
}
