"use client"

import React from 'react'
import styles from './onboarding.module.css'

interface HexagonGaugeProps {
  value: number
  onChange: (value: number) => void
  labels: string[]
  min?: number
  max?: number
}

export default function HexagonGauge({ 
  value, 
  onChange, 
  labels,
  min = 1,
  max = 5
}: HexagonGaugeProps) {
  
  const increment = () => {
    if (value < max) {
      onChange(value + 1)
    }
  }

  const decrement = () => {
    if (value > min) {
      onChange(value - 1)
    }
  }

  const fillPercent = ((value - min) / (max - min)) * 100
  const currentLabel = labels[value - min] || ''

  return (
    <div className={styles.hexagonGauge}>
      <div className={styles.hexagonContainer}>
        {/* Background hexagon */}
        <svg 
          className={styles.hexagonBg} 
          viewBox="0 0 200 220" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M100 10 L180 60 L180 160 L100 210 L20 160 L20 60 Z" 
            fill="#EEEEEE"
          />
        </svg>
        
        {/* Fill hexagon (clipped) */}
        <svg 
          className={styles.hexagonFill} 
          viewBox="0 0 200 220" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          style={{ 
            clipPath: `inset(${100 - fillPercent}% 0 0 0)` 
          }}
        >
          <path 
            d="M100 10 L180 60 L180 160 L100 210 L20 160 L20 60 Z" 
            fill="#AE99CB"
          />
        </svg>

        {/* Content */}
        <div className={styles.hexagonContent}>
          <div className={styles.hexagonControls}>
            <button 
              className={styles.hexagonBtn} 
              onClick={decrement}
              disabled={value <= min}
              type="button"
              aria-label="Decrease"
            >
              -
            </button>
            <span className={styles.hexagonValue}>{value}</span>
            <button 
              className={styles.hexagonBtn} 
              onClick={increment}
              disabled={value >= max}
              type="button"
              aria-label="Increase"
            >
              +
            </button>
          </div>
          <span className={styles.hexagonLabel}>{currentLabel}</span>
        </div>
      </div>
    </div>
  )
}
