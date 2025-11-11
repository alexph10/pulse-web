/**
 * Badge Configuration System
 * Metadata-driven approach - no hardcoded values
 * All badge definitions are centralized and dynamic
 */

export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond'
export type BadgeCategory = 'journey' | 'resilience' | 'insight' | 'connection' | 'hidden'

export interface BadgeGradient {
  from: string
  via?: string
  to: string
  angle: number
}

export interface BadgeTierConfig {
  name: BadgeTier
  gradient: BadgeGradient
  textColor: string
  glowColor: string
  metallic: {
    base: string
    highlight: string
    shadow: string
  }
}

export interface BadgeRequirement {
  type: 'streak' | 'count' | 'mood_change' | 'time_pattern' | 'word_count' | 'diversity' | 'comeback' | 'reflection'
  threshold: number
  window?: number // days
  condition?: string // additional logic key
}

export interface BadgeDefinition {
  id: string
  name: string
  category: BadgeCategory
  tier: BadgeTier
  description: string
  insight: string // personalized message on unlock
  iconType: 'sunrise' | 'magnifier' | 'phoenix' | 'scroll' | 'chain' | 'lighthouse' | 'network' | 'compass' | 'moon' | 'calendar' | 'tree' | 'owl' | 'sun' | 'waveform' | 'circle' | 'pen'
  requirements: BadgeRequirement[]
  rarity: number // 0-100, calculated from user data
  hidden: boolean // discover by earning
  order: number // display order
}

// Tier Configuration
export const BADGE_TIERS: Record<BadgeTier, BadgeTierConfig> = {
  bronze: {
    name: 'bronze',
    gradient: {
      from: '#CD7F32',
      via: '#E9967A',
      to: '#8B4513',
      angle: 135
    },
    textColor: '#5D3A1A',
    glowColor: 'rgba(205, 127, 50, 0.5)',
    metallic: {
      base: '#CD7F32',
      highlight: '#E9967A',
      shadow: '#8B4513'
    }
  },
  silver: {
    name: 'silver',
    gradient: {
      from: '#C0C0C0',
      via: '#E8E8E8',
      to: '#A8A8A8',
      angle: 135
    },
    textColor: '#4A4A4A',
    glowColor: 'rgba(192, 192, 192, 0.5)',
    metallic: {
      base: '#C0C0C0',
      highlight: '#E8E8E8',
      shadow: '#A8A8A8'
    }
  },
  gold: {
    name: 'gold',
    gradient: {
      from: '#FFD700',
      via: '#FFF8DC',
      to: '#DAA520',
      angle: 135
    },
    textColor: '#8B6914',
    glowColor: 'rgba(255, 215, 0, 0.5)',
    metallic: {
      base: '#FFD700',
      highlight: '#FFF8DC',
      shadow: '#DAA520'
    }
  },
  platinum: {
    name: 'platinum',
    gradient: {
      from: '#E5E4E2',
      via: '#FFFFFF',
      to: '#BCC6CC',
      angle: 135
    },
    textColor: '#2D3748',
    glowColor: 'rgba(229, 228, 226, 0.6)',
    metallic: {
      base: '#E5E4E2',
      highlight: '#FFFFFF',
      shadow: '#BCC6CC'
    }
  },
  diamond: {
    name: 'diamond',
    gradient: {
      from: '#B9F2FF',
      via: '#FFFFFF',
      to: '#87CEEB',
      angle: 135
    },
    textColor: '#1A365D',
    glowColor: 'rgba(185, 242, 255, 0.7)',
    metallic: {
      base: '#B9F2FF',
      highlight: '#FFFFFF',
      shadow: '#87CEEB'
    }
  }
}

