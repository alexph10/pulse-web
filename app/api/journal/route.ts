import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { 
      userId, 
      transcript, 
      audioUrl, 
      mood, 
      moodScore, 
      emotions, 
      sentiment,
      keywords,
      insight,
      followUpQuestion 
    } = await request.json();

    if (!userId || !transcript) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Insert journal entry into database
    const { data, error } = await supabase
      .from('journal_entries')
      .insert([
        {
          user_id: userId,
          transcript: transcript,
          audio_url: audioUrl || null,
          primary_mood: mood,
          mood_score: moodScore,
          emotions: emotions || [],
          sentiment: sentiment,
          keywords: keywords || [],
          insight: insight,
          follow_up_question: followUpQuestion,
          created_at: new Date().toISOString(),
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      entry: data,
    });
  } catch (error: any) {
    console.error('Save journal error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save journal entry' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    // Fetch journal entries for user
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      entries: data || [],
    });
  } catch (error: any) {
    console.error('Fetch journals error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch journal entries' },
      { status: 500 }
    );
  }
}
