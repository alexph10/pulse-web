'use client'

import { motion } from 'framer-motion'
import styles from './FrameOutlines.module.css'

interface FrameOutlinesProps {
  activePage: 'home' | 'chat' | 'insights' | 'settings'
  chatOpen: boolean
}

export default function FrameOutlines({ activePage, chatOpen }: FrameOutlinesProps) {
  return (
    <>
      {/* Nav border */}
      <div className={styles.navBorder} />

      {/* Animated left vertical outline */}
      <motion.div
        className={styles.leftOutline}
        animate={{
          left: activePage === 'chat' ? '2%' : '16%',
        }}
        transition={{
          type: 'spring',
          damping: 28,
          stiffness: 260,
          mass: 0.9,
        }}
      />

      {/* Animated right vertical outline */}
      <motion.div
        className={styles.rightOutline}
        animate={{
          right: '15%',
          opacity: chatOpen ? 0 : 1,
        }}
        transition={{
          type: 'spring',
          damping: 28,
          stiffness: 260,
          mass: 0.9,
        }}
      />
    </>
  )
}

