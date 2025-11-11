/**
 * Badge Calculation Engine
 * Intelligent pattern recognition and badge awarding system
 * No hardcoding - driven by badge configuration
 */

import { supabase } from '@/lib/supabase'
import { BADGE_DEFINITIONS, type BadgeDefinition } from '@/app/config/badges'
import type {
  BadgeCheckContext,
  BadgeCheckResult,
  EntryAnalysis,
  MoodTransition,
  TriggerDetection
} from '@/app/types/achievements'
import {
  startOfDay,
  endOfDay,
  subDays,
  differenceInHours,
  differenceInDays,
  isWithinInterval,
  parseISO
} from 'date-fns'

export class BadgeEngine {
  /**
   * Main entry point: Check all badges for a user
   */
  static async checkBadges(context: BadgeCheckContext): Promise<BadgeCheckResult[]> {
    const results: BadgeCheckResult[] = []

    for (const badge of BADGE_DEFINITIONS) {
      // Skip if user already has this badge
      if (context.existingBadges.includes(badge.id)) {
        continue
      }

      const result = await this.checkBadge(badge, context)
      results.push(result)
    }

    return results
  }

  /**
   * Check a single badge against user data
   */
  private static async checkBadge(
    badge: BadgeDefinition,
    context: BadgeCheckContext
  ): Promise<BadgeCheckResult> {
    const { requirements } = badge
    let totalProgress = 0
    let allRequirementsMet = true

    for (const requirement of requirements) {
      const reqResult = await this.checkRequirement(requirement, context)
      
      if (!reqResult.met) {
        allRequirementsMet = false
      }

      totalProgress += reqResult.progress
    }

    const averageProgress = requirements.length > 0 
      ? Math.round(totalProgress / requirements.length) 
      : 0

    return {
      badgeId: badge.id,
      earned: allRequirementsMet,
      progress: averageProgress,
      currentValue: 0, // Will be calculated per requirement type
      targetValue: 0,
      metadata: {
        badge_tier: badge.tier,
        badge_category: badge.category
      }
    }
  }

  /**
   * Check individual requirement
   */
  private static async checkRequirement(
    requirement: any,
    context: BadgeCheckContext
  ): Promise<{ met: boolean; progress: number; currentValue: number }> {
    const { type, threshold, window, condition } = requirement

    switch (type) {
      case 'count':
        return this.checkCountRequirement(threshold, window, condition, context)
      
      case 'streak':
        return this.checkStreakRequirement(threshold, window, condition, context)
      
      case 'word_count':
        return this.checkWordCountRequirement(threshold, condition, context)
      
      case 'mood_change':
        return this.checkMoodChangeRequirement(threshold, window, condition, context)
      
      case 'time_pattern':
        return this.checkTimePatternRequirement(threshold, condition, context)
      
      case 'diversity':
        return this.checkDiversityRequirement(threshold, condition, context)
      
      case 'comeback':
        return this.checkComebackRequirement(threshold, window, condition, context)
      
      case 'reflection':
        return this.checkReflectionRequirement(threshold, condition, context)
      
      default:
        return { met: false, progress: 0, currentValue: 0 }
    }
  }

  /**
   * Count-based requirements (e.g., "50 entries")
   */
  private static async checkCountRequirement(
    threshold: number,
    window: number | undefined,
    condition: string | undefined,
    context: BadgeCheckContext
  ): Promise<{ met: boolean; progress: number; currentValue: number }> {
    let entries = context.recentEntries

    // Apply time window filter
    if (window) {
      const cutoffDate = subDays(new Date(), window)
      entries = entries.filter((entry: any) => 
        new Date(entry.created_at) >= cutoffDate
      )
    }

    // Apply condition filters
    if (condition) {
      switch (condition) {
        case 'analytics_views':
          // Would need to track this separately
          const currentValue = context.userStats.analytics_views || 0
          return {
            met: currentValue >= threshold,
            progress: Math.min(100, Math.round((currentValue / threshold) * 100)),
            currentValue
          }
        
        case 'voice_entries':
          entries = entries.filter((entry: any) => entry.audio_url)
          break
        
        case 'short_entries':
          entries = entries.filter((entry: any) => {
            const wordCount = this.countWords(entry.content || '')
            return wordCount > 0 && wordCount < 50
          })
          break
      }
    }

    const currentValue = entries.length
    return {
      met: currentValue >= threshold,
      progress: Math.min(100, Math.round((currentValue / threshold) * 100)),
      currentValue
    }
  }

