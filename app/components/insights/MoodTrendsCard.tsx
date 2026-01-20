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
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="5" r="1.5" fill="currentColor" />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
            <circle cx="12" cy="19" r="1.5" fill="currentColor" />
          </svg>
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
