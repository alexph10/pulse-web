'use client'

import { cn } from '@/lib/utils'
import styles from './Skeleton.module.css'

interface SkeletonProps {
  width?: string | number
  height?: string | number
  className?: string
  rounded?: boolean
  variant?: 'text' | 'circular' | 'rectangular'
}

export function Skeleton({
  width = '100%',
  height = '1em',
  className,
  rounded = false,
  variant = 'rectangular',
}: SkeletonProps) {
  const isCircular = variant === 'circular'
  const isRounded = rounded || variant === 'text'

  return (
    <div
      className={cn(
        styles.skeleton,
        isRounded && styles.rounded,
        isCircular && styles.circular,
        className
      )}
      style={{
        width: isCircular ? height : width,
        height,
      }}
    />
  )
}

