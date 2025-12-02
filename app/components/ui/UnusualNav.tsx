"use client"

import React, { useEffect, useRef, useState } from 'react'
import styles from './unusualNav.module.css'

type Props = {
  open: boolean
  onClose: () => void
  // allow HTMLElement or null so refs from useRef<HTMLDivElement | null> are compatible
  outsideRefs?: React.RefObject<HTMLElement | null>[]
}

const ITEMS = [
  { id: 'addJournal', label: 'Add Journal', variant: 'accent' },
  { id: 'upgrade', label: 'Upgrade to Pro', variant: 'accent' },
]

export default function UnusualNav({ open, onClose, outsideRefs = [] }: Props) {
  const centerRef = useRef<HTMLDivElement | null>(null)
  const [toggled, setToggled] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {}
    for (const it of ITEMS) map[it.id] = false
    return map
  })

  function handleToggle(id: string, e?: React.MouseEvent) {
    e?.stopPropagation()
    setToggled((s) => ({ ...s, [id]: !s[id] }))
  }

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

  // Close when clicking any of the provided outside refs (attached outside regions)
  useEffect(() => {
    if (!open) return
    function onDocClick(e: MouseEvent) {
      const target = e.target as Node
      // If clicking inside the center (nav) do nothing
      if (centerRef.current?.contains(target)) return
      // If clicking any of the outsideRefs, close the nav
      for (const r of outsideRefs) {
        if (r?.current && r.current.contains(target)) {
          onClose()
          return
        }
      }
      // clicking elsewhere (backdrop) should also close
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
        // Clicking the backdrop closes the nav
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div ref={centerRef} className={styles.center} role="dialog" aria-label="Primary navigation">
        {/* Cards row anchored near bottom-center to match screenshot */}
        <div className={styles.cardRow}>
          {ITEMS.map((it, i) => (
            <div
              key={it.id}
              role="button"
              tabIndex={0}
              className={`${styles.card} ${it.variant === 'accent' ? styles.cardAccent : ''} ${toggled[it.id] ? styles.cardToggled : ''}`}
              style={{ animationDelay: `${i * 140}ms` }}
              onClick={() => {
                // primary card activation closes the nav (action could be hooked here)
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

                {/* Toggle control: top-right small switch */}
                <button
                  type="button"
                  aria-pressed={!!toggled[it.id]}
                  className={`${styles.toggle} ${toggled[it.id] ? styles.toggleOn : ''}`}
                  onClick={(e) => handleToggle(it.id, e)}
                >
                  <span className={styles.knob} />
                </button>

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

        {/* No internal close control — overlay closes by clicking outside or pressing Escape */}
      </div>
    </div>
  )
}
