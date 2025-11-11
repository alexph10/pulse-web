/**
 * Badge Component with 3D Effects
 * Dynamic styling based on tier configuration - no hardcoding
 * GREEN DESIGN: Memoized, optimized animations, minimal re-renders
 */

'use client'

import React, { useState, useMemo, useCallback, memo } from 'react'
import { motion } from 'framer-motion'
import { BadgeIcon, type BadgeIconType } from './BadgeIcon'
import { BADGE_TIERS, type BadgeTier } from '@/app/config/badges'
import type { BadgeCardProps } from '@/app/types/achievements'

const BadgeCardComponent: React.FC<BadgeCardProps> = ({
  badge,
  earned,
  earnedAt,
  progress = 0,
  size = 'medium',
  showProgress = true,
  onClick
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  // Memoize tier config lookup
  const tierConfig = useMemo(() => BADGE_TIERS[badge.tier], [badge.tier])
  
  // Memoize dimensions map
  const dimensions = useMemo(() => ({
    small: { card: 120, icon: 40, text: 12 },
    medium: { card: 160, icon: 56, text: 14 },
    large: { card: 200, icon: 72, text: 16 }
  }), [])
  
  const dim = dimensions[size]
  
  // Optimize mouse move handler with useCallback
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20
    setMousePosition({ x, y })
  }, [])
  
  // Memoize gradient style
  const gradientStyle = useMemo(() => 
    tierConfig.gradient.via
      ? `linear-gradient(${tierConfig.gradient.angle}deg, ${tierConfig.gradient.from}, ${tierConfig.gradient.via}, ${tierConfig.gradient.to})`
      : `linear-gradient(${tierConfig.gradient.angle}deg, ${tierConfig.gradient.from}, ${tierConfig.gradient.to})`,
    [tierConfig.gradient]
  )

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05, y: -4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      style={{
        width: dim.card,
        height: dim.card + (showProgress ? 40 : 0),
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
        transformStyle: 'preserve-3d',
        transform: isHovered 
          ? `perspective(1000px) rotateX(${-mousePosition.y}deg) rotateY(${mousePosition.x}deg)`
          : 'none',
        transition: 'transform 0.2s ease-out'
      }}
    >
      {/* Card Background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: earned ? gradientStyle : 'linear-gradient(135deg, #F5F5F5, #E8E8E8)',
          borderRadius: '24px',
          boxShadow: earned
            ? `0 20px 40px ${tierConfig.glowColor}50, 0 8px 16px ${tierConfig.glowColor}30, inset 0 1px 0 rgba(255,255,255,0.3)`
            : '0 8px 16px rgba(0, 0, 0, 0.04), 0 2px 4px rgba(0, 0, 0, 0.06)',
          overflow: 'hidden',
          opacity: earned ? 1 : 0.5,
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          border: earned ? 'none' : '2px solid rgba(0, 0, 0, 0.06)'
        }}
      >
        {/* Metallic Shine Effect */}
        {earned && (
          <motion.div
            animate={{
              x: isHovered ? ['-100%', '200%'] : '-100%'
            }}
            transition={{
              duration: 0.8,
              ease: 'easeInOut'
            }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '50%',
              height: '100%',
              background: `linear-gradient(90deg, transparent, ${tierConfig.metallic.highlight}40, transparent)`,
              transform: 'skewX(-20deg)'
            }}
          />
        )}
        
        {/* Ambient Occlusion */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle at 50% 40%, transparent 40%, rgba(0, 0, 0, 0.1) 100%)`,
            pointerEvents: 'none'
          }}
        />
      </div>

      {/* Badge Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: showProgress ? dim.card : '100%',
          padding: 16,
          gap: 8
        }}
      >
        {/* Icon Container with Depth */}
        <div
          style={{
            position: 'relative',
            width: dim.icon,
            height: dim.icon,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* Icon Shadow (3D depth) */}
          <div
            style={{
              position: 'absolute',
              width: dim.icon,
              height: dim.icon,
              transform: 'translateZ(-4px)',
              filter: 'blur(4px)',
              opacity: earned ? 0.3 : 0.1
            }}
          >
            <BadgeIcon
              type={badge.iconType}
              size={dim.icon}
              color={earned ? tierConfig.metallic.shadow : '#CBD5E0'}
            />
          </div>
          
          {/* Main Icon */}
          <motion.div
            animate={{
              rotateY: isHovered ? 360 : 0
            }}
            transition={{
              duration: 0.6,
              ease: 'easeInOut'
            }}
            style={{
              transform: 'translateZ(4px)'
            }}
          >
            <BadgeIcon
              type={badge.iconType}
              size={dim.icon}
              color={earned ? tierConfig.metallic.base : '#A0AEC0'}
            />
          </motion.div>
        </div>

        {/* Badge Name */}
        <p
          style={{
            fontSize: dim.text,
            fontWeight: '700',
            color: earned ? tierConfig.textColor : '#6B7280',
            textAlign: 'center',
            lineHeight: 1.3,
            maxWidth: '90%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            textShadow: earned ? `0 2px 4px ${tierConfig.glowColor}40, 0 1px 2px ${tierConfig.glowColor}20` : 'none',
            transition: 'all 0.3s ease-in-out',
            letterSpacing: '-0.01em',
            fontFamily: 'var(--font-family-satoshi)'
          }}
        >
          {badge.name}
        </p>

        {/* Tier Badge */}
        <div
          style={{
            fontSize: dim.text - 2,
            fontWeight: '600',
            color: earned ? tierConfig.textColor : '#9CA3AF',
            textTransform: 'uppercase',
            opacity: earned ? 0.9 : 0.6,
            padding: '4px 10px',
            borderRadius: '8px',
            background: earned 
              ? `linear-gradient(135deg, ${tierConfig.metallic.base}30, ${tierConfig.metallic.highlight}20)` 
              : 'rgba(0, 0, 0, 0.04)',
            backdropFilter: 'blur(8px)',
            border: earned ? `1px solid ${tierConfig.metallic.base}40` : '1px solid rgba(0, 0, 0, 0.08)',
            letterSpacing: '0.05em',
            fontFamily: 'var(--font-family-satoshi)'
          }}
        >
          {badge.tier}
        </div>

        {/* Earned Date */}
        {earned && earnedAt && (
          <p
            style={{
              fontSize: dim.text - 3,
              color: tierConfig.textColor,
              opacity: 0.7,
              marginTop: 4,
              fontFamily: 'var(--font-family-switzer)',
              fontWeight: '500'
            }}
          >
            {new Date(earnedAt).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
        )}
      </div>

      {/* Progress Bar */}
      {showProgress && !earned && progress > 0 && (
        <div
          style={{
            position: 'absolute',
            bottom: 14,
            left: 14,
            right: 14,
            zIndex: 1
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 6
            }}
          >
            <span
              style={{
                fontSize: dim.text - 3,
                fontWeight: '600',
                color: '#6B7280',
                fontFamily: 'var(--font-family-satoshi)',
                letterSpacing: '0.02em'
              }}
            >
              Progress
            </span>
            <span
              style={{
                fontSize: dim.text - 2,
                fontWeight: '700',
                color: '#1F2937',
                fontFamily: 'var(--font-family-satoshi)'
              }}
            >
              {progress}%
            </span>
          </div>
          
          {/* Progress Track */}
          <div
            style={{
              width: '100%',
              height: 8,
              background: 'linear-gradient(to right, rgba(0, 0, 0, 0.06), rgba(0, 0, 0, 0.04))',
              borderRadius: 6,
              overflow: 'hidden',
              boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)',
              position: 'relative'
            }}
          >
            {/* Progress Fill */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
              style={{
                height: '100%',
                background: `linear-gradient(135deg, ${tierConfig.gradient.from}, ${tierConfig.gradient.to})`,
                borderRadius: 6,
                position: 'relative',
                overflow: 'hidden',
                boxShadow: `0 0 8px ${tierConfig.glowColor}60`
              }}
            >
              {/* Animated shimmer */}
              <motion.div
                animate={{
                  x: ['-100%', '200%']
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear'
                }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '50%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)'
                }}
              />
            </motion.div>
          </div>
        </div>
      )}

      {/* Locked Overlay */}
      {!earned && badge.hidden && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.7)',
            borderRadius: '20px',
            zIndex: 2
          }}
        >
          <svg
            width={dim.icon / 2}
            height={dim.icon / 2}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="5" y="11" width="14" height="10" rx="2" stroke="white" strokeWidth="2" fill="none" />
            <path d="M 8 11 V 7 A 4 4 0 0 1 16 7 V 11" stroke="white" strokeWidth="2" fill="none" />
          </svg>
        </div>
      )}
    </motion.div>
  )
}

// Export memoized component - prevents re-renders when props haven't changed
export const BadgeCard = memo(BadgeCardComponent)
