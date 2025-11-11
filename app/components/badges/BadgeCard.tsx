/**
 * Badge Component with 3D Effects
 * Dynamic styling based on tier configuration - no hardcoding
 */

'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { BadgeIcon, type BadgeIconType } from './BadgeIcon'
import { BADGE_TIERS, type BadgeTier } from '@/app/config/badges'
import type { BadgeCardProps } from '@/app/types/achievements'

export const BadgeCard: React.FC<BadgeCardProps> = ({
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
  
  const tierConfig = BADGE_TIERS[badge.tier]
  const dimensions = {
    small: { card: 120, icon: 40, text: 12 },
    medium: { card: 160, icon: 56, text: 14 },
    large: { card: 200, icon: 72, text: 16 }
  }
  
  const dim = dimensions[size]
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20
    setMousePosition({ x, y })
  }
  
  const gradientStyle = tierConfig.gradient.via
    ? `linear-gradient(${tierConfig.gradient.angle}deg, ${tierConfig.gradient.from}, ${tierConfig.gradient.via}, ${tierConfig.gradient.to})`
    : `linear-gradient(${tierConfig.gradient.angle}deg, ${tierConfig.gradient.from}, ${tierConfig.gradient.to})`

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
          background: earned ? gradientStyle : '#E2E8F0',
          borderRadius: '20px',
          boxShadow: earned
            ? `0 10px 30px ${tierConfig.glowColor}, 0 4px 12px rgba(0, 0, 0, 0.1)`
            : '0 4px 12px rgba(0, 0, 0, 0.08)',
          overflow: 'hidden',
          opacity: earned ? 1 : 0.4,
          transition: 'all 0.3s ease-in-out'
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
            fontWeight: '600',
            color: earned ? tierConfig.textColor : '#718096',
            textAlign: 'center',
            lineHeight: 1.2,
            maxWidth: '90%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            textShadow: earned ? `0 1px 2px ${tierConfig.glowColor}` : 'none',
            transition: 'all 0.3s ease-in-out'
          }}
        >
          {badge.name}
        </p>

        {/* Tier Badge */}
        <div
          style={{
            fontSize: dim.text - 2,
            fontWeight: '500',
            color: earned ? tierConfig.textColor : '#A0AEC0',
            textTransform: 'capitalize',
            opacity: 0.7,
            padding: '2px 8px',
            borderRadius: '6px',
            background: earned ? `${tierConfig.metallic.base}20` : 'rgba(0, 0, 0, 0.05)'
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
              opacity: 0.6,
              marginTop: 4
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
            bottom: 12,
            left: 12,
            right: 12,
            zIndex: 1
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 4
            }}
          >
            <span
              style={{
                fontSize: dim.text - 3,
                fontWeight: '500',
                color: '#718096'
              }}
            >
              Progress
            </span>
            <span
              style={{
                fontSize: dim.text - 3,
                fontWeight: '600',
                color: '#2D3748'
              }}
            >
              {progress}%
            </span>
          </div>
          
          {/* Progress Track */}
          <div
            style={{
              width: '100%',
              height: 6,
              background: 'rgba(0, 0, 0, 0.1)',
              borderRadius: 3,
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            {/* Progress Fill */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{
                height: '100%',
                background: `linear-gradient(90deg, ${tierConfig.gradient.from}, ${tierConfig.gradient.to})`,
                borderRadius: 3,
                position: 'relative',
                overflow: 'hidden'
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
