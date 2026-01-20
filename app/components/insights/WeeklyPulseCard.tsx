'use client'

import { useMemo } from 'react'
import styles from './insights.module.css'

interface DayData {
  day: string
  shortDay: string
  score: number
}

interface WeeklyPulseCardProps {
  onDetailsClick?: () => void
}

const mockWeekData: DayData[] = [
  { day: 'Monday', shortDay: 'M', score: 6 },
  { day: 'Tuesday', shortDay: 'T', score: 7 },
  { day: 'Wednesday', shortDay: 'W', score: 8 },
  { day: 'Thursday', shortDay: 'T', score: 7.5 },
  { day: 'Friday', shortDay: 'F', score: 9 },
  { day: 'Saturday', shortDay: 'S', score: 7 },
  { day: 'Sunday', shortDay: 'S', score: 6.5 },
]

// Generate narrative summary from data
function generateNarrative(data: DayData[]): { summary: string; standoutDay: string } {
  const scores = data.map(d => d.score)
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length
  const maxScore = Math.max(...scores)
  const minScore = Math.min(...scores)
  const variance = maxScore - minScore
  const standoutDay = data.find(d => d.score === maxScore)?.day || ''
  
  // Determine the narrative based on patterns
  let summary: string
  
  if (variance < 1.5) {
    summary = 'A steady week'
  } else if (variance > 3) {
    summary = 'An up-and-down week'
  } else if (scores[scores.length - 1] > scores[0] + 1) {
    summary = 'Building momentum'
  } else if (scores[scores.length - 1] < scores[0] - 1) {
    summary = 'A gradual wind-down'
  } else if (avg > 7.5) {
    summary = 'A bright week'
  } else if (avg < 5) {
    summary = 'A heavier week'
  } else {
    summary = 'A gentle week'
  }
  
  return { summary, standoutDay }
}

export default function WeeklyPulseCard({ onDetailsClick }: WeeklyPulseCardProps) {
  const { summary, standoutDay } = useMemo(() => generateNarrative(mockWeekData), [])
  const maxScore = Math.max(...mockWeekData.map(d => d.score))

  return (
    <div className={styles.pulseCard}>
      {/* Header */}
      <div className={styles.cardHeaderRow}>
        <span className={styles.cardLabel}>Your week</span>
        <button className={styles.cardAction} onClick={onDetailsClick}>
          <span className={styles.menuDots}>
            <span className={styles.menuDot} />
            <span className={styles.menuDot} />
            <span className={styles.menuDot} />
          </span>
        </button>
      </div>

      {/* Narrative summary */}
      <div className={styles.narrativeBlock}>
        <p className={styles.narrativePrimary}>{summary}</p>
        {standoutDay && (
          <p className={styles.narrativeSecondary}>with {standoutDay} standing out</p>
        )}
      </div>

      {/* Simple dot rhythm - no numbers, just visual pattern */}
      <div className={styles.rhythmDots}>
        {mockWeekData.map((day, index) => (
          <div key={index} className={styles.rhythmDay}>
            <div 
              className={`${styles.rhythmDot} ${day.score === maxScore ? styles.rhythmDotHighlight : ''}`}
            />
            <span className={styles.rhythmLabel}>{day.shortDay}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
