"use client"

import React, { useEffect, useRef } from 'react'
import styles from './peekNav.module.css'

type Props = {
  open: boolean
  onClose: () => void
  outsideRefs?: React.RefObject<HTMLElement | null>[]
}

const ITEMS = [
  { id: 'addJournal', label: 'Add Journal', variant: 'accent' },
  { id: 'upgrade', label: 'Upgrade to Pro', variant: 'accent' },
]

export default function PeekNav({ open, onClose, outsideRefs = [] }: Props) {
  const centerRef = useRef<HTMLDivElement | null>(null)
  const cardRowRef = useRef<HTMLDivElement | null>(null)

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
      // only consider clicks inside the actual card row as "inside" the nav
      if (cardRowRef.current?.contains(target)) return
      // clicks on outside refs (profile / plus) should close
      for (const r of outsideRefs) {
        if (r?.current && r.current.contains(target)) {
          onClose()
          return
        }
      }
      // otherwise it's the backdrop/void — close
      onClose()
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [open, outsideRefs, onClose])

  return (
    <div
      className={`${styles.overlay} ${open ? styles.open : ''}`}
      aria-hidden={!open}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div ref={centerRef} className={styles.center} role="dialog" aria-label="Primary navigation">
        <div className={styles.cardRow} ref={cardRowRef}>
          {ITEMS.map((it, i) => (
            <div
              key={it.id}
              role="button"
              tabIndex={0}
              className={`${styles.card} ${it.variant === 'accent' ? styles.cardAccent : ''}`}
              style={{ animationDelay: `${i * 140}ms` }}
              onClick={() => {
                onClose()
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onClose()
                }
              }}
            >
              <div className={styles.cardInner}>
                <div className={styles.icon} aria-hidden>
                  {it.id === 'addJournal' && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  {it.id === 'upgrade' && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2l2.09 4.24L19 7.24l-3 2.92.71 4.15L12 13.77 7.29 14.31 8 10.16 5 7.24l4.91-.99L12 2z" stroke="currentColor" strokeWidth="0.6" fill="currentColor" />
                    </svg>
                  )}
                </div>

                <div className={styles.cardLabel}>
                  {it.label.split(' ').map((part, idx) => (
                    <div key={idx} className={styles.labelLine}>
                      {part}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
