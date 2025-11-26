'use client'

import { useState } from 'react'
import { X, SidebarSimple, Calendar, Target, TrendUp } from '@phosphor-icons/react'
import styles from './right-panel.module.css'

export default function RightPanel() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={styles.toggleButton}
        style={{
          opacity: isOpen ? 0 : 1,
          pointerEvents: isOpen ? 'none' : 'auto',
        }}
      >
        <SidebarSimple size={20} weight="regular" />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className={styles.backdrop}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sliding Panel */}
      <div
        className={styles.panel}
        style={{
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>Quick Actions</h2>
          <button
            onClick={() => setIsOpen(false)}
            className={styles.closeButton}
          >
            <X size={20} weight="regular" />
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* Quick Stats */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Today</h3>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <Target size={18} weight="duotone" />
              </div>
              <div>
                <p className={styles.statLabel}>Goals</p>
                <p className={styles.statValue}>3 of 5</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <TrendUp size={18} weight="duotone" />
              </div>
              <div>
                <p className={styles.statLabel}>Mood</p>
                <p className={styles.statValue}>7/10</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <Calendar size={18} weight="duotone" />
              </div>
              <div>
                <p className={styles.statLabel}>Streak</p>
                <p className={styles.statValue}>12 days</p>
              </div>
            </div>
          </div>

          {/* Upcoming */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Upcoming</h3>
            <div className={styles.upcomingItem}>
              <div className={styles.upcomingTime}>2:00 PM</div>
              <div className={styles.upcomingText}>Team Meeting</div>
            </div>
            <div className={styles.upcomingItem}>
              <div className={styles.upcomingTime}>5:30 PM</div>
              <div className={styles.upcomingText}>Evening Check-in</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Actions</h3>
            <button className={styles.actionButton}>New Journal Entry</button>
            <button className={styles.actionButton}>Log Mood</button>
            <button className={styles.actionButton}>Add Goal</button>
          </div>
        </div>
      </div>
    </>
  )
}

