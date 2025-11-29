'use client'

import { useMemo } from 'react'
import MoodTrendChart from '../analytics/MoodTrendChart'
import styles from './StressRecoveryCard.module.css'

interface Entry {
  id?: string
  created_at: Date | string
  mood_score?: number
  primary_mood?: string
}

interface StressRecoveryCardProps {
  entries: Entry[]
}

export default function StressRecoveryCard({ entries }: StressRecoveryCardProps) {
  // Calculate balance score from entries
  const balanceScore = useMemo(() => {
    if (!entries || entries.length === 0) return '+0.00'
    
    // Simple calculation: average mood score - 5 (neutral)
    const avgMood = entries.reduce((sum, e) => sum + (e.mood_score || 5), 0) / entries.length
    const balance = (avgMood - 5).toFixed(2)
    const balanceNum = parseFloat(balance)
    return balanceNum >= 0 ? `+${balance}` : balance
  }, [entries])

  // Prepare chart data
  const chartData = useMemo(() => {
    if (!entries || entries.length === 0) return []
    
    return entries.slice(-7).map((entry: Entry) => ({
      date: entry.created_at,
      mood_score: entry.mood_score || 5,
      primary_mood: entry.primary_mood || 'neutral'
    }))
  }, [entries])

  const insight = useMemo(() => {
    const score = parseFloat(balanceScore)
    if (score > 0.3) {
      return "You're recovering faster than average — gentle activity and mindful breathing will keep you in balance."
    } else if (score < -0.3) {
      return "You're experiencing higher stress — consider rest, meditation, or light movement to restore balance."
    }
    return "Your stress and recovery are well-balanced — maintain your current routine for optimal wellness."
  }, [balanceScore])

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Stress / Recovery Balance</h3>
        <div className={styles.value}>{balanceScore}</div>
      </div>

      <div className={styles.chartContainer}>
        <MoodTrendChart data={chartData} type="area" />
      </div>

      <p className={styles.insight}>{insight}</p>

      <div className={styles.metrics}>
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricLabel}>HRV</span>
            <span className={styles.metricChange}>+8%</span>
          </div>
          <div className={styles.barChart}>
            <div className={styles.bar} style={{ height: '40%', background: 'rgba(217, 119, 6, 0.4)' }} />
            <div className={styles.bar} style={{ height: '60%', background: 'rgba(217, 119, 6, 0.5)' }} />
            <div className={styles.bar} style={{ height: '80%', background: 'rgba(217, 119, 6, 0.7)' }} />
          </div>
          <div className={styles.barLabels}>
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricLabel}>Glucose</span>
            <span className={styles.metricChange}>-5%</span>
          </div>
          <div className={styles.gaugeContainer}>
            <div className={styles.gauge}>
              <div className={styles.gaugeFill} style={{ '--progress': '75%' } as React.CSSProperties} />
              <div className={styles.gaugeCenter}>
                <span className={styles.gaugeValue}>94</span>
                <span className={styles.gaugeUnit}>mg/dL</span>
                <span className={styles.gaugeLabel}>Avg Glucose</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

