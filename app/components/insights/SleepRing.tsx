'use client'

import styles from './insights.module.css'

interface SleepRingProps {
  currentHours: number
  targetHours: number
}

export default function SleepRing({ currentHours, targetHours }: SleepRingProps) {
  const percentage = Math.min((currentHours / targetHours) * 100, 100)
  const radius = 32
  const strokeWidth = 6
  const normalizedRadius = radius - strokeWidth / 2
  const circumference = normalizedRadius * 2 * Math.PI
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className={styles.sleepRingContainer}>
      <svg
        width={radius * 2}
        height={radius * 2}
        viewBox={`0 0 ${radius * 2} ${radius * 2}`}
        className={styles.sleepRingSvg}
      >
        {/* Background circle */}
        <circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          fill="none"
          stroke="rgba(129, 114, 185, 0.15)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          fill="none"
          stroke="#8172b9"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90 ${radius} ${radius})`}
          className={styles.sleepRingProgress}
        />
      </svg>
      
      {/* Text beside ring */}
      <div className={styles.sleepRingText}>
        <span className={styles.sleepRingValue}>{currentHours.toFixed(1)}h</span>
        <span className={styles.sleepRingLabel}>of {targetHours}h goal</span>
        <span className={styles.sleepRingPercent}>{Math.round(percentage)}%</span>
      </div>
    </div>
  )
}
