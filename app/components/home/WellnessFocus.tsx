'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QuestionMarkCircledIcon, CheckCircledIcon, ArrowUpIcon, CheckIcon, CrossCircledIcon, ArrowRightIcon } from '@radix-ui/react-icons'
import { wellnessFocusItems } from '@/app/constants'
import styles from './WellnessFocus.module.css'

// Smooth spring config for natural motion
const springConfig = {
  type: 'spring' as const,
  stiffness: 400,
  damping: 30,
  mass: 1
}

// Content stagger animation
const contentVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.2 }
  }
}

export default function WellnessFocus() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const [inputValues, setInputValues] = useState<Record<number, string>>({})

  const handleCardClick = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  const handleInputChange = (index: number, value: string) => {
    setInputValues(prev => ({ ...prev, [index]: value }))
  }

  const handleSubmit = (index: number) => {
    if (inputValues[index]?.trim()) {
      console.log('Submitted:', inputValues[index])
      setInputValues(prev => ({ ...prev, [index]: '' }))
      setExpandedIndex(null)
    }
  }

  return (
    <div className={styles.wellnessFocusSection}>
      <div className={styles.wellnessFocusHeader}>
        <span className={styles.wellnessFocusLabel}>
          Your wellness focus: <span>Find Balance</span>
        </span>
      </div>
      <h2 className={styles.wellnessFocusTitle}>
        Build healthy routines, manage stress,
        <br />
        and nurture your emotional wellbeing.
      </h2>
      <p className={styles.wellnessFocusSubtitle}>
        Balance first. Small daily habits and self-compassion make everything else easier.
      </p>

      <div className={styles.wellnessFocusItems}>
        {wellnessFocusItems.map((item, index) => {
          const isExpanded = expandedIndex === index

          return (
            <div
              key={index}
              className={`${styles.wellnessFocusItem} ${styles[item.type]}`}
              onClick={() => handleCardClick(index)}
            >
              {/* Header */}
              <div className={styles.cardHeader}>
                <div className={styles.cardHeaderLeft}>
                  <span className={styles.cardText}>{item.text}</span>
                </div>
                <div className={styles.cardArrow}>
                  <ArrowRightIcon width={24} height={24} />
                </div>
              </div>

              {/* Expanded content with smooth spring animation */}
              <AnimatePresence initial={false} mode="wait">
                {isExpanded && (
                  <motion.div
                    className={styles.cardExpandedContent}
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={springConfig}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <motion.div 
                      className={styles.cardExpandedInner}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={{
                        hidden: { opacity: 0 },
                        visible: { 
                          opacity: 1,
                          transition: { 
                            delay: 0.1,
                            staggerChildren: 0.05
                          }
                        }
                      }}
                    >
                      <motion.p 
                        className={styles.cardDescription}
                        variants={contentVariants}
                      >
                        {item.description}
                      </motion.p>

                      {/* Reflection: Input bar */}
                      {item.type === 'reflection' && (
                        <motion.div 
                          className={styles.cardInputWrapper}
                          variants={contentVariants}
                        >
                          <input
                            type="text"
                            className={styles.cardInput}
                            placeholder="Share your thoughts..."
                            value={inputValues[index] || ''}
                            onChange={(e) => handleInputChange(index, e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSubmit(index)}
                          />
                          <button 
                            className={styles.cardSendButton}
                            onClick={() => handleSubmit(index)}
                            disabled={!inputValues[index]?.trim()}
                          >
                            <ArrowUpIcon width={16} height={16} />
                          </button>
                        </motion.div>
                      )}

                      {/* Task: Action buttons */}
                      {item.type === 'task' && (
                        <motion.div 
                          className={styles.cardActions}
                          variants={contentVariants}
                        >
                          <button className={styles.actionButton} onClick={() => setExpandedIndex(null)}>
                            <span>Add to Daily Goals</span>
                            <CheckCircledIcon width={14} height={14} />
                          </button>
                          <button className={styles.actionButton} onClick={() => setExpandedIndex(null)}>
                            <span>I'm Okay</span>
                            <CheckIcon width={14} height={14} />
                          </button>
                          <button className={styles.actionButtonOutline} onClick={() => setExpandedIndex(null)}>
                            <span>I won't do this</span>
                            <CrossCircledIcon width={14} height={14} />
                          </button>
                        </motion.div>
                      )}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}
