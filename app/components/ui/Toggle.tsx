'use client'

import { ReactNode } from 'react'
import * as Switch from '@radix-ui/react-switch'
import styles from './Toggle.module.css'

interface ToggleProps {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  label?: ReactNode
  labelPosition?: 'left' | 'right'
  size?: 'sm' | 'md'
  className?: string
}

export function Toggle({ 
  checked, 
  onCheckedChange, 
  disabled,
  label,
  labelPosition = 'right',
  size = 'md',
  className 
}: ToggleProps) {
  const toggle = (
    <Switch.Root
      className={`${styles.root} ${styles[size]} ${className || ''}`}
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
    >
      <Switch.Thumb className={`${styles.thumb} ${styles[`thumb-${size}`]}`} />
    </Switch.Root>
  )

  if (!label) {
    return toggle
  }

  return (
    <label className={`${styles.container} ${disabled ? styles.disabled : ''}`}>
      {labelPosition === 'left' && <span className={styles.label}>{label}</span>}
      {toggle}
      {labelPosition === 'right' && <span className={styles.label}>{label}</span>}
    </label>
  )
}














