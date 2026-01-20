'use client'

import styles from './HomeCarousel.module.css'

interface TopInsightCardProps {
  onSeeInsights: () => void
}

export default function TopInsightCard({ onSeeInsights }: TopInsightCardProps) {
  const insight = {
    text: 'You feel 23% better when you sleep before midnight.',
  }

  return (
    <div className={styles.topInsightCard}>
      <span className={styles.miniCardLabel}>Today&apos;s Insight</span>
      
      <p className={styles.topInsightText}>
        {insight.text}
      </p>

      <button className={styles.topInsightButton} onClick={onSeeInsights}>
        See All Insights
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  )
}
