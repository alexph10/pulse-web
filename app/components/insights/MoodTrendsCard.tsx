'use client'

import { useMemo } from 'react'
import { ArrowRightIcon } from '@radix-ui/react-icons'
import MoodAreaChart, { MoodDataPoint, formatChartDate } from './MoodAreaChart'
import styles from './insights.module.css'

interface InsightResult {
  title: string
  average: string
  percentChange: string
  direction: 'up' | 'down' | 'stable'
}

interface MoodTrendsCardProps {
  data?: MoodDataPoint[]
  onAskClick?: () => void
}

// Mock data for demonstration
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

/**
 * Generate dynamic insight from mood data
 */
function generateInsight(data: MoodDataPoint[]): InsightResult {
  if (data.length === 0) {
    return {
      title: 'Start tracking your mood to see insights.',
      average: '0',
      percentChange: '0',
      direction: 'stable'
    }
  }
  
  const avg = data.reduce((sum, d) => sum + d.score, 0) / data.length
  
  if (data.length < 2) {
    return {
      title: 'Keep tracking to see your mood trends.',
      average: avg.toFixed(1),
      percentChange: '0',
      direction: 'stable'
    }
  }
  
  const midpoint = Math.floor(data.length / 2)
  const firstHalf = data.slice(0, midpoint)
  const secondHalf = data.slice(midpoint)
  
  const firstAvg = firstHalf.reduce((s, d) => s + d.score, 0) / firstHalf.length
  const secondAvg = secondHalf.reduce((s, d) => s + d.score, 0) / secondHalf.length
  
  const trend = secondAvg - firstAvg
  const percentChange = firstAvg > 0 ? ((secondAvg - firstAvg) / firstAvg) * 100 : 0
  
  let title: string
  let direction: 'up' | 'down' | 'stable'
  
  if (trend > 0.3) {
    title = 'Your mood is steadily improving.'
    direction = 'up'
  } else if (trend < -0.3) {
    title = 'Your mood has been fluctuating lately.'
    direction = 'down'
  } else {
    title = 'Your mood has been stable.'
    direction = 'stable'
  }
  
  return {
    title,
    average: avg.toFixed(1),
    percentChange: Math.abs(percentChange).toFixed(0),
    direction
  }
}

export default function MoodTrendsCard({ data = mockMoodData, onAskClick }: MoodTrendsCardProps) {
  const insight = useMemo(() => generateInsight(data), [data])
  
  // Get formatted date range
  const startDate = data.length > 0 ? formatChartDate(data[0].date) : ''
  const endDate = data.length > 0 ? formatChartDate(data[data.length - 1].date) : ''
  
  return (
    <div className={styles.insightCard}>
      {/* Card Header with Action */}
      <div className={styles.cardHeaderRow}>
        <div className={styles.cardTopHeader}>
          <span className={styles.cardHeaderTitle}>Your insights</span>
          <span className={styles.cardHeaderDate}>Last 14 days</span>
        </div>
        <button className={styles.cardAction} onClick={onAskClick}>
          <span className={styles.cardActionText}>Ask about patterns</span>
          <ArrowRightIcon width={22} height={22} />
        </button>
      </div>
      
      {/* Section Label */}
      <div className={styles.cardSection}>
        <span className={styles.cardLabel}>Mood trends</span>
      </div>
      
      {/* Hero Metric */}
      <div className={styles.heroMetric}>
        <span className={styles.heroNumber}>{insight.average}</span>
        <div className={styles.heroDetails}>
          <span className={styles.heroLabel}>Average mood score</span>
          <span className={`${styles.heroTrend} ${styles[insight.direction]}`}>
            {insight.direction === 'up' && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
            {insight.direction === 'down' && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 2.5L9.5 9.5M9.5 9.5H4.5M9.5 9.5V4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
            {insight.direction === 'up' && '+'}
            {insight.direction === 'down' && '-'}
            {insight.percentChange}% vs last week
          </span>
        </div>
      </div>
      
      {/* Chart */}
      <MoodAreaChart data={data} height={120} showLabels={false} />
      
      {/* Chart Footer - dates only */}
      <div className={styles.chartFooter}>
        <span className={styles.chartDate}>{startDate}</span>
        <span className={styles.chartDate}>{endDate}</span>
      </div>
    </div>
  )
}

