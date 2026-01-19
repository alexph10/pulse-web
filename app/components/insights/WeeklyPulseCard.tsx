'use client'

import { useMemo } from 'react'
import { ArrowRightIcon } from '@radix-ui/react-icons'
import styles from './insights.module.css'

interface DayData {
  day: string
  shortDay: string
  score: number // 0-10
}

interface WeeklyPulseCardProps {
  onDetailsClick?: () => void
}

// Mock weekly data
const mockWeekData: DayData[] = [
  { day: 'Monday', shortDay: 'M', score: 6 },
  { day: 'Tuesday', shortDay: 'T', score: 7 },
  { day: 'Wednesday', shortDay: 'W', score: 8 },
  { day: 'Thursday', shortDay: 'T', score: 7.5 },
  { day: 'Friday', shortDay: 'F', score: 9 },
  { day: 'Saturday', shortDay: 'S', score: 7 },
  { day: 'Sunday', shortDay: 'S', score: 6.5 },
]

export default function WeeklyPulseCard({ onDetailsClick }: WeeklyPulseCardProps) {
  const stats = useMemo(() => {
    const checkIns = mockWeekData.filter(d => d.score > 0).length
    const avg = mockWeekData.reduce((sum, d) => sum + d.score, 0) / mockWeekData.length
    const bestDay = mockWeekData.reduce((best, d) => d.score > best.score ? d : best, mockWeekData[0])
    const maxScore = Math.max(...mockWeekData.map(d => d.score))
    
    return { checkIns, avg: avg.toFixed(1), bestDay: bestDay.day, maxScore }
  }, [])

  // Generate AI summary based on data
  const summary = useMemo(() => {
    const bestDay = mockWeekData.reduce((best, d) => d.score > best.score ? d : best, mockWeekData[0])
    return `Your week peaked on ${bestDay.day} with a score of ${bestDay.score}.`
  }, [])

  return (
    <div className={styles.pulseCard}>
      {/* Card Header with Action */}
      <div className={styles.cardHeaderRow}>
        <div className={styles.cardSection}>
          <span className={styles.cardLabel}>This week</span>
        </div>
        <button className={styles.cardAction} onClick={onDetailsClick}>
          <span className={styles.cardActionText}>View details</span>
          <ArrowRightIcon width={22} height={22} />
        </button>
      </div>

      {/* Mini Bar Chart */}
      <div className={styles.miniBarChart}>
        {mockWeekData.map((day, index) => {
          const heightPercent = (day.score / 10) * 100
          const isHighest = day.score === stats.maxScore
          
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

      {/* Stats Row */}
      <div className={styles.pulseStats}>
        <span className={styles.pulseStat}>
          <strong>{stats.checkIns}</strong> check-ins
        </span>
        <span className={styles.pulseStatDivider}>·</span>
        <span className={styles.pulseStat}>
          Avg <strong>{stats.avg}</strong>
        </span>
        <span className={styles.pulseStatDivider}>·</span>
        <span className={styles.pulseStat}>
          Best: <strong>{stats.bestDay}</strong>
        </span>
      </div>

      {/* AI Summary */}
      <p className={styles.pulseSummary}>{summary}</p>
    </div>
  )
}

