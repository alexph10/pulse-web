'use client'

import styles from './insights.module.css'
import MoodTrendChart from './MoodTrendChart'
import SleepRing from './SleepRing'

interface ChartsCardProps {
  onExploreClick?: () => void
}

// Mock 30-day mood data
const mockMoodData = Array.from({ length: 30 }, (_, i) => {
  const date = new Date()
  date.setDate(date.getDate() - (29 - i))
  return {
    date: date.toISOString().split('T')[0],
    score: 5 + Math.sin(i * 0.3) * 2 + Math.random() * 1.5
  }
})

// Mock sleep data
const mockSleepCurrent = 7.2
const mockSleepTarget = 8

export default function ChartsCard({ onExploreClick }: ChartsCardProps) {
  return (
    <div className={styles.chartsCard}>
      {/* Header */}
      <div className={styles.cardHeaderRow}>
        <span className={styles.cardLabel}>Trends</span>
        <button className={styles.cardAction} onClick={onExploreClick}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="5" r="1.5" fill="currentColor" />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
            <circle cx="12" cy="19" r="1.5" fill="currentColor" />
          </svg>
        </button>
      </div>

      {/* Charts container - vertical layout */}
      <div className={styles.chartsContainer}>
        {/* Mood Section */}
        <div className={styles.chartSection}>
          <div className={styles.chartSectionHeader}>
            <span className={styles.chartSectionTitle}>Mood</span>
            <span className={styles.chartSectionSubtitle}>Last 30 days</span>
          </div>
          <MoodTrendChart data={mockMoodData} />
        </div>

        {/* Sleep Section */}
        <div className={styles.chartSection}>
          <div className={styles.chartSectionHeader}>
            <span className={styles.chartSectionTitle}>Sleep</span>
            <span className={styles.chartSectionSubtitle}>Weekly average</span>
          </div>
          <SleepRing currentHours={mockSleepCurrent} targetHours={mockSleepTarget} />
        </div>
      </div>
    </div>
  )
}
