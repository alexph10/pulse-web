'use client'

import { ReactNode } from 'react'
import styles from './Divider.module.css'

interface DividerProps {
  orientation?: 'horizontal' | 'vertical'
  label?: string
  spacing?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Divider({ 
  orientation = 'horizontal', 
  label, 
  spacing = 'md',
  className 
}: DividerProps) {
  if (label && orientation === 'horizontal') {
    return (
      <div className={`${styles.dividerWithLabel} ${styles[`spacing-${spacing}`]} ${className || ''}`}>
        <div className={styles.line} />
        <span className={styles.label}>{label}</span>
        <div className={styles.line} />
      </div>
    )
  }

  return (
    <div 
      className={`${styles.divider} ${styles[orientation]} ${styles[`spacing-${spacing}`]} ${className || ''}`}
      role="separator"
      aria-orientation={orientation}
    />
  )
}






