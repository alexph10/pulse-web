'use client'

import CompletionStats from './completion-stats'
import styles from './signature-card.module.css'

export default function SignatureCard() {
  return (
    <div className={styles.card}>
      <CompletionStats />
    </div>
  )
}

