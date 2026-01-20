'use client'

import { useState, useMemo } from 'react'
import styles from './insights.module.css'

interface Moment {
  id: string
  date: string
  timeOfDay: string
  quote: string
}

interface MoodTrendsCardProps {
  onAskClick?: () => void
}

// Highlighted moments from journal entries
const mockMoments: Moment[] = [
  {
    id: '1',
    date: 'Friday',
    timeOfDay: 'afternoon',
    quote: 'Had coffee with Sam, felt really present for the first time in a while.'
  },
  {
    id: '2',
    date: 'Wednesday',
    timeOfDay: 'evening',
    quote: 'Finally finished that project. The relief is real.'
  },
  {
    id: '3',
    date: 'Sunday',
    timeOfDay: 'morning',
    quote: 'Slow start but grateful for the quiet.'
  },
]

export default function MoodTrendsCard({ onAskClick }: MoodTrendsCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const moment = mockMoments[currentIndex]

  return (
    <div className={styles.momentCard}>
      {/* Header */}
      <div className={styles.cardHeaderRow}>
        <span className={styles.cardLabel}>A moment</span>
        <button className={styles.cardAction} onClick={onAskClick}>
          <span className={styles.menuDots}>
            <span className={styles.menuDot} />
            <span className={styles.menuDot} />
            <span className={styles.menuDot} />
          </span>
        </button>
      </div>

      {/* Date context */}
      <p className={styles.momentDate}>
        {moment.date} {moment.timeOfDay}
      </p>

      {/* The actual quote */}
      <blockquote className={styles.momentQuote}>
        "{moment.quote}"
      </blockquote>

      {/* Dot indicators for browsing moments */}
      <div className={styles.dotIndicators}>
        {mockMoments.map((_, index) => (
          <button
            key={index}
            className={`${styles.dotIndicator} ${index === currentIndex ? styles.dotActive : ''}`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Moment ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
