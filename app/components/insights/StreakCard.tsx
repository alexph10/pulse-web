'use client'

import styles from './insights.module.css'

interface StreakCardProps {
  onExploreClick?: () => void
}

export default function StreakCard({ onExploreClick }: StreakCardProps) {
  const currentStreak = 12
  const bestStreak = 21
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  const checkedDays = [true, true, true, true, true, false, false] // example data

  return (
    <div className={`${styles.streakCard}`}>
      <div className={styles.cardHeaderRow}>
        <span className={styles.cardLabel}>Check-in Streak</span>
        <button className={styles.cardAction} onClick={onExploreClick}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="5" r="1.5" fill="currentColor" />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
            <circle cx="12" cy="19" r="1.5" fill="currentColor" />
          </svg>
        </button>
      </div>

      <div className={styles.streakHero}>
        <span className={styles.streakNumber}>{currentStreak}</span>
        <span className={styles.streakUnit}>days</span>
      </div>

      <div className={styles.streakWeek}>
        {weekDays.map((day, index) => (
          <div key={index} className={styles.streakDay}>
            <div className={`${styles.streakDot} ${checkedDays[index] ? styles.streakDotActive : ''}`} />
            <span className={styles.streakDayLabel}>{day}</span>
          </div>
        ))}
      </div>

      <div className={styles.streakBest}>
        Best: {bestStreak} days
      </div>
    </div>
  )
}
