"use client"

import React, { useEffect, useRef } from 'react'
import styles from './peekNav.module.css'

type Props = {
  open: boolean
  onClose: () => void
  outsideRefs?: React.RefObject<HTMLElement | null>[]
  onAddJournal?: () => void
  onManagePlan?: () => void
}

const ITEMS = [
  { id: 'addJournal', label: 'Add a Journal' },
  { id: 'managePlan', label: 'Manage my Plan' },
]

// Journal icon
const JournalIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 7h8M8 11h8M8 15h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// Settings/Plan icon
const PlanIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export default function PeekNav({ open, onClose, outsideRefs = [], onAddJournal, onManagePlan }: Props) {
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && open) onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (!open) return
    function onDocClick(e: MouseEvent) {
      const target = e.target as Node
      if (menuRef.current?.contains(target)) return
      for (const r of outsideRefs) {
        if (r?.current && r.current.contains(target)) {
          onClose()
          return
        }
      }
      onClose()
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [open, outsideRefs, onClose])

  if (!open) return null

  return (
    <div
      ref={menuRef}
      className={styles.overlay}
      role="dialog"
      aria-label="Quick actions"
    >
      <div className={styles.menu}>
        <div className={styles.menuItems}>
          {ITEMS.map((item) => (
            <div
              key={item.id}
              className={styles.menuItem}
              role="button"
              tabIndex={0}
              onClick={() => {
                onClose()
                if (item.id === 'addJournal' && onAddJournal) onAddJournal()
                if (item.id === 'managePlan' && onManagePlan) onManagePlan()
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onClose()
                  if (item.id === 'addJournal' && onAddJournal) onAddJournal()
                  if (item.id === 'managePlan' && onManagePlan) onManagePlan()
                }
              }}
            >
              <span className={styles.menuIcon}>
                {item.id === 'addJournal' && <JournalIcon />}
                {item.id === 'managePlan' && <PlanIcon />}
              </span>
              <span className={styles.menuLabel}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
