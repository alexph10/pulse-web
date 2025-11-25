import styles from './gradient-divider.module.css'

interface GradientDividerProps {
  compact?: boolean
}

export function GradientDivider({ compact = false }: GradientDividerProps) {
  return <div className={`${styles.divider} ${compact ? styles.compact : ''}`} aria-hidden="true" />
}

