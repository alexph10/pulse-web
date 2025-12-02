/**
 * Main page with floating background
 */

'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import styles from './page.module.css'
import FloatingBackground from './components/ui/FloatingBackground'
import UnusualNav from './components/ui/UnusualNav'

export default function MainPage() {
  const [overlayOpen, setOverlayOpen] = useState(false)
  const [navOpen, setNavOpen] = useState(false)
  const profileButtonRef = useRef<HTMLDivElement | null>(null)
  const plusButtonRef = useRef<HTMLButtonElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Hide global components on main page
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
    <div className={styles.mainContainer}>
      {/* Framer scene removed for now (local gradient + floating background remain) */}
      {/* Floating lights background, z-index 2 (above blur overlay) */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
        <FloatingBackground />
      </div>
      {/* Frame outlines and nav border, z-index 10 */}
      <div className={styles.navBorder} style={{ zIndex: 10 }} />
      {/* Left-brand using Satoshi font */}
      <div className={styles.brand}>(pulse)</div>
      <nav className={styles.topNav}>
        <a href="#">Home</a>
        <a href="#">Chat</a>
        <a href="#">Insights</a>
      </nav>
      {/* Profile circle on the right side of the nav */}
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

      {/* Small create/plus button next to profile */}
      <button
        className={styles.plusButton}
        title="Create"
        aria-label="Create new"
        ref={plusButtonRef}
        onClick={() => {
          // always open from this control; closing is handled by UnusualNav when clicking outside
          setNavOpen(true)
        }}
      >
        <span aria-hidden="true">+</span>
      </button>

      {/* Framer-like unusual navigation overlay (opened by plus button) */}
      <UnusualNav open={navOpen} onClose={() => setNavOpen(false)} outsideRefs={[profileButtonRef, plusButtonRef]} />

      {/* Profile overlay panel (empty by design) */}
      {/* Profile overlay panel (kept in DOM so open/close can animate) */}
      <div
        className={`${styles.profileOverlay} ${overlayOpen ? styles.open : ''}`}
        ref={panelRef}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Profile panel"
        aria-hidden={!overlayOpen}
      >
        {/* intentionally blank for now */}
        <div className={styles.profileMenu} role="menu" aria-label="Profile menu" />
      </div>
      {/* Content will go here, z-index 5 */}
      <div style={{ position: 'relative', zIndex: 5, width: '100%', height: '100%' }}>
        {/* Add your page content here */}
      </div>
    </div>
  )
}
