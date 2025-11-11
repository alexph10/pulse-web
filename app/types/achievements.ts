/**
 * Achievement System Types
 * Type-safe interfaces for the badge system
 */

import type { BadgeDefinition, BadgeTier, BadgeCategory } from '@/app/config/badges'

// Database Types
export interface Achievement {
  id: string
  user_id: string
  badge_id: string
  earned_at: string
  progress: number // 0-100
  metadata: {
    trigger_entry_id?: string
    stats_at_unlock?: Record<string, any>
    unlock_context?: string
  }
  created_at: string
  updated_at: string
}

export interface BadgeProgress {
  badge_id: string
  user_id: string
  current_value: number
  target_value: number
  progress_percentage: number
  last_checked: string
  is_complete: boolean
  metadata: {
    recent_activity?: any[]
    next_milestone?: string
  }
}

// Client Types
export interface UserBadge extends Achievement {
  definition: BadgeDefinition
  isNew?: boolean
}

export interface BadgeNotification {
  badge: BadgeDefinition
  earnedAt: Date
  triggerEntry?: {
    id: string
    mood: string
    created_at: string
  }
  stats: {
    label: string
    value: string
  }[]
}

export interface BadgeWithProgress {
  definition: BadgeDefinition
  earned: boolean
  progress: number // 0-100
  earnedAt?: Date
  nextMilestone?: string
  currentValue?: number
  targetValue?: number
}

// Analysis Types
export interface MoodTransition {
  from: string
  to: string
  timestamp: Date
  hours_between: number
}

export interface EmotionalPattern {
  type: 'time_of_day' | 'mood_sequence' | 'word_pattern' | 'streak_pattern'
  pattern: string
  frequency: number
  confidence: number // 0-1
  examples: string[]
}

export interface TriggerDetection {
  phrase: string
  associated_mood: string
  frequency: number
  context: string[]
}

export interface EntryAnalysis {
  word_count: number
  emotional_depth: number // 1-10
  sentiment_score: number // -1 to 1
  keywords: string[]
  has_reflection: boolean
  time_of_day: 'morning' | 'afternoon' | 'evening' | 'night'
}

// Badge Check Types
export interface BadgeCheckContext {
  userId: string
  newEntry?: {
    id: string
    mood: string
    content: string
    created_at: string
    audio_url?: string
  }
  recentEntries: any[]
  userStats: {
    total_entries: number
    current_streak: number
    longest_streak: number
    mood_distribution: Record<string, number>
    avg_mood_score: number
    analytics_views: number
  }
  existingBadges: string[] // badge IDs already earned
}

export interface BadgeCheckResult {
  badgeId: string
  earned: boolean
  progress: number
  currentValue: number
  targetValue: number
  reason?: string
  metadata?: Record<string, any>
}

// UI Types
export interface BadgeCardProps {
  badge: BadgeDefinition
  earned: boolean
  earnedAt?: Date
  progress?: number
  size?: 'small' | 'medium' | 'large'
  showProgress?: boolean
  onClick?: () => void
}

export interface BadgeUnlockProps {
  badge: BadgeDefinition
  onComplete: () => void
  stats?: Array<{ label: string; value: string }>
}

export interface BadgeShowcaseProps {
  badges: UserBadge[]
  inProgressBadges: BadgeWithProgress[]
  showHidden?: boolean
}
