import { NextRequest, NextResponse } from 'next/server';
import { createAuthenticatedSupabaseClient, validateUserId } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const auth = await validateUserId(request, null);
    if (!auth) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'startDate and endDate are required' },
        { status: 400 }
      );
    }

    // Create authenticated Supabase client
    const supabase = await createAuthenticatedSupabaseClient(request);

    // Fetch journal entries
    const { data: journalEntries, error: journalError } = await supabase
      .from('journal_entries')
      .select('created_at')
      .eq('user_id', auth.userId)
      .gte('created_at', startDate)
      .lte('created_at', endDate);

    if (journalError) {
      console.error('Journal fetch error:', journalError);
      throw journalError;
    }

    // Fetch completed goals
    const { data: completedGoals, error: goalsError } = await supabase
      .from('goals')
      .select('completed_at')
      .eq('user_id', auth.userId)
      .eq('status', 'completed')
      .gte('completed_at', startDate)
      .lte('completed_at', endDate)
      .not('completed_at', 'is', null);

    if (goalsError) {
      console.error('Goals fetch error:', goalsError);
      throw goalsError;
    }

    // Aggregate data by date
    const activityMap: Record<string, { journalCount: number; goalsCount: number; totalActivity: number }> = {};

    // Process journal entries
    (journalEntries || []).forEach((entry) => {
      const date = new Date(entry.created_at).toISOString().split('T')[0];
      if (!activityMap[date]) {
        activityMap[date] = { journalCount: 0, goalsCount: 0, totalActivity: 0 };
      }
      activityMap[date].journalCount += 1;
      activityMap[date].totalActivity += 1;
    });

    // Process completed goals
    (completedGoals || []).forEach((goal) => {
      const date = new Date(goal.completed_at!).toISOString().split('T')[0];
      if (!activityMap[date]) {
        activityMap[date] = { journalCount: 0, goalsCount: 0, totalActivity: 0 };
      }
      activityMap[date].goalsCount += 1;
      activityMap[date].totalActivity += 1;
    });

    return NextResponse.json({
      success: true,
      data: activityMap,
    });
  } catch (error: unknown) {
    console.error('Activity fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activity data' },
      { status: 500 }
    );
  }
}

