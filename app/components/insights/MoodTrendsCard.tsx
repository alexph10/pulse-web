'use client'

import { useMemo } from 'react'
import MoodAreaChart, { MoodDataPoint, formatChartDate } from './MoodAreaChart'
import styles from './insights.module.css'

interface InsightResult {
  average: string
  percentChange: string
  direction: 'up' | 'down' | 'stable'
}

interface MoodTrendsCardProps {
  data?: MoodDataPoint[]
  onAskClick?: () => void
}

const mockMoodData: MoodDataPoint[] = [
  { date: '2025-01-05', score: 5 },
  { date: '2025-01-06', score: 6 },
  { date: '2025-01-07', score: 5.5 },
  { date: '2025-01-08', score: 7 },
  { date: '2025-01-09', score: 6.5 },
  { date: '2025-01-10', score: 7.5 },
  { date: '2025-01-11', score: 7 },
  { date: '2025-01-12', score: 8 },
  { date: '2025-01-13', score: 7.5 },
  { date: '2025-01-14', score: 8 },
  { date: '2025-01-15', score: 7 },
  { date: '2025-01-16', score: 8.5 },
  { date: '2025-01-17', score: 8 },
  { date: '2025-01-18', score: 7.5 },
]

function generateInsight(data: MoodDataPoint[]): InsightResult {
  if (data.length === 0) {
    return { average: '0', percentChange: '0', direction: 'stable' }
  }
  
  const avg = data.reduce((sum, d) => sum + d.score, 0) / data.length
  
  if (data.length < 2) {
    return { average: avg.toFixed(1), percentChange: '0', direction: 'stable' }
  }
  
  const midpoint = Math.floor(data.length / 2)
  const firstHalf = data.slice(0, midpoint)
  const secondHalf = data.slice(midpoint)
  
  const firstAvg = firstHalf.reduce((s, d) => s + d.score, 0) / firstHalf.length
  const secondAvg = secondHalf.reduce((s, d) => s + d.score, 0) / secondHalf.length
  
  const percentChange = firstAvg > 0 ? ((secondAvg - firstAvg) / firstAvg) * 100 : 0
  const trend = secondAvg - firstAvg
  
  let direction: 'up' | 'down' | 'stable'
  if (trend > 0.3) direction = 'up'
  else if (trend < -0.3) direction = 'down'
  else direction = 'stable'
  
  return {
    average: avg.toFixed(1),
    percentChange: Math.abs(percentChange).toFixed(0),
    direction
  }
}

export default function MoodTrendsCard({ data = mockMoodData, onAskClick }: MoodTrendsCardProps) {
  const insight = useMemo(() => generateInsight(data), [data])
  
  const startDate = data.length > 0 ? formatChartDate(data[0].date) : ''
  const endDate = data.length > 0 ? formatChartDate(data[data.length - 1].date) : ''
  
  return (
    <div className={styles.insightCard}>
      {/* Header with three-dot menu */}
      <div className={styles.cardHeaderRow}>
        <span className={styles.cardLabel}>Mood</span>
        <button className={styles.cardAction} onClick={onAskClick}>
          <span className={styles.menuDots}>
            <span className={styles.menuDot} />
            <span className={styles.menuDot} />
            <span className={styles.menuDot} />
          </span>
        </button>
      </div>
      
      {/* Hero Metric with trend below */}
      <div className={styles.heroMetric}>
        <span className={styles.heroNumber}>{insight.average}</span>
        <span className={`${styles.heroTrend} ${styles[insight.direction]}`}>
          <span className={styles.trendArrow}>
            {insight.direction === 'up' && '↗'}
            {insight.direction === 'down' && '↘'}
            {insight.direction === 'stable' && '→'}
          </span>
          {insight.direction === 'up' && '+'}
          {insight.direction === 'down' && '-'}
          {insight.percentChange}% this week
        </span>
      </div>
      
      {/* Chart */}
      <MoodAreaChart data={data} height={100} showLabels={false} />
      
      {/* Date range */}
      <div className={styles.chartFooter}>
        <span className={styles.chartDate}>{startDate}</span>
        <span className={styles.chartDate}>{endDate}</span>
      </div>
    </div>
  )
}
