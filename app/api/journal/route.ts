import { NextRequest, NextResponse } from 'next/server';
import { validateUserId, createAuthenticatedSupabaseClient, unauthorizedResponse } from '@/lib/auth';
import { sanitizeString, VALIDATION_LIMITS } from '@/lib/validation';
import { checkRateLimit, RATE_LIMITS, getRateLimitHeaders } from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const auth = await validateUserId(request, null);
    if (!auth) {
      return unauthorizedResponse('Authentication required');
    }

    // Rate limiting
    const rateLimit = checkRateLimit(auth.userId, RATE_LIMITS.GENERAL);
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
    const { 
      transcript, 
      audioUrl, 
      mood, 
      moodScore, 
      emotions, 
      sentiment,
      keywords,
      insight,
      followUpQuestion 
    } = body;

    // Validate required fields
    if (!transcript || typeof transcript !== 'string') {
      return NextResponse.json(
        { error: 'Transcript is required' },
        { status: 400 }
      );
    }

    // Sanitize and validate inputs
    const sanitizedTranscript = sanitizeString(transcript, VALIDATION_LIMITS.MAX_TEXT_LENGTH);
    if (sanitizedTranscript.length === 0) {
      return NextResponse.json(
        { error: 'Transcript cannot be empty' },
        { status: 400 }
      );
    }

    // Validate mood score if provided
    if (moodScore !== undefined && (typeof moodScore !== 'number' || moodScore < 0 || moodScore > 10)) {
      return NextResponse.json(
        { error: 'Mood score must be a number between 0 and 10' },
        { status: 400 }
      );
    }

    // Create authenticated Supabase client
    const supabase = await createAuthenticatedSupabaseClient(request);

    // Insert journal entry into database
    const { data, error } = await supabase
      .from('journal_entries')
      .insert([
        {
          user_id: auth.userId,
          transcript: sanitizedTranscript,
          audio_url: sanitizeString(audioUrl) || null,
          primary_mood: sanitizeString(mood) || null,
          mood_score: moodScore ?? null,
          emotions: Array.isArray(emotions) ? emotions.map(e => sanitizeString(e)) : [],
          sentiment: sanitizeString(sentiment) || null,
          keywords: Array.isArray(keywords) ? keywords.map(k => sanitizeString(k)) : [],
          insight: sanitizeString(insight) || null,
          follow_up_question: sanitizeString(followUpQuestion) || null,
          created_at: new Date().toISOString(),
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    return NextResponse.json(
      {
        success: true,
        entry: data,
      },
      {
        headers: getRateLimitHeaders(rateLimit.remaining, rateLimit.resetTime),
      }
    );
  } catch (error: any) {
    console.error('Save journal error:', error);
    return NextResponse.json(
      { error: 'Failed to save journal entry' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const auth = await validateUserId(request, null);
    if (!auth) {
      return unauthorizedResponse('Authentication required');
    }

    // Rate limiting
    const rateLimit = checkRateLimit(auth.userId, RATE_LIMITS.GENERAL);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { 
          status: 429,
          headers: getRateLimitHeaders(rateLimit.remaining, rateLimit.resetTime),
        }
      );
    }

    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? Math.min(Math.max(1, parseInt(limitParam)), 100) : 20; // Clamp between 1 and 100

    // Create authenticated Supabase client
    const supabase = await createAuthenticatedSupabaseClient(request);

    // Fetch journal entries for authenticated user only
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', auth.userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    return NextResponse.json(
      {
        success: true,
        entries: data || [],
      },
      {
        headers: getRateLimitHeaders(rateLimit.remaining, rateLimit.resetTime),
      }
    );
  } catch (error: any) {
    console.error('Fetch journals error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch journal entries' },
      { status: 500 }
    );
  }
}
