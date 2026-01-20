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

// Mock last week's average for comparison
const lastWeekAvg = 6.9

export default function WeeklyPulseCard({ onDetailsClick }: WeeklyPulseCardProps) {
  const stats = useMemo(() => {
    const avg = mockWeekData.reduce((sum, d) => sum + d.score, 0) / mockWeekData.length
    const maxScore = Math.max(...mockWeekData.map(d => d.score))
    const bestDay = mockWeekData.find(d => d.score === maxScore)
    const change = avg - lastWeekAvg
    const changePercent = ((change / lastWeekAvg) * 100).toFixed(0)
    
    return { 
      avg: avg.toFixed(1), 
      maxScore, 
      bestDay: bestDay?.day || 'Friday',
      change: change.toFixed(1),
      changePercent,
      direction: change > 0.1 ? 'up' : change < -0.1 ? 'down' : 'stable'
    }
  }, [])

  return (
    <div className={styles.pulseCard}>
      {/* Header */}
      <div className={styles.cardHeaderRow}>
        <span className={styles.cardLabel}>Weekly mood</span>
        <button className={styles.cardAction} onClick={onDetailsClick}>
          <span className={styles.menuDots}>
            <span className={styles.menuDot} />
            <span className={styles.menuDot} />
            <span className={styles.menuDot} />
          </span>
        </button>
      </div>

      {/* Hero metric with comparison */}
      <div className={styles.heroMetric}>
        <span className={styles.heroNumber}>{stats.avg}</span>
        <span className={`${styles.heroTrend} ${styles[stats.direction]}`}>
          <span className={styles.trendArrow}>
            {stats.direction === 'up' && '↗'}
            {stats.direction === 'down' && '↘'}
            {stats.direction === 'stable' && '→'}
          </span>
          {stats.direction === 'up' && '+'}
          {stats.change} vs last week
        </span>
      </div>

      {/* Best day callout */}
      <div className={styles.pulseHighlight}>
        Best: {stats.bestDay}
      </div>

      {/* Bar chart */}
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
    </div>
  )
}
