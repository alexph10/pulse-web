"use client"

import { useState } from 'react'
import styles from './upcoming.module.css'

interface UpcomingDropdownProps {
  onClose?: () => void
}

export default function UpcomingDropdown({ onClose }: UpcomingDropdownProps) {
  // generate a simple 14-day window for demo purposes
  const today = new Date()
  const days = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    return d
  })

  const [selectedIndex, setSelectedIndex] = useState(8)

  return (
    <div className={styles.upcomingCard} role="region" aria-label="Upcoming events">
      <div className={styles.headerRow}>
        <div className={styles.title}>Upcoming</div>
        <div className={styles.subtitle}>In the next 2 weeks</div>
      </div>

      <div className={styles.calendarRow} role="list">
        {days.map((d, idx) => {
          const day = d.getDate()
          const short = ['s', 'm', 't', 'w', 't', 'f', 's'][d.getDay()]
          const isSelected = idx === selectedIndex
          return (
            <div
              key={d.toDateString()}
              role="button"
              tabIndex={0}
              aria-pressed={isSelected}
              className={`${styles.datePill} ${isSelected ? styles.selected : ''}`}
              onClick={() => {
                setSelectedIndex(idx)
                if (onClose) onClose()
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setSelectedIndex(idx)
                  if (onClose) onClose()
                }
              }}
            >
              <div className={styles.dateLabelSmall}>{short}</div>
              <div aria-hidden>{day}</div>
              {/* example tiny indicator on some dates */}
              {idx === 3 && <div style={{ position: 'absolute', right: -4, bottom: -4 }} className={styles.avatarTiny} />}
              {idx === 10 && <div style={{ position: 'absolute', right: -6, bottom: -4 }} className={styles.dot} />}
            </div>
          )
        })}
      </div>

      <div className={styles.footer}>
        <div className={styles.mutedRow}>
          <div className={styles.dot} />
          <div style={{ color: 'rgba(230,230,230,0.65)', fontSize: '0.86rem', fontWeight: 600 }}>Events</div>
        </div>
        <button className={styles.viewMore} onClick={() => { if (onClose) onClose() }}>View all</button>
      </div>
    </div>
  )
}
