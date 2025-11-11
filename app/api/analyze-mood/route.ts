import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'No text provided' },
        { status: 400 }
      );
    }

    // Use GPT-4 to analyze mood and sentiment
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a compassionate mental wellness assistant analyzing journal entries. Analyze the emotional content and return ONLY a valid JSON object (no markdown, no explanation) with this exact structure:

{
  "primaryMood": "string (one of: joyful, content, calm, neutral, anxious, sad, frustrated, angry, overwhelmed, excited)",
  "moodScore": number (0-10, where 0 is very negative, 5 is neutral, 10 is very positive),
  "emotions": ["array of detected emotions as strings"],
  "sentiment": "string (positive, negative, neutral, or mixed)",
  "keywords": ["array of significant emotional keywords from the text"],
  "insight": "string (one brief, empathetic sentence about what they're experiencing)",
  "followUpQuestion": "string (one thoughtful question to help them reflect deeper)"
}`
        },
        {
          role: 'user',
          content: text
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const responseText = completion.choices[0].message.content?.trim() || '';
    
    // Parse the JSON response
    const analysis = JSON.parse(responseText);

    return NextResponse.json({
      ...analysis,
      success: true,
    });
  } catch (error: any) {
    console.error('Mood analysis error:', error);
    return NextResponse.json(
      { error: error.message || 'Mood analysis failed' },
      { status: 500 }
    );
  }
}
