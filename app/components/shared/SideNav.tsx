'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { House, ChatCircle, ChartLine, Target, CheckSquare, Calendar, TrendUp, ClockCounterClockwise, Gear, Question, User } from '@phosphor-icons/react'
import styles from './SideNav.module.css'

export default function SideNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [isExpanded, setIsExpanded] = useState(false)
  const [settingsExpanded, setSettingsExpanded] = useState(false)
  const [helpExpanded, setHelpExpanded] = useState(false)
  const [profileExpanded, setProfileExpanded] = useState(false)

  // Calculate effective expanded states - only allow sub-panels when main panel is expanded
  const effectiveSettingsExpanded = isExpanded && settingsExpanded
  const effectiveHelpExpanded = isExpanded && helpExpanded
  const effectiveProfileExpanded = isExpanded && profileExpanded

  const navItems = [
    { icon: House, label: 'Dashboard', path: '/dashboard' },
    { icon: ChatCircle, label: 'Journal', path: '/dashboard/journal' },
    { icon: ChartLine, label: 'Insights', path: '/dashboard/insights' },
    { icon: Target, label: 'Goals', path: '/dashboard/goals' },
    { icon: CheckSquare, label: 'Habits', path: '/dashboard/habits' },
    { icon: Calendar, label: 'Calendar', path: '/dashboard/calendar' },
    { icon: TrendUp, label: 'Progress', path: '/dashboard/progress' },
    { icon: ClockCounterClockwise, label: 'Activity', path: '/dashboard/activity' },
  ]

  const bottomNavItems = [
    { icon: Gear, label: 'Settings', path: '/dashboard/settings' },
    { icon: Question, label: 'Help', path: '/dashboard/help' },
    { icon: User, label: 'Profile', path: '/dashboard/profile' },
  ]

  return (
    <>
      <motion.div 
        className={styles.sidePanel}
        onClick={() => {
          setIsExpanded(!isExpanded)
        }}
        animate={{
          width: isExpanded ? '160px' : '12px'
        }}
        transition={{
          duration: 0.4,
          ease: [0.32, 0.72, 0, 1]
        }}
      >
        {/* Green Line Indicator */}
        <motion.div 
          className={styles.sidePanelIndicator}
          animate={{
            opacity: isExpanded ? 0 : 1
          }}
          transition={{
            duration: 0.3
          }}
        />
        
        {/* Top Line Indicator */}
        <motion.div 
          className={styles.sidePanelTopLine}
          animate={{
            width: (effectiveSettingsExpanded || effectiveHelpExpanded || effectiveProfileExpanded) ? '361px' : (isExpanded ? '160px' : '12px')
          }}
          transition={{
            duration: 0.4,
            ease: [0.32, 0.72, 0, 1]
          }}
        />
        
        {/* Panel Content */}
        <motion.div 
          className={styles.sidePanelContent}
          animate={{
            opacity: isExpanded ? 1 : 0,
            x: isExpanded ? 0 : -20
          }}
          transition={{
            duration: 0.4,
            ease: [0.32, 0.72, 0, 1]
          }}
        >
          {/* Top Section with Profile and Button - Disabled */}
          {/* <motion.div
            className={styles.topSection}
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <div
              onClick={() => router.push('/dashboard/profile')}
              className={styles.profileIcon}
            >
              P
            </div>

            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className={styles.addJournalButton}
            >
              Add Journal
            </button>
          </motion.div> */}

          <nav className={styles.navContainer}>
            <div className={styles.navSection}>
              {navItems.map((item, index) => {
                const Icon = item.icon
                const isActive = pathname === item.path
                return (
                  <motion.div
                    key={item.path}
                    className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(item.path)
                    }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: isExpanded ? 1 : 0, x: isExpanded ? 0 : -10 }}
                    transition={{
                      duration: 0.3,
                      delay: isExpanded ? index * 0.05 : 0,
                      ease: [0.32, 0.72, 0, 1]
                    }}
                    style={{ pointerEvents: isExpanded ? 'auto' : 'none' }}
                  >
                    <Icon size={14} weight={isActive ? 'fill' : 'regular'} className={styles.navIcon} />
                    <motion.span
                      className={styles.navLabel}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isExpanded ? 1 : 0 }}
                      transition={{ duration: 0.2, delay: isExpanded ? 0.1 + index * 0.05 : 0 }}
                    >
                      {item.label}
                    </motion.span>
                  </motion.div>
                )
              })}
            </div>

            <div className={styles.navSectionBottom}>
              {bottomNavItems.map((item, index) => {
                const Icon = item.icon
                const isActive = pathname === item.path
                const isSettings = item.label === 'Settings'
                const isHelp = item.label === 'Help'
                const isProfile = item.label === 'Profile'
                return (
                  <motion.div
                    key={item.path}
                    className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      if (isSettings) {
                        setSettingsExpanded(!settingsExpanded)
                        setHelpExpanded(false)
                        setProfileExpanded(false)
                      } else if (isHelp) {
                        setHelpExpanded(!helpExpanded)
                        setSettingsExpanded(false)
                        setProfileExpanded(false)
                      } else if (isProfile) {
                        setProfileExpanded(!profileExpanded)
                        setSettingsExpanded(false)
                        setHelpExpanded(false)
                      } else {
                        router.push(item.path)
                      }
                    }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: isExpanded ? 1 : 0, x: isExpanded ? 0 : -10 }}
                    transition={{
                      duration: 0.3,
                      delay: isExpanded ? 0.4 + index * 0.05 : 0,
                      ease: [0.32, 0.72, 0, 1]
                    }}
                    style={{ pointerEvents: isExpanded ? 'auto' : 'none' }}
                  >
                    <Icon size={14} weight={isActive ? 'fill' : 'regular'} className={styles.navIcon} />
                    <motion.span
                      className={styles.navLabel}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isExpanded ? 1 : 0 }}
                      transition={{ duration: 0.2, delay: isExpanded ? 0.5 + index * 0.05 : 0 }}
                    >
                      {item.label}
                    </motion.span>
                  </motion.div>
                )
              })}
            </div>
          </nav>
        </motion.div>
      </motion.div>

      {/* Settings Sub-Panel */}
      <motion.div
        className={styles.settingsSubPanel}
        initial={false}
        animate={{
          x: effectiveSettingsExpanded ? 0 : '-100%',
          opacity: effectiveSettingsExpanded ? 1 : 0
        }}
        transition={{
          duration: 0.4,
          ease: [0.32, 0.72, 0, 1]
        }}
        style={{ pointerEvents: effectiveSettingsExpanded ? 'auto' : 'none' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.subPanelContent}>
          {/* Settings content */}
        </div>
      </motion.div>

      {/* Help Sub-Panel */}
      <motion.div
        className={styles.settingsSubPanel}
        initial={false}
        animate={{
          x: effectiveHelpExpanded ? 0 : '-100%',
          opacity: effectiveHelpExpanded ? 1 : 0
        }}
        transition={{
          duration: 0.4,
          ease: [0.32, 0.72, 0, 1]
        }}
        style={{ pointerEvents: effectiveHelpExpanded ? 'auto' : 'none' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.subPanelContent}>
          {/* Help content */}
        </div>
      </motion.div>

      {/* Profile Sub-Panel */}
      <motion.div
        className={styles.settingsSubPanel}
        initial={false}
        animate={{
          x: effectiveProfileExpanded ? 0 : '-100%',
          opacity: effectiveProfileExpanded ? 1 : 0
        }}
        transition={{
          duration: 0.4,
          ease: [0.32, 0.72, 0, 1]
        }}
        style={{ pointerEvents: effectiveProfileExpanded ? 'auto' : 'none' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.subPanelContent}>
          {/* Profile content */}
        </div>
      </motion.div>
    </>
  )
}
