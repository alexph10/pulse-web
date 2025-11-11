/**
 * Badge Unlock Animation
 * Celebration with confetti, scale animations, and dynamic effects
 * GREEN DESIGN: Lazy-loaded confetti, memoized, optimized animations
 */

'use client'

import React, { useEffect, useState, useMemo, memo, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BadgeIcon } from './BadgeIcon'
import { BADGE_TIERS } from '@/app/config/badges'
import type { BadgeUnlockProps } from '@/app/types/achievements'

// Lazy load Confetti - only loads when badge is unlocked (saves ~50KB)
const Confetti = lazy(() => import('react-confetti'))

const BadgeUnlockComponent: React.FC<BadgeUnlockProps> = ({
  badge,
  onComplete,
  stats = []
}) => {
  const [showConfetti, setShowConfetti] = useState(true)
  const [showContent, setShowContent] = useState(false)
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 })

  // Memoize tier config
  const tierConfig = useMemo(() => BADGE_TIERS[badge.tier], [badge.tier])

  useEffect(() => {
    // Get window dimensions for confetti
    setWindowDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    })

    // Show content after brief delay
    const contentTimer = setTimeout(() => setShowContent(true), 300)

    // Stop confetti after 5 seconds
    const confettiTimer = setTimeout(() => setShowConfetti(false), 5000)

    // Auto-close after 8 seconds
    const closeTimer = setTimeout(() => onComplete(), 8000)

    return () => {
      clearTimeout(contentTimer)
      clearTimeout(confettiTimer)
      clearTimeout(closeTimer)
    }
  }, [onComplete])

  // Memoize gradient style calculation
  const gradientStyle = useMemo(() => 
    tierConfig.gradient.via
      ? `linear-gradient(${tierConfig.gradient.angle}deg, ${tierConfig.gradient.from}, ${tierConfig.gradient.via}, ${tierConfig.gradient.to})`
      : `linear-gradient(${tierConfig.gradient.angle}deg, ${tierConfig.gradient.from}, ${tierConfig.gradient.to})`,
    [tierConfig.gradient]
  )

  // Memoize confetti colors array
  const confettiColors = useMemo(() => [
    tierConfig.gradient.from,
    tierConfig.gradient.to,
    tierConfig.metallic.base,
    tierConfig.metallic.highlight,
    '#FFD700',
    '#FFF'
  ], [tierConfig.gradient, tierConfig.metallic])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(8px)'
        }}
        onClick={onComplete}
      >
        {/* Confetti - Lazy loaded for performance */}
        {showConfetti && (
          <Suspense fallback={null}>
            <Confetti
              width={windowDimensions.width}
              height={windowDimensions.height}
              recycle={false}
              numberOfPieces={300}
              gravity={0.3}
              colors={confettiColors}
              tweenDuration={5000}
            />
          </Suspense>
        )}

        {/* Content */}
        <AnimatePresence>
          {showContent && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 20
              }}
              style={{
                background: 'white',
                borderRadius: '32px',
                padding: '48px',
                maxWidth: '500px',
                boxShadow: `0 20px 60px ${tierConfig.glowColor}, 0 10px 40px rgba(0, 0, 0, 0.3)`,
                position: 'relative',
                overflow: 'hidden'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Animated Background Gradient */}
              <motion.div
                animate={{
                  backgroundPosition: ['0% 0%', '100% 100%']
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'linear'
                }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: gradientStyle,
                  backgroundSize: '200% 200%',
                  opacity: 0.1,
                  pointerEvents: 'none'
                }}
              />

              {/* Content Container */}
              <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                {/* Success Header */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: tierConfig.textColor,
                    marginBottom: '24px',
                    textTransform: 'uppercase',
                    letterSpacing: '2px'
                  }}
                >
                  Achievement Unlocked
                </motion.div>

                {/* Badge Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ 
                    scale: [0, 1.2, 0.95, 1],
                    rotate: [0, 0, 360, 360]
                  }}
                  transition={{
                    duration: 1,
                    times: [0, 0.4, 0.7, 1],
                    delay: 0.3
                  }}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: '24px',
                    filter: `drop-shadow(0 8px 16px ${tierConfig.glowColor})`
                  }}
                >
                  <motion.div
                    animate={{
                      y: [0, -10, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                  >
                    <BadgeIcon
                      type={badge.iconType}
                      size={120}
                      color={tierConfig.metallic.base}
                    />
                  </motion.div>
                </motion.div>

                {/* Badge Name */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  style={{
                    fontSize: '32px',
                    fontWeight: '700',
                    color: '#2D3748',
                    marginBottom: '12px',
                    background: gradientStyle,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  {badge.name}
                </motion.h2>

                {/* Tier Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                  style={{
                    display: 'inline-block',
                    padding: '6px 16px',
                    background: gradientStyle,
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'white',
                    textTransform: 'capitalize',
                    marginBottom: '20px',
                    boxShadow: `0 4px 12px ${tierConfig.glowColor}`
                  }}
                >
                  {badge.tier} Badge
                </motion.div>

                {/* Insight Message */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  style={{
                    fontSize: '16px',
                    lineHeight: 1.6,
                    color: '#4A5568',
                    marginBottom: '24px',
                    fontStyle: 'italic'
                  }}
                >
                  {badge.insight}
                </motion.p>

                {/* Stats */}
                {stats.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    style={{
                      display: 'flex',
                      gap: '16px',
                      justifyContent: 'center',
                      marginBottom: '24px',
                      flexWrap: 'wrap'
                    }}
                  >
                    {stats.map((stat, index) => (
                      <div
                        key={index}
                        style={{
                          background: '#F7FAFC',
                          padding: '12px 20px',
                          borderRadius: '12px',
                          minWidth: '100px'
                        }}
                      >
                        <div
                          style={{
                            fontSize: '24px',
                            fontWeight: '700',
                            color: tierConfig.textColor,
                            marginBottom: '4px'
                          }}
                        >
                          {stat.value}
                        </div>
                        <div
                          style={{
                            fontSize: '12px',
                            color: '#718096',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}
                        >
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

                {/* Rarity Indicator */}
                {badge.rarity < 50 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontSize: '13px',
                      color: '#A0AEC0',
                      marginBottom: '24px'
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                        fill="currentColor"
                      />
                    </svg>
                    <span>Earned by only {badge.rarity}% of users</span>
                  </motion.div>
                )}

                {/* Close Button */}
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onComplete}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: gradientStyle,
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: `0 4px 12px ${tierConfig.glowColor}`,
                    transition: 'all 0.3s ease-in-out'
                  }}
                >
                  Continue
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  )
}

// Export memoized component - prevents unnecessary re-renders
export const BadgeUnlock = memo(BadgeUnlockComponent)
