/**
 * Badge Showcase Component
 * Displays earned badges, progress toward next badges, and engagement nudges
 * GREEN DESIGN: Memoized calculations, useCallback handlers, optimized filters
 */

'use client'

import React, { useEffect, useState, useMemo, useCallback, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BadgeCard } from './BadgeCard'
import { BadgeUnlock } from './BadgeUnlock'
import { 
  BADGE_DEFINITIONS, 
  getBadgesByCategory, 
  BADGE_CATEGORY_INFO,
  type BadgeCategory 
} from '@/app/config/badges'
import type { UserBadge, BadgeProgress } from '@/app/types/achievements'

interface BadgeShowcaseProps {
  userId: string
  compact?: boolean
}

const BadgeShowcaseComponent: React.FC<BadgeShowcaseProps> = ({ 
  userId, 
  compact = false 
}) => {
  const [userBadges, setUserBadges] = useState<UserBadge[]>([])
  const [badgeProgress, setBadgeProgress] = useState<BadgeProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [unlockingBadge, setUnlockingBadge] = useState<typeof BADGE_DEFINITIONS[0] | null>(null)

  useEffect(() => {
    if (userId) {
      fetchUserBadges()
    }
  }, [userId])

  const fetchUserBadges = useCallback(async () => {
    try {
      setLoading(true)
      
      // Fetch earned badges
      const badgesResponse = await fetch(`/api/badges?userId=${userId}`)
      const badgesData = await badgesResponse.json()
      setUserBadges(badgesData.badges || [])

      // Fetch badge progress
      const progressResponse = await fetch(`/api/badges/progress?userId=${userId}`)
      const progressData = await progressResponse.json()
      setBadgeProgress(progressData.progress || [])

    } catch (error) {
      console.error('Error fetching badges:', error)
    } finally {
      setLoading(false)
    }
  }, [userId])

  // Memoize filtered badges to avoid recalculating on every render
  const getFilteredBadges = useMemo(() => {
    if (selectedCategory === 'all') {
      return BADGE_DEFINITIONS
    }
    return getBadgesByCategory(selectedCategory as BadgeCategory)
  }, [selectedCategory])

  // Memoize badge earned check function
  const isBadgeEarned = useCallback((badgeId: string) => {
    return userBadges.some(ub => ub.badge_id === badgeId)
  }, [userBadges])

  // Memoize badge progress calculation
  const getBadgeProgress = useCallback((badgeId: string) => {
    const progress = badgeProgress.find(bp => bp.badge_id === badgeId)
    if (!progress) return 0
    return Math.min(100, Math.round((progress.current_value / progress.target_value) * 100))
  }, [badgeProgress])

  // Memoize in-progress badges calculation
  const getInProgressBadges = useMemo(() => {
    return badgeProgress
      .filter(bp => !userBadges.some(ub => ub.badge_id === bp.badge_id) && bp.current_value > 0)
      .sort((a, b) => {
        const progressA = a.current_value / a.target_value
        const progressB = b.current_value / b.target_value
        return progressB - progressA
      })
      .slice(0, compact ? 3 : 5)
      .map(bp => {
        const badge = BADGE_DEFINITIONS.find(b => b.id === bp.badge_id)
        return { badge, progress: bp }
      })
      .filter(item => item.badge)
  }, [badgeProgress, userBadges, compact])

  // Memoize smart nudge calculation
  const getSmartNudge = useMemo(() => {
    const inProgress = getInProgressBadges
    
    if (inProgress.length === 0) {
      return {
        message: "Start your journey by writing your first journal entry",
        cta: "Get Started"
      }
    }

    const closest = inProgress[0]
    const progressPercent = Math.round((closest.progress.current_value / closest.progress.target_value) * 100)
    
    if (progressPercent >= 80) {
      return {
        message: `You're ${100 - progressPercent}% away from unlocking "${closest.badge!.name}"`,
        cta: "Keep Going"
      }
    } else if (progressPercent >= 50) {
      return {
        message: `Halfway to "${closest.badge!.name}" - you're making great progress`,
        cta: "Continue"
      }
    } else {
      return {
        message: `Working toward "${closest.badge!.name}" - every entry counts`,
        cta: "Journal Now"
      }
    }
  }, [getInProgressBadges])

  const handleBadgeUnlockComplete = useCallback(() => {
    setUnlockingBadge(null)
    fetchUserBadges() // Refresh badges after unlock
  }, [fetchUserBadges])

  if (loading) {
    return (
      <div style={{
        padding: compact ? '24px' : '32px',
        textAlign: 'center',
        color: 'var(--text-secondary)',
        fontFamily: 'var(--font-family-satoshi)'
      }}>
        Loading achievements...
      </div>
    )
  }

  const filteredBadges = getFilteredBadges
  const earnedCount = userBadges.length
  const totalCount = BADGE_DEFINITIONS.length
  const inProgressBadges = getInProgressBadges
  const nudge = getSmartNudge

  if (compact) {
    return (
      <div style={{
        background: 'var(--card-background, #ffffff)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid var(--border-color, #E2E8F0)'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: 'var(--text-primary)',
            marginBottom: '8px',
            fontFamily: 'var(--font-family-satoshi)'
          }}>
            Achievements
          </h3>
          <p style={{
            fontSize: '14px',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-family-switzer)'
          }}>
            {earnedCount} of {totalCount} unlocked
          </p>
        </div>

        {/* Progress Bar */}
        <div style={{
          width: '100%',
          height: '8px',
          background: 'var(--progress-background, #E2E8F0)',
          borderRadius: '4px',
          overflow: 'hidden',
          marginBottom: '20px'
        }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(earnedCount / totalCount) * 100}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #8B2F2F, #B83A3A)',
              borderRadius: '4px'
            }}
          />
        </div>

        {/* In Progress Badges */}
        {inProgressBadges.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{
              fontSize: '14px',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: '12px',
              fontFamily: 'var(--font-family-satoshi)'
            }}>
              In Progress
            </h4>
            <div style={{
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap'
            }}>
              {inProgressBadges.map(({ badge, progress }) => (
                <BadgeCard
                  key={badge!.id}
                  badge={badge!}
                  earned={false}
                  progress={getBadgeProgress(badge!.id)}
                  size="small"
                />
              ))}
            </div>
          </div>
        )}

        {/* Smart Nudge */}
        <div style={{
          padding: '16px',
          background: 'linear-gradient(135deg, rgba(139, 47, 47, 0.1), rgba(158, 244, 208, 0.1))',
          borderRadius: '12px',
          border: '1px solid rgba(139, 47, 47, 0.2)'
        }}>
          <p style={{
            fontSize: '13px',
            color: 'var(--text-primary)',
            marginBottom: '8px',
            fontFamily: 'var(--font-family-switzer)'
          }}>
            {nudge.message}
          </p>
          <button
            onClick={() => window.location.href = '/dashboard/journal'}
            style={{
              padding: '8px 16px',
              background: '#8B2F2F',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: 'var(--font-family-satoshi)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#A13838'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#8B2F2F'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            {nudge.cta}
          </button>
        </div>
      </div>
    )
  }

  // Full Badge Showcase View
  return (
    <div style={{
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      {/* Header Stats */}
      <div style={{
        marginBottom: '32px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #8B2F2F, #B83A3A)',
          borderRadius: '16px',
          padding: '24px',
          color: '#ffffff'
        }}>
          <div style={{
            fontSize: '36px',
            fontWeight: '700',
            marginBottom: '4px',
            fontFamily: 'var(--font-family-satoshi)'
          }}>
            {earnedCount}
          </div>
          <div style={{
            fontSize: '14px',
            opacity: 0.9,
            fontFamily: 'var(--font-family-switzer)'
          }}>
            Badges Earned
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #1a3a2e, #2a4a3e)',
          borderRadius: '16px',
          padding: '24px',
          color: '#ffffff'
        }}>
          <div style={{
            fontSize: '36px',
            fontWeight: '700',
            marginBottom: '4px',
            fontFamily: 'var(--font-family-satoshi)'
          }}>
            {inProgressBadges.length}
          </div>
          <div style={{
            fontSize: '14px',
            opacity: 0.9,
            fontFamily: 'var(--font-family-switzer)'
          }}>
            In Progress
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #9EF4D0, #7ed4b0)',
          borderRadius: '16px',
          padding: '24px',
          color: '#1a3a2e'
        }}>
          <div style={{
            fontSize: '36px',
            fontWeight: '700',
            marginBottom: '4px',
            fontFamily: 'var(--font-family-satoshi)'
          }}>
            {Math.round((earnedCount / totalCount) * 100)}%
          </div>
          <div style={{
            fontSize: '14px',
            opacity: 0.9,
            fontFamily: 'var(--font-family-switzer)'
          }}>
            Complete
          </div>
        </div>
      </div>

      {/* Smart Nudge */}
      {inProgressBadges.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginBottom: '32px',
            padding: '24px',
            background: 'linear-gradient(135deg, rgba(139, 47, 47, 0.1), rgba(158, 244, 208, 0.1))',
            borderRadius: '16px',
            border: '2px solid rgba(139, 47, 47, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          <div>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: '4px',
              fontFamily: 'var(--font-family-satoshi)'
            }}>
              Keep Going
            </h3>
            <p style={{
              fontSize: '14px',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-family-switzer)'
            }}>
              {nudge.message}
            </p>
          </div>
          <button
            onClick={() => window.location.href = '/dashboard/journal'}
            style={{
              padding: '12px 24px',
              background: '#8B2F2F',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: 'var(--font-family-satoshi)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#A13838'
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 47, 47, 0.3)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#8B2F2F'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            {nudge.cta}
          </button>
        </motion.div>
      )}

      {/* Category Filter */}
      <div style={{
        marginBottom: '24px',
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap',
        padding: '4px',
        background: 'var(--card-background, #ffffff)',
        borderRadius: '12px',
        border: '1px solid var(--border-color, #E2E8F0)'
      }}>
        <button
          onClick={() => setSelectedCategory('all')}
          style={{
            padding: '8px 16px',
            background: selectedCategory === 'all' ? '#8B2F2F' : 'transparent',
            color: selectedCategory === 'all' ? '#ffffff' : 'var(--text-secondary)',
            border: 'none',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            fontFamily: 'var(--font-family-satoshi)',
            transition: 'all 0.2s ease'
          }}
        >
          All ({totalCount})
        </button>
        {Object.entries(BADGE_CATEGORY_INFO).map(([key, category]) => {
          const categoryBadges = getBadgesByCategory(key as BadgeCategory)
          const earnedInCategory = categoryBadges.filter(b => isBadgeEarned(b.id)).length
          
          return (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              style={{
                padding: '8px 16px',
                background: selectedCategory === key ? '#8B2F2F' : 'transparent',
                color: selectedCategory === key ? '#ffffff' : 'var(--text-secondary)',
                border: 'none',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                fontFamily: 'var(--font-family-satoshi)',
                transition: 'all 0.2s ease'
              }}
            >
              {category.name} ({earnedInCategory}/{categoryBadges.length})
            </button>
          )
        })}
      </div>

      {/* Badge Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '24px'
      }}>
        {filteredBadges.map((badge) => (
          <BadgeCard
            key={badge.id}
            badge={badge}
            earned={isBadgeEarned(badge.id)}
            progress={getBadgeProgress(badge.id)}
            size="medium"
          />
        ))}
      </div>

      {/* Badge Unlock Animation */}
      <AnimatePresence>
        {unlockingBadge && (
          <BadgeUnlock
            badge={unlockingBadge}
            onComplete={handleBadgeUnlockComplete}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// Export memoized component - optimizes dashboard performance
export const BadgeShowcase = memo(BadgeShowcaseComponent)
