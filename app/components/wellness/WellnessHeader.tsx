'use client'

import { format } from 'date-fns'
import { MagnifyingGlass, Bell, Plus, UserCircle } from '@phosphor-icons/react'
import styles from './WellnessHeader.module.css'

interface User {
  id: string
  email?: string
  [key: string]: unknown
}

interface WellnessHeaderProps {
  user: User | null
}

export default function WellnessHeader({ user }: WellnessHeaderProps) {
  const today = format(new Date(), 'd MMM, EEE')
  const displayName = user?.email?.split('@')[0] || 'User'
  const age = 25 // Placeholder - could come from user profile
  const metabolicAge = '20.2y' // Placeholder

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <div className={styles.logo}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 12L7 8L11 14L15 6L19 10L21 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className={styles.logoText}>Pulse</span>
        </div>
      </div>

      <div className={styles.centerSection}>
        <div className={styles.userProfile}>
          <UserCircle size={32} weight="fill" className={styles.avatar} />
          <div className={styles.userInfo}>
            <div className={styles.userName}>{displayName}</div>
            <div className={styles.userMeta}>
              <span>{age} years old</span>
              <span className={styles.metabolicAge}>Metabolic age {metabolicAge}</span>
            </div>
          </div>
        </div>
        <div className={styles.date}>{today}</div>
      </div>

      <div className={styles.rightSection}>
        <button className={styles.iconButton} aria-label="Search">
          <MagnifyingGlass size={18} weight="regular" />
        </button>
        <button className={styles.iconButton} aria-label="Notifications">
          <Bell size={18} weight="regular" />
        </button>
        <button className={styles.addButton}>
          <Plus size={16} weight="regular" />
          <span>Add Data Source</span>
        </button>
      </div>
    </header>
  )
}





