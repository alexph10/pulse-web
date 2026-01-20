'use client'

import styles from './HomeCarousel.module.css'

export default function WeeklyMoodRing() {
  const moodScore = 7.2
  const change = 0.8
  const percentage = (moodScore / 10) * 100
  const radius = 28
  const strokeWidth = 5
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className={styles.weeklyMoodCard}>
      <span className={styles.miniCardLabel}>This Week</span>
      
      <div className={styles.moodRingContainer}>
        <svg width="72" height="72" viewBox="0 0 72 72">
          <circle
            cx="36"
            cy="36"
            r={radius}
            fill="none"
            stroke="rgba(129, 114, 185, 0.15)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx="36"
            cy="36"
            r={radius}
            fill="none"
            stroke="#8172b9"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 36 36)"
          />
        </svg>
        <span className={styles.moodRingValue}>{moodScore}</span>
      </div>

      <span className={styles.moodRingChange}>
        {change >= 0 ? '+' : ''}{change} vs last
      </span>
    </div>
  )
}
