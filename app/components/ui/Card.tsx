'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import styles from './Card.module.css'

interface CardProps {
  children: ReactNode
  elevation?: 0 | 1 | 2 | 3
  hoverable?: boolean
  className?: string
  header?: ReactNode
  footer?: ReactNode
  onClick?: () => void
}

export function Card({
  children,
  elevation = 1,
  hoverable = false,
  className,
  header,
  footer,
  onClick,
}: CardProps) {
  return (
    <div
      className={cn(
        styles.card,
        styles[`elevation-${elevation}`],
        hoverable && styles.hoverable,
        onClick && styles.clickable,
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {header && <div className={styles.header}>{header}</div>}
      <div className={styles.content}>{children}</div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  )
}

