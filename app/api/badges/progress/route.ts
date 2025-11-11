/**
 * Badge Progress API Route
 * GET: Fetch user badge progress
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Fetch user's badge progress
    const { data: progress, error } = await supabase
      .from('badge_progress')
      .select('*')
      .eq('user_id', userId)
      .order('progress_percentage', { ascending: false })

    if (error) {
      console.error('Error fetching badge progress:', error)
      return NextResponse.json(
        { error: 'Failed to fetch badge progress' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      progress: progress || [],
      count: progress?.length || 0
    })
  } catch (error) {
    console.error('Badge progress fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
