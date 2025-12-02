"use client"
import React from 'react'
import styles from '@/app/page.module.css'

type Props = {
  onStart?: () => void
  visible?: boolean
}

export default function EmptyChats({ onStart, visible = true }: Props) {
  if (!visible) return null

  return (
    <section
      className={styles.emptyState}
      role="status"
      aria-live="polite"
      aria-label="Chat history empty"
    >
      <p className={styles.emptyLabel}>Chat History Empty</p>
      <button 
        className={styles.startChatBtn} 
        onClick={() => onStart?.()}
        aria-label="Start a chat"
      >
        Start a chat
      </button>
    </section>
  )
}
