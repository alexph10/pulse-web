'use client'

import styles from './HomeCarousel.module.css'

export default function StreakMini() {
  const currentStreak = 12
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  const checkedDays = [true, true, true, true, true, false, false]

  return (
    <div className={styles.streakMiniCard}>
      <span className={styles.miniCardLabel}>Streak</span>
      
      <div className={styles.streakMiniHero}>
        <span className={styles.streakMiniNumber}>{currentStreak}</span>
        <span className={styles.streakMiniUnit}>days</span>
      </div>

      <div className={styles.streakMiniWeek}>
        {weekDays.map((day, index) => (
          <div 
            key={index} 
            className={`${styles.streakMiniDot} ${checkedDays[index] ? styles.streakMiniDotActive : ''}`}
            title={day}
          />
        ))}
      </div>
    </div>
  )
}