  /**
   * Streak-based requirements (e.g., "7 day streak")
   */
  private static async checkStreakRequirement(
    threshold: number,
    window: number | undefined,
    condition: string | undefined,
    context: BadgeCheckContext
  ): Promise<{ met: boolean; progress: number; currentValue: number }> {
    if (condition === 'flexible_streak' && window) {
      // Flexible streak: X days within Y day window
      const cutoffDate = subDays(new Date(), window)
      const recentEntries = context.recentEntries.filter((entry: any) => 
        new Date(entry.created_at) >= cutoffDate
      )
      
      const uniqueDays = new Set(
        recentEntries.map((entry: any) => 
          startOfDay(new Date(entry.created_at)).toISOString()
        )
      )
      
      const currentValue = uniqueDays.size
      return {
        met: currentValue >= threshold,
        progress: Math.min(100, Math.round((currentValue / threshold) * 100)),
        currentValue
      }
    }

    if (condition === 'negative_mood_streak') {
      // Consecutive days with negative mood but still journaling
      const negativeMoods = ['Stressed', 'Sad', 'Angry']
      const streak = this.calculateConsecutiveDaysStreak(
        context.recentEntries,
        (entry: any) => negativeMoods.includes(entry.mood)
      )
      
      return {
        met: streak >= threshold,
        progress: Math.min(100, Math.round((streak / threshold) * 100)),
        currentValue: streak
      }
    }

    // Regular streak
    const currentValue = context.userStats.current_streak || 0
    return {
      met: currentValue >= threshold,
      progress: Math.min(100, Math.round((currentValue / threshold) * 100)),
      currentValue
    }
  }

  /**
   * Word count requirements
   */
  private static async checkWordCountRequirement(
    threshold: number,
    condition: string | undefined,
    context: BadgeCheckContext
  ): Promise<{ met: boolean; progress: number; currentValue: number }> {
    if (!context.newEntry) {
      return { met: false, progress: 0, currentValue: 0 }
    }

    const wordCount = this.countWords(context.newEntry.content)
    
    return {
      met: wordCount >= threshold,
      progress: Math.min(100, Math.round((wordCount / threshold) * 100)),
      currentValue: wordCount
    }
  }

  /**
   * Mood change requirements (e.g., "negative to positive transformation")
   */
  private static async checkMoodChangeRequirement(
    threshold: number,
    window: number | undefined,
    condition: string | undefined,
    context: BadgeCheckContext
  ): Promise<{ met: boolean; progress: number; currentValue: number }> {
    const transitions = this.detectMoodTransitions(context.recentEntries)
    let matchingTransitions = 0

    for (const transition of transitions) {
      if (condition === 'negative_to_positive_24h') {
        const negativeMoods = ['Stressed', 'Sad', 'Angry']
        const positiveMoods = ['Happy', 'Calm', 'Excited']
        
        if (
          negativeMoods.includes(transition.from) &&
          positiveMoods.includes(transition.to) &&
          transition.hours_between <= 24
        ) {
          matchingTransitions++
        }
      } else if (condition === 'month_over_month_improvement') {
        // Calculate mood improvement percentage
        const improvement = this.calculateMoodImprovement(
          context.recentEntries,
          window || 30
        )
        
        return {
          met: improvement >= threshold,
          progress: Math.min(100, Math.round((improvement / threshold) * 100)),
          currentValue: Math.round(improvement)
        }
      }
    }

    return {
      met: matchingTransitions >= threshold,
      progress: Math.min(100, Math.round((matchingTransitions / threshold) * 100)),
      currentValue: matchingTransitions
    }
  }

