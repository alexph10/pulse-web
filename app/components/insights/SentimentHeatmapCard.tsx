'use client'

import { useMemo } from 'react'
import styles from './insights.module.css'

interface ShowingUpCardProps {
  onExploreClick?: () => void
}

// Mock data: which days had check-ins
const mockCheckIns = [true, true, true, true, true, true, true] // 7 days this week
const longestStreak = 12

// Generate encouraging message based on consistency
function getEncouragement(daysThisWeek: number, longestStreak: number): string {
  if (daysThisWeek === 7) {
    return 'A full week of showing up'
  } else if (daysThisWeek >= 5) {
    return 'Your rhythm is building'
  } else if (daysThisWeek >= 3) {
    return 'Consistency grows with time'
  } else if (daysThisWeek === 1) {
    return 'Every check-in counts'
  } else {
    return 'Welcome back'
  }
}

export default function SentimentHeatmapCard({ onExploreClick }: ShowingUpCardProps) {
  const daysThisWeek = mockCheckIns.filter(Boolean).length
  const encouragement = useMemo(() => getEncouragement(daysThisWeek, longestStreak), [daysThisWeek])

  return (
    <div className={styles.showingUpCard}>
      {/* Header */}
      <div className={styles.cardHeaderRow}>
        <span className={styles.cardLabel}>Showing up</span>
        <button className={styles.cardAction} onClick={onExploreClick}>
          <span className={styles.menuDots}>
            <span className={styles.menuDot} />
            <span className={styles.menuDot} />
            <span className={styles.menuDot} />
          </span>
        </button>
      </div>

      {/* Days count - celebratory, not score-like */}
      <div className={styles.showingUpCount}>
        <span className={styles.showingUpNumber}>{daysThisWeek}</span>
        <span className={styles.showingUpUnit}>
          {daysThisWeek === 1 ? 'day' : 'days'} of reflection
        </span>
      </div>

      {/* Visual dots for the week */}
      <div className={styles.showingUpDots}>
        {mockCheckIns.map((checked, index) => (
          <div 
            key={index}
            className={`${styles.showingUpDot} ${checked ? styles.showingUpDotFilled : ''}`}
          />
        ))}
      </div>

      {/* Encouraging message */}
      <p className={styles.showingUpMessage}>{encouragement}</p>
    </div>
  )
}
