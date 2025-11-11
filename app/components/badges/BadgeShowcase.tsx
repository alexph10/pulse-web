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
        background: 'linear-gradient(135deg, #FFFFFF 0%, #FAFAFA 100%)',
        borderRadius: '20px',
        padding: '28px',
        border: '1px solid rgba(0, 0, 0, 0.06)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.06)'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <h3 style={{
              fontSize: '22px',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #1F2937, #4B5563)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontFamily: 'var(--font-family-satoshi)',
              letterSpacing: '-0.02em'
            }}>
              Achievements
            </h3>
            <div style={{
              padding: '6px 14px',
              background: 'linear-gradient(135deg, #8B2F2F, #B83A3A)',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: '700',
              color: '#FFFFFF',
              fontFamily: 'var(--font-family-satoshi)',
              boxShadow: '0 2px 8px rgba(139, 47, 47, 0.3)'
            }}>
              {earnedCount}/{totalCount}
            </div>
          </div>
          <p style={{
            fontSize: '14px',
            color: '#6B7280',
            fontFamily: 'var(--font-family-switzer)',
            fontWeight: '500'
          }}>
            Unlock badges by engaging with your mental wellness journey
          </p>
        </div>

        {/* Progress Bar */}
        <div style={{
          width: '100%',
          height: '12px',
          background: 'linear-gradient(to right, #F3F4F6, #E5E7EB)',
          borderRadius: '8px',
          overflow: 'hidden',
          marginBottom: '24px',
          boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
          border: '1px solid rgba(0, 0, 0, 0.04)'
        }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(earnedCount / totalCount) * 100}%` }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #8B2F2F, #B83A3A, #C94545)',
              borderRadius: '8px',
              position: 'relative',
              boxShadow: '0 0 12px rgba(139, 47, 47, 0.4)'
            }}
          >
            <motion.div
              animate={{ x: ['0%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '50%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                transform: 'skewX(-20deg)'
              }}
            />
          </motion.div>
        </div>

        {/* In Progress Badges */}
        {inProgressBadges.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{
              fontSize: '15px',
              fontWeight: '700',
              color: '#374151',
              marginBottom: '14px',
              fontFamily: 'var(--font-family-satoshi)',
              letterSpacing: '-0.01em'
            }}>
              In Progress
            </h4>
            <div style={{
              display: 'flex',
              gap: '14px',
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
          padding: '20px',
          background: 'linear-gradient(135deg, rgba(139, 47, 47, 0.08), rgba(158, 244, 208, 0.08))',
          borderRadius: '16px',
          border: '1px solid rgba(139, 47, 47, 0.15)',
          boxShadow: '0 2px 8px rgba(139, 47, 47, 0.06)'
        }}>
          <p style={{
            fontSize: '14px',
            color: '#374151',
            marginBottom: '12px',
            fontFamily: 'var(--font-family-switzer)',
            lineHeight: '1.6',
            fontWeight: '500'
          }}>
            {nudge.message}
          </p>
          <button
            onClick={() => window.location.href = '/dashboard/journal'}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #8B2F2F, #B83A3A)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              fontFamily: 'var(--font-family-satoshi)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 4px 12px rgba(139, 47, 47, 0.3), 0 2px 4px rgba(0, 0, 0, 0.1)',
              letterSpacing: '-0.01em'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(139, 47, 47, 0.4), 0 3px 6px rgba(0, 0, 0, 0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 47, 47, 0.3), 0 2px 4px rgba(0, 0, 0, 0.1)'
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
          color: '#ffffff',
          boxShadow: '0 8px 24px rgba(139, 47, 47, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            top: -20,
            right: -20,
            width: 100,
            height: 100,
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1), transparent)',
            borderRadius: '50%'
          }} />
          <div style={{
            fontSize: '42px',
            fontWeight: '800',
            marginBottom: '6px',
            fontFamily: 'var(--font-family-satoshi)',
            letterSpacing: '-0.02em',
            position: 'relative',
            zIndex: 1
          }}>
            {earnedCount}
          </div>
          <div style={{
            fontSize: '15px',
            opacity: 0.95,
            fontFamily: 'var(--font-family-switzer)',
            fontWeight: '600',
            position: 'relative',
            zIndex: 1
          }}>
            Badges Earned
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #1F2937, #374151)',
          borderRadius: '16px',
          padding: '24px',
          color: '#ffffff',
          boxShadow: '0 8px 24px rgba(31, 41, 55, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            bottom: -20,
            left: -20,
            width: 100,
            height: 100,
            background: 'radial-gradient(circle, rgba(158, 244, 208, 0.15), transparent)',
            borderRadius: '50%'
          }} />
          <div style={{
            fontSize: '42px',
            fontWeight: '800',
            marginBottom: '6px',
            fontFamily: 'var(--font-family-satoshi)',
            letterSpacing: '-0.02em',
            position: 'relative',
            zIndex: 1
          }}>
            {inProgressBadges.length}
          </div>
          <div style={{
            fontSize: '15px',
            opacity: 0.95,
            fontFamily: 'var(--font-family-switzer)',
            fontWeight: '600',
            position: 'relative',
            zIndex: 1
          }}>
            In Progress
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #9EF4D0, #7ed4b0)',
          borderRadius: '16px',
          padding: '24px',
          color: '#1a3a2e',
          boxShadow: '0 8px 24px rgba(158, 244, 208, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            top: -30,
            right: -30,
            width: 120,
            height: 120,
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.2), transparent)',
            borderRadius: '50%'
          }} />
          <div style={{
            fontSize: '42px',
            fontWeight: '800',
            marginBottom: '6px',
            fontFamily: 'var(--font-family-satoshi)',
            letterSpacing: '-0.02em',
            position: 'relative',
            zIndex: 1
          }}>
            {Math.round((earnedCount / totalCount) * 100)}%
          </div>
          <div style={{
            fontSize: '15px',
            opacity: 0.95,
            fontFamily: 'var(--font-family-switzer)',
            fontWeight: '600',
            position: 'relative',
            zIndex: 1
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