  /**
   * Time pattern requirements (e.g., "journal at night")
   */
  private static async checkTimePatternRequirement(
    threshold: number,
    condition: string | undefined,
    context: BadgeCheckContext
  ): Promise<{ met: boolean; progress: number; currentValue: number }> {
    let matchingEntries = 0

    for (const entry of context.recentEntries) {
      const hour = new Date(entry.created_at).getHours()
      
      if (condition === 'night_hours' && (hour >= 23 || hour < 3)) {
        matchingEntries++
      } else if (condition === 'morning_hours' && hour < 7) {
        matchingEntries++
      } else if (condition === 'same_mood_same_time') {
        // Check if same mood appears at similar times
        const timeOfDay = this.getTimeOfDay(hour)
        const sameMoodSameTime = context.recentEntries.filter((e: any) => {
          const eHour = new Date(e.created_at).getHours()
          return e.mood === entry.mood && this.getTimeOfDay(eHour) === timeOfDay
        }).length
        
        if (sameMoodSameTime >= threshold) {
          matchingEntries++
        }
      }
    }

    return {
      met: matchingEntries >= threshold,
      progress: Math.min(100, Math.round((matchingEntries / threshold) * 100)),
      currentValue: matchingEntries
    }
  }

  /**
   * Diversity requirements (e.g., "balanced mood distribution")
   */
  private static async checkDiversityRequirement(
    threshold: number,
    condition: string | undefined,
    context: BadgeCheckContext
  ): Promise<{ met: boolean; progress: number; currentValue: number }> {
    const distribution = context.userStats.mood_distribution
    const totalMoods = Object.keys(distribution).length
    
    if (condition === 'no_single_mood_over_50_percent') {
      const totalEntries = context.userStats.total_entries
      const allBalanced = Object.values(distribution).every(
        (count: any) => (count / totalEntries) < 0.5
      )
      
      return {
        met: allBalanced && totalMoods >= threshold,
        progress: allBalanced ? 100 : Math.round((totalMoods / threshold) * 100),
        currentValue: totalMoods
      }
    }

    return {
      met: totalMoods >= threshold,
      progress: Math.min(100, Math.round((totalMoods / threshold) * 100)),
      currentValue: totalMoods
    }
  }

  /**
   * Comeback requirements (returning after gap)
   */
  private static async checkComebackRequirement(
    threshold: number,
    window: number | undefined,
    condition: string | undefined,
    context: BadgeCheckContext
  ): Promise<{ met: boolean; progress: number; currentValue: number }> {
    if (condition === 'after_7day_gap') {
      // Check if there was a 7+ day gap followed by threshold entries in window days
      const sortedEntries = [...context.recentEntries].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      
      // Look for gap
      let hasGap = false
      let entriesAfterGap = 0
      
      for (let i = 0; i < sortedEntries.length - 1; i++) {
        const daysBetween = differenceInDays(
          new Date(sortedEntries[i].created_at),
          new Date(sortedEntries[i + 1].created_at)
        )
        
        if (daysBetween >= 7) {
          hasGap = true
          // Count entries after this gap within window
          const gapDate = new Date(sortedEntries[i].created_at)
          const windowEnd = new Date(gapDate)
          windowEnd.setDate(windowEnd.getDate() + (window || 5))
          
          entriesAfterGap = sortedEntries.filter((entry: any) => {
            const entryDate = new Date(entry.created_at)
            return entryDate >= gapDate && entryDate <= windowEnd
          }).length
          
          break
        }
      }
      
      return {
        met: hasGap && entriesAfterGap >= threshold,
        progress: hasGap ? Math.min(100, Math.round((entriesAfterGap / threshold) * 100)) : 0,
        currentValue: entriesAfterGap
      }
    }

    return { met: false, progress: 0, currentValue: 0 }
  }

