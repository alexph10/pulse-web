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

  const currentLabel = labels[value - min] || ''

  return (
    <div className={styles.simpleGauge}>
      <div className={styles.simpleGaugeControls}>
        <button
          className={styles.simpleGaugeBtn}
          onClick={decrement}
          disabled={value <= min}
          type="button"
          aria-label="Decrease"
        >
          -
        </button>
        <span className={styles.simpleGaugeValue}>{value}</span>
        <button
          className={styles.simpleGaugeBtn}
          onClick={increment}
          disabled={value >= max}
          type="button"
          aria-label="Increase"
        >
          +
        </button>
      </div>
      <span className={styles.simpleGaugeLabel}>{currentLabel}</span>
    </div>
  )
}
