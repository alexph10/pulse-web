'use client'

import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import styles from './Input.module.css'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ComponentType<{ size?: number; weight?: string }>
  rightIcon?: React.ComponentType<{ size?: number; weight?: string }>
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon: LeftIcon, rightIcon: RightIcon, className, ...props }, ref) => {
    return (
      <div className={styles.wrapper}>
        {label && (
          <label className={styles.label}>
            {label}
          </label>
        )}
        <div className={styles.inputWrapper}>
          {LeftIcon && (
            <div className={styles.iconLeft}>
              <LeftIcon size={20} weight="regular" />
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              styles.input,
              error && styles.error,
              LeftIcon && styles.withLeftIcon,
              RightIcon && styles.withRightIcon,
              className
            )}
            {...props}
          />
          {RightIcon && (
            <div className={styles.iconRight}>
              <RightIcon size={20} weight="regular" />
            </div>
          )}
        </div>
        {error && <span className={styles.errorText}>{error}</span>}
        {helperText && !error && (
          <span className={styles.helperText}>{helperText}</span>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