  /**
   * Reflection requirements (entries with thoughtful analysis)
   */
  private static async checkReflectionRequirement(
    threshold: number,
    condition: string | undefined,
    context: BadgeCheckContext
  ): Promise<{ met: boolean; progress: number; currentValue: number }> {
    let reflectionCount = 0

    if (condition === 'trigger_words_detected') {
      // Look for trigger identification words
      const triggerWords = ['because', 'after', 'when', 'triggered', 'caused', 'made me']
      
      for (const entry of context.recentEntries) {
        const content = (entry.content || '').toLowerCase()
        const hasTriggerWords = triggerWords.some(word => content.includes(word))
        if (hasTriggerWords) {
          reflectionCount++
        }
      }
    } else {
      // Count entries with reflections field or meaningful content
      reflectionCount = context.recentEntries.filter((entry: any) => {
        const hasReflection = entry.reflection && entry.reflection.length > 20
        const hasDeepContent = entry.content && entry.content.length > 200
        return hasReflection || hasDeepContent
      }).length
    }

    return {
      met: reflectionCount >= threshold,
      progress: Math.min(100, Math.round((reflectionCount / threshold) * 100)),
      currentValue: reflectionCount
    }
  }

  // ========== Helper Methods ==========

  private static countWords(text: string): number {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length
  }

  private static getTimeOfDay(hour: number): string {
    if (hour >= 5 && hour < 12) return 'morning'
    if (hour >= 12 && hour < 17) return 'afternoon'
    if (hour >= 17 && hour < 22) return 'evening'
    return 'night'
  }

  private static detectMoodTransitions(entries: any[]): MoodTransition[] {
    const sorted = [...entries].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )

    const transitions: MoodTransition[] = []

    for (let i = 0; i < sorted.length - 1; i++) {
      const current = sorted[i]
      const next = sorted[i + 1]

      if (current.mood !== next.mood) {
        transitions.push({
          from: current.mood,
          to: next.mood,
          timestamp: new Date(next.created_at),
          hours_between: differenceInHours(
            new Date(next.created_at),
            new Date(current.created_at)
          )
        })
      }
    }

    return transitions
  }

  private static calculateMoodImprovement(entries: any[], windowDays: number): number {
    const cutoffDate = subDays(new Date(), windowDays)
    const previousCutoff = subDays(new Date(), windowDays * 2)

    const currentPeriod = entries.filter((entry: any) => 
      new Date(entry.created_at) >= cutoffDate
    )

    const previousPeriod = entries.filter((entry: any) => {
      const date = new Date(entry.created_at)
      return date >= previousCutoff && date < cutoffDate
    })

    const moodToScore: Record<string, number> = {
      'Happy': 5,
      'Excited': 5,
      'Calm': 4,
      'Neutral': 3,
      'Stressed': 2,
      'Sad': 1,
      'Angry': 1
    }

    const currentAvg = currentPeriod.length > 0
      ? currentPeriod.reduce((sum: number, e: any) => sum + (moodToScore[e.mood] || 3), 0) / currentPeriod.length
      : 0

    const previousAvg = previousPeriod.length > 0
      ? previousPeriod.reduce((sum: number, e: any) => sum + (moodToScore[e.mood] || 3), 0) / previousPeriod.length
      : 0

    if (previousAvg === 0) return 0

    return ((currentAvg - previousAvg) / previousAvg) * 100
  }

  private static calculateConsecutiveDaysStreak(
    entries: any[],
    filter?: (entry: any) => boolean
  ): number {
    const filtered = filter ? entries.filter(filter) : entries
    const sorted = [...filtered].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

    if (sorted.length === 0) return 0

    let streak = 1
    let currentDate = startOfDay(new Date(sorted[0].created_at))

    for (let i = 1; i < sorted.length; i++) {
      const entryDate = startOfDay(new Date(sorted[i].created_at))
      const daysDiff = differenceInDays(currentDate, entryDate)

      if (daysDiff === 1) {
        streak++
        currentDate = entryDate
      } else if (daysDiff > 1) {
        break
      }
    }

    return streak
  }
}
