'use client'

import { useContextualUI } from '@/lib/hooks/useContextualUI'
import { getPromptsForTimeOfDay, getPromptCategoryColor, type Prompt } from '@/lib/prompts/contextualPrompts'
import { useState, useEffect } from 'react'
import styles from './ContextualPrompts.module.css'

interface ContextualPromptsProps {
  onPromptSelect: (promptText: string) => void
}

export function ContextualPrompts({ onPromptSelect }: ContextualPromptsProps) {
  const contextualUI = useContextualUI()
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [isExpanded, setIsExpanded] = useState(true)

  useEffect(() => {
    const relevantPrompts = getPromptsForTimeOfDay(contextualUI.timeOfDay, 3)
    setPrompts(relevantPrompts)
  }, [contextualUI.timeOfDay])

  const handlePromptClick = (prompt: Prompt) => {
    onPromptSelect(prompt.text)
  }

  if (prompts.length === 0) {
    return null
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>What is on your mind today?</h3>
        <button
          className={styles.toggleButton}
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label={isExpanded ? 'Collapse prompts' : 'Expand prompts'}
        >
          {isExpanded ? '−' : '+'}
        </button>
      </div>

      {isExpanded && (
        <div className={styles.promptsGrid}>
          {prompts.map((prompt) => {
            const accentColor = getPromptCategoryColor(prompt.category)
            return (
              <button
                key={prompt.id}
                className={styles.promptCard}
                onClick={() => handlePromptClick(prompt)}
                style={{
                  borderLeftColor: accentColor,
                }}
              >
                <div className={styles.promptContent}>
                  <p className={styles.promptText}>{prompt.text}</p>
                  <span className={styles.promptAction} style={{ color: accentColor }}>
                    Use this prompt →
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

