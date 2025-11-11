/**
 * Badge Check API Route
 * POST: Check if user has unlocked any new badges
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { BadgeEngine } from '@/app/lib/badgeEngine'
import type { BadgeCheckContext } from '@/app/types/achievements'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, entryId } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Fetch user's existing badges
    const { data: existingBadges } = await supabase
      .from('achievements')
      .select('badge_id')
      .eq('user_id', userId)

    // Fetch user's journal entries
    const { data: entries } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(100)

    // Calculate user stats
    const totalEntries = entries?.length || 0
    const moodDistribution: Record<string, number> = {}
    let totalMoodScore = 0

    entries?.forEach(entry => {
      if (entry.primary_mood) {
        moodDistribution[entry.primary_mood] = (moodDistribution[entry.primary_mood] || 0) + 1
      }
      if (entry.mood_score) {
        totalMoodScore += entry.mood_score
      }
    })

    // Build check context
    const context: BadgeCheckContext = {
      userId,
      recentEntries: entries || [],
      existingBadges: (existingBadges || []).map(b => b.badge_id),
      userStats: {
        total_entries: totalEntries,
        current_streak: 0, // Will be calculated by badge engine
        longest_streak: 0,
        mood_distribution: moodDistribution,
        avg_mood_score: totalEntries > 0 ? Math.round(totalMoodScore / totalEntries) : 0,
        analytics_views: 0
      }
    }

    // Check for newly unlocked badges
    const results = await BadgeEngine.checkBadges(context)

    // Filter for newly earned badges
    const newBadges = results.filter(result => result.earned)

    // Save newly earned badges to database
    if (newBadges.length > 0) {
      const badgesToInsert = newBadges.map(badge => ({
        user_id: userId,
        badge_id: badge.badgeId,
        earned_at: new Date().toISOString(),
        progress: 100,
        metadata: {
          ...badge.metadata,
          trigger_entry_id: entryId || null
        }
      }))

      await supabase
        .from('achievements')
        .insert(badgesToInsert)
    }

    return NextResponse.json({
      checked: results.length,
      unlocked: newBadges.length,
      badges: newBadges.map(b => ({
        badge_id: b.badgeId,
        progress: b.progress,
        metadata: b.metadata
      }))
    })
  } catch (error) {
    console.error('Badge check error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
