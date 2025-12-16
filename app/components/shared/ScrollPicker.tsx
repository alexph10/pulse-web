"use client"

import React from 'react'
import styles from './ScrollPicker.module.css'

interface ScrollPickerProps {
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step?: number
  unit: string
}

export default function ScrollPicker({ 
  value, 
  onChange, 
  min, 
  max, 
  step = 1,
  unit 
}: ScrollPickerProps) {
  
  const increment = () => {
    if (value + step <= max) {
      onChange(value + step)
    }
  }

  const decrement = () => {
    if (value - step >= min) {
      onChange(value - step)
    }
  }

  return (
    <div className={styles.scrollPicker}>
      <div>
        <span className={styles.scrollPickerValue}>{value}</span>
        <span className={styles.scrollPickerUnit}>{unit}</span>
      </div>
      <div className={styles.scrollPickerControls}>
        <button 
          className={styles.scrollPickerBtn} 
          onClick={decrement}
          disabled={value <= min}
          type="button"
          aria-label="Decrease"
        >
          -
        </button>
        <button 
          className={styles.scrollPickerBtn} 
          onClick={increment}
          disabled={value >= max}
          type="button"
          aria-label="Increase"
        >
          +
        </button>
      </div>
    </div>
  )
}
