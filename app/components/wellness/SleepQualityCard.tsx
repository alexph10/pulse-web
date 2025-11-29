'use client'

import ProgressRing from '../ui/ProgressRing'
import styles from './SleepQualityCard.module.css'

export default function SleepQualityCard() {
  // Placeholder data - in real app, fetch from sleep tracking integration
  const sleepDuration = '7h 42m'
  const deepSleepPercent = 21
  const score = 85
  const change = '+6%'

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Sleep (Quality & Recovery)</h3>
        <div className={styles.change}>{change}</div>
      </div>

      <div className={styles.progressContainer}>
        <div className={styles.circularProgress}>
          <ProgressRing progress={score} size="lg" color="var(--accent-primary)" />
          <div className={styles.progressLabels}>
            <div className={styles.duration}>{sleepDuration}</div>
            <div className={styles.durationLabel}>Duration</div>
            <div className={styles.deepSleep}>
              <span className={styles.deepSleepPercent}>{deepSleepPercent}%</span>
              <span className={styles.deepSleepLabel}>Deep Sleep</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.score}>
        <span className={styles.scoreValue}>{score}/10</span>
      </div>

      <p className={styles.message}>
        You reached optimal recovery. Keeping your sleep schedule consistent will maintain this balance.
      </p>
    </div>
  )
}





