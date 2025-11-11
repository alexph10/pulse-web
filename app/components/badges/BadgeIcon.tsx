/**
 * Dynamic SVG Badge Icons
 * All icons generated programmatically - no emojis or hardcoded assets
 * GREEN DESIGN: Memoized for optimal re-render performance
 */

import React, { memo, useMemo } from 'react'

export type BadgeIconType = 
  | 'sunrise' | 'magnifier' | 'phoenix' | 'scroll' | 'chain' | 'lighthouse' 
  | 'network' | 'compass' | 'moon' | 'calendar' | 'tree' | 'owl' 
  | 'sun' | 'waveform' | 'circle' | 'pen'

interface BadgeIconProps {
  type: BadgeIconType
  size?: number
  color?: string
  className?: string
}

const BadgeIconComponent: React.FC<BadgeIconProps> = ({ 
  type, 
  size = 48, 
  color = 'currentColor',
  className 
}) => {
  // Memoize icon map to prevent recreation on every render
  const icons: Record<BadgeIconType, React.ReactElement> = useMemo(() => ({
    sunrise: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="70" r="20" fill={color} opacity="0.3" />
        <circle cx="50" cy="70" r="12" fill={color} />
        <line x1="50" y1="40" x2="50" y2="50" stroke={color} strokeWidth="3" strokeLinecap="round" />
        <line x1="70" y1="52" x2="64" y2="60" stroke={color} strokeWidth="3" strokeLinecap="round" />
        <line x1="80" y1="70" x2="72" y2="70" stroke={color} strokeWidth="3" strokeLinecap="round" />
        <line x1="30" y1="52" x2="36" y2="60" stroke={color} strokeWidth="3" strokeLinecap="round" />
        <line x1="20" y1="70" x2="28" y2="70" stroke={color} strokeWidth="3" strokeLinecap="round" />
        <path d="M 20 80 Q 50 60 80 80" stroke={color} strokeWidth="3" fill="none" />
      </svg>
    ),
    
    magnifier: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="25" stroke={color} strokeWidth="4" fill="none" />
        <line x1="58" y1="58" x2="80" y2="80" stroke={color} strokeWidth="4" strokeLinecap="round" />
        <circle cx="40" cy="40" r="15" stroke={color} strokeWidth="2" fill="none" opacity="0.4" />
      </svg>
    ),
    
    phoenix: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 50 20 Q 30 40 50 60 Q 70 40 50 20" fill={color} opacity="0.6" />
        <path d="M 50 60 L 40 80 M 50 60 L 60 80" stroke={color} strokeWidth="3" strokeLinecap="round" />
        <path d="M 35 30 Q 30 20 25 30" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <path d="M 65 30 Q 70 20 75 30" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <circle cx="45" cy="35" r="2" fill={color} />
        <circle cx="55" cy="35" r="2" fill={color} />
      </svg>
    ),
    
    scroll: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="25" y="20" width="50" height="60" rx="5" fill={color} opacity="0.2" />
        <path d="M 25 25 Q 20 25 20 30 L 20 70 Q 20 75 25 75" stroke={color} strokeWidth="3" fill="none" />
        <path d="M 75 25 Q 80 25 80 30 L 80 70 Q 80 75 75 75" stroke={color} strokeWidth="3" fill="none" />
        <line x1="35" y1="35" x2="65" y2="35" stroke={color} strokeWidth="2" opacity="0.6" />
        <line x1="35" y1="45" x2="65" y2="45" stroke={color} strokeWidth="2" opacity="0.6" />
        <line x1="35" y1="55" x2="55" y2="55" stroke={color} strokeWidth="2" opacity="0.6" />
      </svg>
    ),
    
    chain: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="35" width="25" height="30" rx="12" stroke={color} strokeWidth="4" fill="none" />
        <rect x="55" y="35" width="25" height="30" rx="12" stroke={color} strokeWidth="4" fill="none" />
        <line x1="45" y1="50" x2="55" y2="50" stroke={color} strokeWidth="4" strokeLinecap="round" />
        <path d="M 48 45 L 52 55" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.6" />
      </svg>
    ),
    
    lighthouse: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 45 70 L 40 30 L 60 30 L 55 70 Z" fill={color} opacity="0.3" />
        <rect x="35" y="70" width="30" height="10" fill={color} />
        <path d="M 40 30 L 45 20 L 55 20 L 60 30" fill={color} />
        <circle cx="50" cy="25" r="8" fill={color} opacity="0.6" />
        <path d="M 20 25 L 30 25 M 70 25 L 80 25" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.4" />
      </svg>
    ),
    
    network: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="30" r="8" fill={color} />
        <circle cx="30" cy="60" r="8" fill={color} />
        <circle cx="70" cy="60" r="8" fill={color} />
        <circle cx="50" cy="80" r="8" fill={color} />
        <line x1="50" y1="38" x2="30" y2="52" stroke={color} strokeWidth="2" />
        <line x1="50" y1="38" x2="70" y2="52" stroke={color} strokeWidth="2" />
        <line x1="30" y1="68" x2="50" y2="72" stroke={color} strokeWidth="2" />
        <line x1="70" y1="68" x2="50" y2="72" stroke={color} strokeWidth="2" />
      </svg>
    ),
    
    compass: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="35" stroke={color} strokeWidth="3" fill="none" />
        <path d="M 50 20 L 45 45 L 50 50 L 55 45 Z" fill={color} opacity="0.8" />
        <path d="M 50 80 L 45 55 L 50 50 L 55 55 Z" fill={color} opacity="0.3" />
        <line x1="50" y1="20" x2="50" y2="25" stroke={color} strokeWidth="2" />
        <line x1="50" y1="75" x2="50" y2="80" stroke={color} strokeWidth="2" />
        <line x1="20" y1="50" x2="25" y2="50" stroke={color} strokeWidth="2" />
        <line x1="75" y1="50" x2="80" y2="50" stroke={color} strokeWidth="2" />
        <circle cx="50" cy="50" r="5" fill={color} />
      </svg>
    ),
    
    moon: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 60 25 A 25 25 0 1 1 60 75 A 20 20 0 1 0 60 25" fill={color} />
        <circle cx="35" cy="35" r="3" fill={color} opacity="0.4" />
        <circle cx="30" cy="50" r="2" fill={color} opacity="0.4" />
        <circle cx="40" cy="65" r="2" fill={color} opacity="0.4" />
      </svg>
    ),
    
    calendar: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="25" width="60" height="55" rx="5" stroke={color} strokeWidth="3" fill="none" />
        <rect x="20" y="25" width="60" height="15" fill={color} opacity="0.3" />
        <line x1="35" y1="20" x2="35" y2="30" stroke={color} strokeWidth="3" strokeLinecap="round" />
        <line x1="65" y1="20" x2="65" y2="30" stroke={color} strokeWidth="3" strokeLinecap="round" />
        <circle cx="35" cy="55" r="3" fill={color} />
        <circle cx="50" cy="55" r="3" fill={color} />
        <circle cx="65" cy="55" r="3" fill={color} />
        <circle cx="35" cy="68" r="3" fill={color} opacity="0.5" />
        <circle cx="50" cy="68" r="3" fill={color} opacity="0.5" />
      </svg>
    ),
    
    tree: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 50 80 L 50 40" stroke={color} strokeWidth="5" strokeLinecap="round" />
        <circle cx="50" cy="35" r="15" fill={color} opacity="0.3" />
        <circle cx="40" cy="45" r="12" fill={color} opacity="0.4" />
        <circle cx="60" cy="45" r="12" fill={color} opacity="0.4" />
        <circle cx="50" cy="25" r="10" fill={color} opacity="0.5" />
        <path d="M 40 80 L 50 70 L 60 80" fill={color} opacity="0.2" />
      </svg>
    ),
    
    owl: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="50" cy="50" rx="30" ry="35" fill={color} opacity="0.3" />
        <circle cx="40" cy="45" r="10" fill="white" stroke={color} strokeWidth="2" />
        <circle cx="60" cy="45" r="10" fill="white" stroke={color} strokeWidth="2" />
        <circle cx="40" cy="45" r="5" fill={color} />
        <circle cx="60" cy="45" r="5" fill={color} />
        <path d="M 30 35 L 25 30 L 30 32" stroke={color} strokeWidth="2" fill="none" />
        <path d="M 70 35 L 75 30 L 70 32" stroke={color} strokeWidth="2" fill="none" />
        <path d="M 45 55 L 50 60 L 55 55" stroke={color} strokeWidth="2" fill="none" />
      </svg>
    ),
    
    sun: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="20" fill={color} />
        <g opacity="0.6">
          <line x1="50" y1="15" x2="50" y2="25" stroke={color} strokeWidth="3" strokeLinecap="round" />
          <line x1="50" y1="75" x2="50" y2="85" stroke={color} strokeWidth="3" strokeLinecap="round" />
          <line x1="15" y1="50" x2="25" y2="50" stroke={color} strokeWidth="3" strokeLinecap="round" />
          <line x1="75" y1="50" x2="85" y2="50" stroke={color} strokeWidth="3" strokeLinecap="round" />
          <line x1="25" y1="25" x2="32" y2="32" stroke={color} strokeWidth="3" strokeLinecap="round" />
          <line x1="68" y1="68" x2="75" y2="75" stroke={color} strokeWidth="3" strokeLinecap="round" />
          <line x1="75" y1="25" x2="68" y2="32" stroke={color} strokeWidth="3" strokeLinecap="round" />
          <line x1="32" y1="68" x2="25" y2="75" stroke={color} strokeWidth="3" strokeLinecap="round" />
        </g>
      </svg>
    ),
    
    waveform: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 15 50 L 25 30 L 35 60 L 45 40 L 55 55 L 65 35 L 75 65 L 85 50" 
              stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="25" cy="30" r="4" fill={color} />
        <circle cx="45" cy="40" r="4" fill={color} />
        <circle cx="65" cy="35" r="4" fill={color} />
      </svg>
    ),
    
    circle: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="30" stroke={color} strokeWidth="4" fill="none" />
        <circle cx="50" cy="50" r="20" stroke={color} strokeWidth="2" fill="none" opacity="0.4" />
        <circle cx="50" cy="50" r="10" stroke={color} strokeWidth="2" fill="none" opacity="0.2" />
      </svg>
    ),
    
    pen: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 30 70 L 25 80 L 35 75 L 70 40 L 60 30 Z" fill={color} opacity="0.6" />
        <path d="M 60 30 L 70 40 L 80 30 L 70 20 Z" fill={color} />
        <line x1="35" y1="65" x2="65" y2="35" stroke={color} strokeWidth="2" opacity="0.3" />
        <path d="M 25 80 L 30 85" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      </svg>
    )
  }), [color]) // Memoize based on color changes only

  return (
    <div style={{ width: size, height: size }} className={className}>
      {icons[type]}
    </div>
  )
}

// Export memoized component for optimal re-render prevention
export const BadgeIcon = memo(BadgeIconComponent)
