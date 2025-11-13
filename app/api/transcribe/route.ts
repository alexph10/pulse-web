import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { validateUserId, unauthorizedResponse } from '@/lib/auth';
import { validateFileSize, isValidAudioFile, VALIDATION_LIMITS } from '@/lib/validation';
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

    // Rate limiting for transcription
    const rateLimit = checkRateLimit(auth.userId, RATE_LIMITS.TRANSCRIBE);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { 
          status: 429,
          headers: getRateLimitHeaders(rateLimit.remaining, rateLimit.resetTime),
        }
      );
    }

    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Validate file size
    if (!validateFileSize(audioFile.size, VALIDATION_LIMITS.MAX_AUDIO_SIZE_BYTES)) {
      return NextResponse.json(
        { error: `Audio file too large. Maximum size is ${VALIDATION_LIMITS.MAX_AUDIO_SIZE_MB}MB` },
        { status: 400 }
      );
    }

    // Validate file type
    if (!isValidAudioFile(audioFile)) {
      return NextResponse.json(
        { error: 'Invalid audio file type' },
        { status: 400 }
      );
    }

    // Convert File to format OpenAI expects
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'en', // Change to 'auto' for multi-language support
      response_format: 'json',
    });

    return NextResponse.json(
      {
        text: transcription.text || '',
        success: true,
      },
      {
        headers: getRateLimitHeaders(rateLimit.remaining, rateLimit.resetTime),
      }
    );
  } catch (error: any) {
    console.error('Transcription error:', error);
    return NextResponse.json(
      { error: 'Transcription failed' },
      { status: 500 }
    );
  }
}
