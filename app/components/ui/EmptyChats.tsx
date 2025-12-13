"use client"
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from '@/app/page.module.css'

type Thread = {
  id: string
  title: string
  preview: string[]
  timestamp: string
}

type Props = {
  onStart?: () => void
  visible?: boolean
  threads?: Thread[]
}

// Sample threads for demo - pass empty array [] to show "Chat History Empty"
const sampleThreads: Thread[] = [
  {
    id: '1',
    title: "You've been feeling anxious lately, but is it getting better?",
    preview: [
      'Based on your recent check-ins,',
      'your anxiety has decreased 15% this week.',
      'Consider continuing your morning',
      'breathing exercises for best results.'
    ],
    timestamp: 'Just now'
  },
  {
    id: '2',
    title: "Your sleep patterns are improving, here's what's working",
    preview: [
      'Over the past two weeks,',
      'your average sleep has increased to 7.2 hours.',
      'The evening wind-down routine',
      'seems to be making a difference.'
    ],
    timestamp: '2 hours ago'
  },
  {
    id: '3',
    title: "Let's talk about your stress levels at work",
    preview: [
      'I noticed your stress peaks',
      'around midweek, especially Wednesdays.',
      'Would you like to explore',
      'some coping strategies together?'
    ],
    timestamp: 'Yesterday'
  },
  {
    id: '4',
    title: "Great progress on your mindfulness streak!",
    preview: [
      'You\'ve completed 12 consecutive days',
      'of mindfulness practice.',
      'This consistency is building',
      'lasting mental wellness habits.'
    ],
    timestamp: 'Dec 9, 2025'
  }
]

// Animation variants for container - fast stagger like home page cards
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.02
    }
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1
    }
  }
}

// Animation variants for each card - snappy animations
const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 10
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.2,
      ease: 'easeOut' as const
    }
  },
  exit: { 
    opacity: 0, 
    y: -5,
    transition: {
      duration: 0.15,
      ease: 'easeOut' as const
    }
  }
}

export default function EmptyChats({ onStart, visible = true, threads = sampleThreads }: Props) {
  if (!visible) return null

  // Show empty state if no threads
  if (threads.length === 0) {
    return (
      <motion.section
        className={styles.emptyState}
        role="status"
        aria-live="polite"
        aria-label="Chat history empty"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <p className={styles.emptyLabel}>Chat History Empty</p>
      </motion.section>
    )
  }

  // Show thread cards with animations
  return (
    <AnimatePresence mode="wait">
      <motion.div 
        className={styles.chatHistoryContainer}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {threads.map((thread) => (
          <motion.div 
            key={thread.id} 
            className={styles.threadCard}
            onClick={onStart}
            variants={cardVariants}
            whileHover={{ 
              x: 3,
              transition: { duration: 0.12 }
            }}
          >
            <p className={styles.threadCardTimestamp}>{thread.timestamp}</p>
            <h3 className={styles.threadCardTitle}>{thread.title}</h3>
            <p className={styles.threadCardPreview}>
              {thread.preview.map((segment, i) => (
                <span key={i}>{segment}{i < thread.preview.length - 1 ? ' ' : ''}</span>
              ))}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  )
}
