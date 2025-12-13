'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QuestionMarkCircledIcon, CheckCircledIcon, Cross2Icon, ArrowUpIcon, CheckIcon, CrossCircledIcon } from '@radix-ui/react-icons'
import styles from './CardChatOverlay.module.css'

export type CardType = 'reflection' | 'task' | 'question'

interface CardChatOverlayProps {
  isOpen: boolean
  onClose: () => void
  type?: CardType
  title?: string
  description?: string
}

// Icon component based on type
function TypeIcon({ type }: { type: CardType }) {
  if (type === 'task') {
    return <CheckCircledIcon width={18} height={18} />
  }
  return <QuestionMarkCircledIcon width={18} height={18} />
}

// Get label text based on type
function getTypeLabel(type: CardType): string {
  switch (type) {
    case 'reflection':
      return 'Reflection'
    case 'task':
      return 'Task'
    case 'question':
      return 'Question'
    default:
      return 'Question'
  }
}

export default function CardChatOverlay({ 
  isOpen, 
  onClose, 
  type = 'reflection',
  title = '',
  description = ''
}: CardChatOverlayProps) {
  const [inputValue, setInputValue] = useState('')

  if (!isOpen) return null

  const handleSubmit = () => {
    if (inputValue.trim()) {
      // Handle submission
      console.log('Submitted:', inputValue)
      setInputValue('')
      onClose()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className={styles.cardOverlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        onClick={onClose}
      >
        <motion.div
          className={`${styles.cardOverlayPanel} ${styles[type]}`}
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={styles.cardOverlayHeader}>
            <div className={styles.cardOverlayHeaderLeft}>
              <div className={`${styles.cardOverlayIcon} ${styles[type]}`}>
                <TypeIcon type={type} />
              </div>
              <span className={styles.cardOverlayLabel}>
                {getTypeLabel(type)}
              </span>
            </div>
            <button className={styles.cardOverlayClose} onClick={onClose} aria-label="Close">
              <Cross2Icon width={18} height={18} />
            </button>
          </div>

          {/* Content */}
          <div className={styles.cardOverlayContent}>
            {title && <h2 className={styles.cardOverlayTitle}>{title}</h2>}
            
            {description && (
              <p className={styles.cardOverlayDescription}>{description}</p>
            )}

            {/* Task-specific buttons */}
            {type === 'task' && (
              <div className={styles.cardOverlayActions}>
                <button className={styles.actionButtonPrimary} onClick={onClose}>
                  <span>Add to Daily Goals</span>
                  <CheckCircledIcon width={16} height={16} />
                </button>
                <button className={styles.actionButtonSecondary} onClick={onClose}>
                  <span>I'm Okay</span>
                  <CheckIcon width={16} height={16} />
                </button>
                <button className={styles.actionButtonTertiary} onClick={onClose}>
                  <span>I won't do this</span>
                  <CrossCircledIcon width={16} height={16} />
                </button>
              </div>
            )}
          </div>

          {/* Input for Reflection and Question types */}
          {(type === 'reflection' || type === 'question') && (
            <div className={styles.cardOverlayInputContainer}>
              <div className={styles.cardOverlayInput}>
                <input 
                  type="text" 
                  placeholder={type === 'reflection' ? 'Share your thoughts...' : 'Ask a question...'}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button 
                  className={styles.cardOverlaySendButton}
                  onClick={handleSubmit}
                  disabled={!inputValue.trim()}
                  aria-label="Send"
                >
                  <ArrowUpIcon width={18} height={18} />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
