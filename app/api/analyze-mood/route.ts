import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { validateUserId, unauthorizedResponse } from '@/lib/auth';
import { sanitizeString, VALIDATION_LIMITS } from '@/lib/validation';
import { checkRateLimit, RATE_LIMITS, getRateLimitHeaders } from '@/lib/rateLimit';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const auth = await validateUserId(request, null);
    if (!auth) {
      return unauthorizedResponse('Authentication required');
    }

    // Rate limiting for AI endpoints
    const rateLimit = checkRateLimit(auth.userId, RATE_LIMITS.AI_ENDPOINTS);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { 
          status: 429,
          headers: getRateLimitHeaders(rateLimit.remaining, rateLimit.resetTime),
        }
      );
    }

    const body = await request.json();
    const { text } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    // Sanitize text
    const sanitizedText = sanitizeString(text, VALIDATION_LIMITS.MAX_TEXT_LENGTH);
    if (sanitizedText.length === 0) {
      return NextResponse.json(
        { error: 'Text cannot be empty' },
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
          content: sanitizedText
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const responseText = completion.choices[0]?.message?.content?.trim() || '';
    
    if (!responseText) {
      return NextResponse.json(
        { error: 'No response from AI service' },
        { status: 500 }
      );
    }

    // Parse the JSON response with error handling
    let analysis;
    try {
      // Try to extract JSON if wrapped in markdown
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        analysis = JSON.parse(responseText);
      }
    } catch (parseError) {
      console.error('Failed to parse mood analysis response:', parseError);
      console.error('Response text:', responseText.substring(0, 500)); // Log first 500 chars
      return NextResponse.json(
        { error: 'Failed to parse mood analysis. Please try again.' },
        { status: 500 }
      );
    }

    // Validate required fields
    if (!analysis.primaryMood || typeof analysis.moodScore !== 'number') {
      console.error('Invalid analysis structure:', analysis);
      return NextResponse.json(
        { error: 'Invalid analysis response format' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        ...analysis,
        success: true,
      },
      {
        headers: getRateLimitHeaders(rateLimit.remaining, rateLimit.resetTime),
      }
    );
  } catch (error: any) {
    console.error('Mood analysis error:', error);
    return NextResponse.json(
      { error: 'Mood analysis failed' },
      { status: 500 }
    );
  }
}
