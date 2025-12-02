/**
 * Chat page — displays the empty-chat state when there's no activity.
 * Reuses the main layout chrome (nav, profile, etc.) via the shared layout.
 */

'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import styles from '../page.module.css'
import FloatingBackground from '../components/ui/FloatingBackground'
import PeekNav from '../components/ui/PeekNav'
import EmptyChats from '../components/ui/EmptyChats'

export default function ChatPage() {
  const [overlayOpen, setOverlayOpen] = useState(false)
  const [navOpen, setNavOpen] = useState(false)
  const profileButtonRef = useRef<HTMLDivElement | null>(null)
  const plusButtonRef = useRef<HTMLButtonElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const router = useRouter()

  useEffect(() => {
    document.body.classList.add('blank-page-active')
    return () => {
      document.body.classList.remove('blank-page-active')
    }
  }, [])

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!overlayOpen) return
      const target = e.target as Node
      if (panelRef.current?.contains(target) || profileButtonRef.current?.contains(target)) return
      setOverlayOpen(false)
    }

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOverlayOpen(false)
    }

    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [overlayOpen])

  return (
    <div className={`${styles.mainContainer} ${overlayOpen ? styles.panelOpen : ''}`}>
      {/* Floating lights background */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
        <FloatingBackground />
      </div>

      {/* Nav border */}
      <div className={styles.navBorder} style={{ zIndex: 10 }} />

      {/* Brand */}
      <div className={styles.brand}>(pulse)</div>

      {/* Top navigation */}
      <nav className={styles.topNav}>
        <a href="/">Home</a>
        <a href="/chat" className={styles.active}>Chat</a>
        <a href="/insights">Insights</a>
      </nav>

      {/* Profile circle */}
      <div
        className={styles.profileCircle}
        title="Profile"
        role="button"
        aria-expanded={overlayOpen}
        onClick={() => setOverlayOpen((s) => !s)}
        ref={profileButtonRef}
      >
        N
      </div>

      {/* Plus button */}
      <button
        className={styles.plusButton}
        title="Create"
        aria-label="Create new"
        ref={plusButtonRef}
        onClick={() => setNavOpen(true)}
      >
        <span aria-hidden="true">+</span>
      </button>

      {/* Peek navigation overlay */}
      <PeekNav open={navOpen} onClose={() => setNavOpen(false)} outsideRefs={[profileButtonRef, plusButtonRef]} />

      {/* Blurred backdrop when profile overlay is open */}
      <div
        className={`${styles.panelBackdrop} ${overlayOpen ? styles.visible : ''}`}
        onClick={() => setOverlayOpen(false)}
        aria-hidden={!overlayOpen}
      />

      {/* Profile overlay panel */}
      <div
        className={`${styles.profileOverlay} ${overlayOpen ? styles.open : ''}`}
        ref={panelRef}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Profile panel"
        aria-hidden={!overlayOpen}
      >
        <div className={styles.profileMenu} role="menu" aria-label="Profile menu">
          <div className={styles.profileContent}>
            <div>
              <h2 className={styles.panelTitle}>Here's everything we know about you so far</h2>
              <p className={styles.panelSubtitle}>We use this information to provide you with the most accurate financial advice.</p>
            </div>

            <div className={styles.profileCard} role="button" onClick={() => { setOverlayOpen(false); router.push('/profile') }}>
              <div className={styles.profileAvatar}>C</div>
              <div className={styles.profileCardMeta}>
                <div className={styles.profileCardSubtitle}>Settings, personal info, and more</div>
                <div className={styles.profileName}>Can Pham</div>
              </div>
              <div className={styles.chevronRight}>▸</div>
            </div>

            <div className={styles.upgradeCard}>
              <div className={styles.upgradeTitle}>Upgrade to your wealth era</div>
              <div className={styles.upgradeText}>With Era Plus you get access to our most advanced AI model, additional money transfers, and unlimited automations, connections, and chat messages.</div>
              <div>
                <button className={styles.upgradeCTA} onClick={() => { setOverlayOpen(false); router.push('/upgrade') }}>Upgrade to Plus</button>
              </div>
            </div>

            <div>
              <div className={styles.sectionTitle}>Saved memories</div>
              <div className={styles.savedBox}>No saved memories yet</div>
            </div>

            <div>
              <div className={styles.sectionTitle}>Wellness information</div>
              <div className={styles.infoList}>
                <div className={styles.infoCard}>
                  <div className={styles.infoLabel}>Sleep</div>
                  <div className={styles.infoValue}>7 hrs / night</div>
                </div>

                <div className={styles.infoCard}>
                  <div className={styles.infoLabel}>Activity</div>
                  <div className={styles.infoValue}>5,200 steps / day</div>
                </div>

                <div className={styles.infoCard}>
                  <div className={styles.infoLabel}>Mood</div>
                  <div className={styles.infoValue}>Stable</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Page content — CHAT PAGE shows EmptyChats */}
      <div className={styles.pageContent} style={{ position: 'relative', zIndex: 5, width: '100%', height: '100%' }}>
        <EmptyChats onStart={() => setNavOpen(true)} />
      </div>
    </div>
  )
}
