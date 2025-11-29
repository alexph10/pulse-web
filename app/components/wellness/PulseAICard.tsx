'use client'

import { useState } from 'react'
import { PaperPlaneTilt } from '@phosphor-icons/react'
import { PulseAIChatPanel } from '../ui/PulseAIChatPanel'
import styles from './PulseAICard.module.css'

export default function PulseAICard() {
  const [showChatPanel, setShowChatPanel] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const prompts = [
    "Why is my mood low?",
    "Am I balanced now?",
    "How's my recovery today?"
  ]

  const handlePromptClick = (prompt: string) => {
    setInputValue(prompt)
    setShowChatPanel(true)
  }

  return (
    <>
      <div className={styles.card}>
        <div className={styles.header}>
          <div>
            <h3 className={styles.title}>Pulse</h3>
            <p className={styles.subtitle}>Your personal AI assistant</p>
          </div>
          <div className={styles.statusDot} />
        </div>

        <div className={styles.illustration}>
          <div className={styles.lotus}>
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="60" cy="60" r="50" fill="url(#lotusGradient)" opacity="0.8" />
              <defs>
                <radialGradient id="lotusGradient" cx="50%" cy="50%">
                  <stop offset="0%" stopColor="#D97706" stopOpacity="1" />
                  <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#92400E" stopOpacity="0.4" />
                </radialGradient>
              </defs>
              <path d="M60 20 L65 50 L60 60 L55 50 Z" fill="#D97706" opacity="0.9" />
              <path d="M60 20 L70 45 L60 60 L50 45 Z" fill="#F59E0B" opacity="0.8" />
              <path d="M60 20 L75 40 L60 60 L45 40 Z" fill="#D97706" opacity="0.7" />
              <circle cx="60" cy="60" r="8" fill="#92400E" opacity="0.6" />
            </svg>
          </div>
        </div>

        <div className={styles.prompts}>
          {prompts.map((prompt, index) => (
            <button
              key={index}
              className={styles.promptButton}
              onClick={() => handlePromptClick(prompt)}
            >
              {prompt}
            </button>
          ))}
        </div>

        <div className={styles.inputContainer}>
          <input
            type="text"
            placeholder="Ask something..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && inputValue.trim()) {
                setShowChatPanel(true)
              }
            }}
            className={styles.input}
          />
          <button
            className={styles.sendButton}
            onClick={() => inputValue.trim() && setShowChatPanel(true)}
            aria-label="Send message"
          >
            <PaperPlaneTilt size={16} weight="regular" />
          </button>
        </div>
      </div>

      <PulseAIChatPanel
        isOpen={showChatPanel}
        onClose={() => {
          setShowChatPanel(false)
          setInputValue('')
        }}
      />
    </>
  )
}