// Badge Definitions - Fully configurable
export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  // Journey Badges
  {
    id: 'journey_awakening',
    name: 'The Awakening',
    category: 'journey',
    tier: 'bronze',
    description: 'Wrote your first meaningful entry with depth and honesty',
    insight: 'You opened up. That\'s the hardest step.',
    iconType: 'sunrise',
    requirements: [
      { type: 'word_count', threshold: 100 },
      { type: 'count', threshold: 1 }
    ],
    rarity: 95,
    hidden: false,
    order: 1
  },
  {
    id: 'journey_observer',
    name: 'The Observer',
    category: 'journey',
    tier: 'silver',
    description: 'Recognized a pattern in your emotional rhythms',
    insight: 'You\'re starting to see your rhythms. Knowledge is power.',
    iconType: 'magnifier',
    requirements: [
      { type: 'time_pattern', threshold: 5, condition: 'same_mood_same_time' }
    ],
    rarity: 60,
    hidden: false,
    order: 2
  },
  {
    id: 'journey_alchemist',
    name: 'The Alchemist',
    category: 'journey',
    tier: 'gold',
    description: 'Transformed negative emotions into positive growth three times',
    insight: 'You\'re learning to transmute difficult emotions into growth.',
    iconType: 'phoenix',
    requirements: [
      { type: 'mood_change', threshold: 3, condition: 'negative_to_positive_24h' }
    ],
    rarity: 35,
    hidden: false,
    order: 3
  },
  {
    id: 'journey_sage',
    name: 'The Sage',
    category: 'journey',
    tier: 'platinum',
    description: 'Added thoughtful reflections to 50 entries',
    insight: 'Wisdom comes from looking back and learning forward.',
    iconType: 'scroll',
    requirements: [
      { type: 'reflection', threshold: 50 }
    ],
    rarity: 20,
    hidden: false,
    order: 4
  },

  // Resilience Badges
  {
    id: 'resilience_comeback',
    name: 'The Comeback',
    category: 'resilience',
    tier: 'silver',
    description: 'Returned after a break and logged 3 entries in 5 days',
    insight: 'Returning is harder than continuing. You did it.',
    iconType: 'chain',
    requirements: [
      { type: 'comeback', threshold: 3, window: 5, condition: 'after_7day_gap' }
    ],
    rarity: 45,
    hidden: false,
    order: 5
  },
  {
    id: 'resilience_storm',
    name: 'Storm Weathered',
    category: 'resilience',
    tier: 'gold',
    description: 'Journaled for 5 consecutive days during a difficult period',
    insight: 'You showed up when it mattered most. That\'s real strength.',
    iconType: 'lighthouse',
    requirements: [
      { type: 'streak', threshold: 5, condition: 'negative_mood_streak' }
    ],
    rarity: 30,
    hidden: false,
    order: 6
  },
  {
    id: 'resilience_phoenix',
    name: 'Phoenix Rising',
    category: 'resilience',
    tier: 'platinum',
    description: 'Improved your average mood by 30% over the last month',
    insight: 'Your persistence is transforming pain into power.',
    iconType: 'phoenix',
    requirements: [
      { type: 'mood_change', threshold: 30, window: 30, condition: 'month_over_month_improvement' }
    ],
    rarity: 15,
    hidden: false,
    order: 7
  },

  // Insight Badges
  {
    id: 'insight_cartographer',
    name: 'The Cartographer',
    category: 'insight',
    tier: 'gold',
    description: 'Experienced emotional diversity with balanced mood distribution',
    insight: 'You\'re not avoiding any part of yourself. That\'s emotional maturity.',
    iconType: 'compass',
    requirements: [
      { type: 'diversity', threshold: 5, condition: 'no_single_mood_over_50_percent' }
    ],
    rarity: 40,
    hidden: false,
    order: 8
  },
  {
    id: 'insight_archaeologist',
    name: 'The Archaeologist',
    category: 'insight',
    tier: 'silver',
    description: 'Reviewed your past entries 10 times to discover patterns',
    insight: 'Mining your past reveals gold for your future.',
    iconType: 'magnifier',
    requirements: [
      { type: 'count', threshold: 10, condition: 'analytics_views' }
    ],
    rarity: 50,
    hidden: false,
    order: 9
  },
  {
    id: 'insight_pattern_weaver',
    name: 'Pattern Weaver',
    category: 'insight',
    tier: 'platinum',
    description: 'Identified 3+ consistent triggers in your reflections',
    insight: 'You\'re reverse-engineering your emotions. That\'s next-level awareness.',
    iconType: 'network',
    requirements: [
      { type: 'reflection', threshold: 3, condition: 'trigger_words_detected' }
    ],
    rarity: 25,
    hidden: false,
    order: 10
  },

  // Connection Badges (Flexible Streaks)
  {
    id: 'connection_weekly_ritual',
    name: 'Weekly Ritual',
    category: 'connection',
    tier: 'bronze',
    description: 'Journaled 5 days in a rolling 7-day window',
    insight: 'Consistency isn\'t perfection. It\'s showing up most days.',
    iconType: 'calendar',
    requirements: [
      { type: 'streak', threshold: 5, window: 7, condition: 'flexible_streak' }
    ],
    rarity: 70,
    hidden: false,
    order: 11
  },
  {
    id: 'connection_moon_phases',
    name: 'Moon Phases',
    category: 'connection',
    tier: 'silver',
    description: 'Logged 20+ entries in any 30-day period',
    insight: 'Like the moon, you have phases. What matters is you keep orbiting back.',
    iconType: 'moon',
    requirements: [
      { type: 'count', threshold: 20, window: 30 }
    ],
    rarity: 55,
    hidden: false,
    order: 12
  },
  {
    id: 'connection_seasons_change',
    name: 'Seasons Change',
    category: 'connection',
    tier: 'gold',
    description: 'Maintained 60+ entries over 90 days',
    insight: 'You\'ve grown through a full season. Look how far you\'ve come.',
    iconType: 'tree',
    requirements: [
      { type: 'count', threshold: 60, window: 90 }
    ],
    rarity: 30,
    hidden: false,
    order: 13
  },

  // Hidden Badges (Discoveries)
  {
    id: 'hidden_night_owl',
    name: 'Night Owl Wisdom',
    category: 'hidden',
    tier: 'silver',
    description: 'Journaled 10 times between 11pm and 3am',
    insight: 'The quiet hours reveal truths the daylight hides.',
    iconType: 'owl',
    requirements: [
      { type: 'time_pattern', threshold: 10, condition: 'night_hours' }
    ],
    rarity: 35,
    hidden: true,
    order: 14
  },
  {
    id: 'hidden_dawn_writer',
    name: 'Dawn Writer',
    category: 'hidden',
    tier: 'silver',
    description: 'Journaled 10 times before 7am',
    insight: 'You\'re capturing your unfiltered self before the world wakes up.',
    iconType: 'sun',
    requirements: [
      { type: 'time_pattern', threshold: 10, condition: 'morning_hours' }
    ],
    rarity: 40,
    hidden: true,
    order: 15
  },
  {
    id: 'hidden_voice_of_truth',
    name: 'Voice of Truth',
    category: 'hidden',
    tier: 'gold',
    description: 'Recorded 25 voice journal entries',
    insight: 'Your voice carries emotion that words alone can\'t hold.',
    iconType: 'waveform',
    requirements: [
      { type: 'count', threshold: 25, condition: 'voice_entries' }
    ],
    rarity: 20,
    hidden: true,
    order: 16
  },
  {
    id: 'hidden_minimalist',
    name: 'The Minimalist',
    category: 'hidden',
    tier: 'bronze',
    description: 'Logged 20 short entries under 50 words',
    insight: 'Sometimes a few honest words beat paragraphs of pretense.',
    iconType: 'circle',
    requirements: [
      { type: 'count', threshold: 20, condition: 'short_entries' }
    ],
    rarity: 50,
    hidden: true,
    order: 17
  },
  {
    id: 'hidden_novelist',
    name: 'The Novelist',
    category: 'hidden',
    tier: 'platinum',
    description: 'Wrote a single entry over 1000 words',
    insight: 'You had something to say, and you said it all. That\'s courage.',
    iconType: 'pen',
    requirements: [
      { type: 'word_count', threshold: 1000 }
    ],
    rarity: 15,
    hidden: true,
    order: 18
  }
]

// Helper functions
export function getBadgeById(id: string): BadgeDefinition | undefined {
  return BADGE_DEFINITIONS.find(badge => badge.id === id)
}

export function getBadgesByCategory(category: BadgeCategory): BadgeDefinition[] {
  return BADGE_DEFINITIONS
    .filter(badge => badge.category === category)
    .sort((a, b) => a.order - b.order)
}

export function getBadgesByTier(tier: BadgeTier): BadgeDefinition[] {
  return BADGE_DEFINITIONS
    .filter(badge => badge.tier === tier)
    .sort((a, b) => a.order - b.order)
}

export function getVisibleBadges(): BadgeDefinition[] {
  return BADGE_DEFINITIONS
    .filter(badge => !badge.hidden)
    .sort((a, b) => a.order - b.order)
}

export function getAllBadges(): BadgeDefinition[] {
  return [...BADGE_DEFINITIONS].sort((a, b) => a.order - b.order)
}
