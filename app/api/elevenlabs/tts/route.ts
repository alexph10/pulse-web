import { NextRequest, NextResponse } from 'next/server';
import { textToSpeech } from '@/lib/elevenlabs';
import { validateUserId, unauthorizedResponse } from '@/lib/auth';
import { sanitizeString, VALIDATION_LIMITS } from '@/lib/validation';
import { checkRateLimit, RATE_LIMITS, getRateLimitHeaders } from '@/lib/rateLimit';

/**
 * API Route: Text-to-Speech with ElevenLabs
 * POST /api/elevenlabs/tts
 * Body: { text: string, voiceId?: string }
 */
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
    const { text, voiceId } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    // Sanitize and validate text
    const sanitizedText = sanitizeString(text, 5000); // Limit TTS text length
    if (sanitizedText.length === 0) {
      return NextResponse.json(
        { error: 'Text cannot be empty' },
        { status: 400 }
      );
    }

    if (!process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY) {
      return NextResponse.json(
        { error: 'ElevenLabs API key not configured' },
        { status: 500 }
      );
    }

    const audio = await textToSpeech(sanitizedText, sanitizeString(voiceId));

    // Convert audio stream to buffer
    const chunks: Uint8Array[] = [];
    for await (const chunk of audio) {
      chunks.push(chunk);
    }
    const audioBuffer = Buffer.concat(chunks);

    const headers = new Headers({
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioBuffer.length.toString(),
      ...getRateLimitHeaders(rateLimit.remaining, rateLimit.resetTime),
    });

    return new NextResponse(audioBuffer, { headers });
  } catch (error) {
    console.error('ElevenLabs API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate speech' },
      { status: 500 }
    );
  }
}
