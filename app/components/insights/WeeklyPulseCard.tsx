'use client'

import { useMemo } from 'react'
import { ArrowRightIcon } from '@radix-ui/react-icons'
import styles from './insights.module.css'

interface DayData {
  shortDay: string
  score: number
}

interface WeeklyPulseCardProps {
  onDetailsClick?: () => void
}

const mockWeekData: DayData[] = [
  { shortDay: 'M', score: 6 },
  { shortDay: 'T', score: 7 },
  { shortDay: 'W', score: 8 },
  { shortDay: 'T', score: 7.5 },
  { shortDay: 'F', score: 9 },
  { shortDay: 'S', score: 7 },
  { shortDay: 'S', score: 6.5 },
]

export default function WeeklyPulseCard({ onDetailsClick }: WeeklyPulseCardProps) {
  const { avg, maxScore } = useMemo(() => {
    const avg = mockWeekData.reduce((sum, d) => sum + d.score, 0) / mockWeekData.length
    const maxScore = Math.max(...mockWeekData.map(d => d.score))
    return { avg: avg.toFixed(1), maxScore }
  }, [])

  return (
    <div className={styles.pulseCard}>
      {/* Header */}
      <div className={styles.cardHeaderRow}>
        <span className={styles.cardLabel}>This week</span>
        <button className={styles.cardAction} onClick={onDetailsClick}>
          <ArrowRightIcon width={18} height={18} />
        </button>
      </div>

      {/* Hero metric */}
      <div className={styles.heroMetric}>
        <span className={styles.heroNumber}>{avg}</span>
        <span className={styles.heroLabel}>avg</span>
      </div>

      {/* Bar chart */}
      <div className={styles.miniBarChart}>
        {mockWeekData.map((day, index) => {
          const heightPercent = (day.score / 10) * 100
          const isHighest = day.score === maxScore
          
          return (
            <div key={index} className={styles.miniBarColumn}>
              <div className={styles.miniBarWrapper}>
                <div 
                  className={`${styles.miniBar} ${isHighest ? styles.miniBarHighlight : ''}`}
                  style={{ height: `${heightPercent}%` }}
                />
              </div>
              <span className={styles.miniBarLabel}>{day.shortDay}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
