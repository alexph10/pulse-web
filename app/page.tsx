/**
 * Main page with floating background
 */

'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { PersonIcon, GearIcon, ExitIcon } from '@radix-ui/react-icons'
import { supabase } from '@/lib/supabase'
import styles from './page.module.css'
import FloatingBackground from './components/ui/FloatingBackground'
import PeekNav from './components/ui/PeekNav'
import EmptyChats from './components/ui/EmptyChats'
import ChatPanel from './components/ui/ChatPanel'

export default function MainPage() {
  const [overlayOpen, setOverlayOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [navOpen, setNavOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [activePage, setActivePage] = useState<'home' | 'chat' | 'insights'>('home')
  const profileButtonRef = useRef<HTMLDivElement | null>(null)
  const profileDropdownRef = useRef<HTMLDivElement | null>(null)
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

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!profileDropdownOpen) return
      const target = e.target as Node
      if (profileDropdownRef.current?.contains(target) || profileButtonRef.current?.contains(target)) return
      setProfileDropdownOpen(false)
    }

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setProfileDropdownOpen(false)
    }

    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [profileDropdownOpen])

  return (
    <div className={`${styles.mainContainer} ${overlayOpen ? styles.panelOpen : ''}`}>
      {/* Floating lights background removed */}
      
      {/* Frame outlines and nav border, z-index 10 */}
      <div className={styles.navBorder} style={{ zIndex: 10 }} />
      
      {/* Animated left vertical outline - minimizes on Chat page */}
      <motion.div
        className={styles.leftOutline}
        animate={{ 
          left: activePage === 'chat' ? '2%' : '16%'
        }}
        transition={{
          type: 'spring',
          damping: 28,
          stiffness: 260,
          mass: 0.9
        }}
      />
      
      {/* Animated right vertical outline - slides left when chat opens */}
      <motion.div
        className={styles.rightOutline}
        animate={{ 
          right: chatOpen ? '35%' : '15%'
        }}
        transition={{
          type: 'spring',
          damping: 28,
          stiffness: 260,
          mass: 0.9
        }}
      />
      
      {/* Left-brand using Satoshi font */}
      <div className={styles.brand}>(pulse)</div>
      <nav className={styles.topNav}>
        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); setActivePage('home'); setChatOpen(false); }}
          className={activePage === 'home' ? styles.activeNavLink : ''}
        >
          Home
        </a>
        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); setActivePage('chat'); }}
          className={activePage === 'chat' ? styles.activeNavLink : ''}
        >
          Chat
        </a>
        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); setActivePage('insights'); setChatOpen(false); }}
          className={activePage === 'insights' ? styles.activeNavLink : ''}
        >
          Insights
        </a>
      </nav>
      {/* Profile icon on the right side of the nav */}
      <div
        className={styles.profileCircle}
        role="button"
        aria-expanded={profileDropdownOpen}
        onClick={() => setProfileDropdownOpen((s) => !s)}
        ref={profileButtonRef}
      >
        <PersonIcon />
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

      {/* Framer-like peek navigation overlay (opened by plus button) */}
      <PeekNav open={navOpen} onClose={() => setNavOpen(false)} outsideRefs={[profileButtonRef, plusButtonRef]} />

      {/* Profile dropdown - fits the right side panel dimensions */}
      <AnimatePresence>
        {profileDropdownOpen && (
          <motion.div
            className={styles.profileDropdown}
            ref={profileDropdownRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.profileDropdownContent}>
              <div className={styles.profileDropdownHeader}>
                <div className={styles.profileDropdownAvatar}>C</div>
                <div className={styles.profileDropdownInfo}>
                  <div className={styles.profileDropdownName}>Can Pham</div>
                  <div className={styles.profileDropdownEmail}>can@example.com</div>
                </div>
              </div>
              
              <div className={styles.profileDropdownDivider} />
              
              <button className={styles.profileDropdownItem} onClick={() => { setProfileDropdownOpen(false); setOverlayOpen(true); }}>
                <PersonIcon />
                Profile
              </button>
              
              <button className={styles.profileDropdownItem} onClick={() => { setProfileDropdownOpen(false); router.push('/settings'); }}>
                <GearIcon />
                Settings
              </button>
              
              <div className={styles.profileDropdownDivider} />
              
              <button className={styles.profileDropdownItem}>
                <ExitIcon />
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Blurred backdrop shown when profile overlay is open */}
      <AnimatePresence>
        {overlayOpen && (
          <motion.div
            className={styles.panelBackdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            onClick={() => setOverlayOpen(false)}
            aria-hidden={!overlayOpen}
          />
        )}
      </AnimatePresence>

      {/* Profile overlay panel with smooth Framer Motion animation */}
      <AnimatePresence>
        {overlayOpen && (
          <motion.div
            className={styles.profileOverlay}
            ref={panelRef}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Profile panel"
            initial={{ 
              opacity: 0, 
              y: 200
            }}
            animate={{ 
              opacity: 1, 
              y: 0
            }}
            exit={{ 
              opacity: 0, 
              y: 200
            }}
            transition={{ 
              type: 'spring',
              damping: 28,
              stiffness: 260,
              mass: 0.9
            }}
            style={{
              position: 'fixed',
              left: '50%',
              top: '70%',
              x: '-50%',
              width: 'calc(85% - 16% - 20px)',
              maxWidth: '900px',
              height: '85vh',
              pointerEvents: 'auto',
              overflow: 'auto'
            }}
          >
        <div className={styles.profileMenu} role="menu" aria-label="Profile menu">
          <div className={styles.profileContent}>
            <div>
              <h2 className={styles.panelTitle}>Here’s everything we know about you so far</h2>
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
          </motion.div>
        )}
      </AnimatePresence>
      {/* Content will go here, z-index 5 */}
      <div className={styles.pageContent} style={{ position: 'relative', zIndex: 5, width: '100%', height: '100%' }}>
        {/* Home page content */}
        {activePage === 'home' && (
          <div className={styles.homeContent}>
            <div className={styles.dateDisplay}>
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        )}
        
        {/* Empty chats placeholder - only show on Chat page */}
        {activePage === 'chat' && (
          <EmptyChats onStart={() => setChatOpen(true)} visible={!chatOpen} />
        )}
      </div>

      {/* Chat panel backdrop */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            className={styles.chatBackdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setChatOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Expand button when chat is closed (on Chat page) */}
      {activePage === 'chat' && !chatOpen && (
        <button 
          className={styles.chatExpandBtn}
          onClick={() => setChatOpen(true)}
          aria-label="Expand chat panel"
        >
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.05005 13.5C2.05005 13.7485 2.25152 13.95 2.50005 13.95C2.74858 13.95 2.95005 13.7485 2.95005 13.5L2.95005 1.49995C2.95005 1.25142 2.74858 1.04995 2.50005 1.04995C2.25152 1.04995 2.05005 1.25142 2.05005 1.49995L2.05005 13.5ZM8.4317 11.0681C8.60743 11.2439 8.89236 11.2439 9.06809 11.0681C9.24383 10.8924 9.24383 10.6075 9.06809 10.4317L6.58629 7.94993L14.5 7.94993C14.7485 7.94993 14.95 7.74846 14.95 7.49993C14.95 7.2514 14.7485 7.04993 14.5 7.04993L6.58629 7.04993L9.06809 4.56813C9.24383 4.39239 9.24383 4.10746 9.06809 3.93173C8.89236 3.75599 8.60743 3.75599 8.4317 3.93173L5.1817 7.18173C5.00596 7.35746 5.00596 7.64239 5.1817 7.81812L8.4317 11.0681Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
          </svg>
        </button>
      )}

      {/* Chat panel */}
      <AnimatePresence>
        {chatOpen && (
          <ChatPanel onClose={() => setChatOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}
