import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { docType, jurisdiction, partyA, partyB, details } = await req.json();

    if (!docType || !partyA || !partyB || !details) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const prompt = `
      You are a professional legal document generator. Generate a formal, legally structured, and complete document based on the following details:

      Document Type: ${docType}
      Jurisdiction: ${jurisdiction || 'General / Not Specified'}
      Party A (First Party): ${partyA}
      Party B (Second Party): ${partyB}
      Key Details & Specific Terms: ${details}

      Requirements:
      1. Use formal legal title, clauses, and sections.
      2. Include standard legal disclaimers and signature blocks for both parties.
      3. Maintain clean, professional Markdown formatting.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });

    const output = response.text || 'Failed to generate content.';

    return NextResponse.json({ result: output });
  } catch (error: any) {
    console.error('Generation Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}