'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import styles from './PulseAIChatPanel.module.css'

type Role = 'user' | 'assistant'

interface ChatMessage {
  role: Role
  content: string
}

interface PulseAIChatPanelProps {
  isOpen: boolean
  onClose: () => void
}

interface ChatResponse {
  reply: string
  requestId: string | null
}

export function PulseAIChatPanel({ isOpen, onClose }: PulseAIChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastRequestId, setLastRequestId] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages.length])

  const handleSend = useCallback(async () => {
    const trimmed = input.trim()
    if (!trimmed || isSending) return

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: 'user', content: trimmed },
    ]

    setMessages(nextMessages)
    setInput('')
    setIsSending(true)
    setError(null)

    try {
      const body = {
        messages: nextMessages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        mode: 'journal_insights' as const,
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const text = await response.text().catch(() => '')
        console.error('Chat API error:', response.status, text)
        setError('The assistant is unavailable right now. Please try again.')
        return
      }

      const data = (await response.json()) as ChatResponse | { error: string }

      if ('error' in data) {
        setError(data.error || 'The assistant could not respond.')
        return
      }

      setLastRequestId(data.requestId ?? null)

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.reply },
      ])
    } catch (err) {
      console.error('Chat send error:', err)
      setError('Network error while talking to the assistant.')
    } finally {
      setIsSending(false)
    }
  }, [input, isSending, messages])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      void handleSend()
    }
  }

  if (!isOpen) return null

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.panel}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Pulse AI</h2>
            <p className={styles.subtitle}>
              Reflect on your mood, habits, and patterns with a gentle assistant.
            </p>
          </div>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close Pulse AI"
          >
            ×
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.messages} ref={scrollRef}>
            {messages.length === 0 && (
              <div className={styles.emptyState}>
                <p className={styles.emptyTitle}>Start a conversation</p>
                <p className={styles.emptyText}>
                  Ask about your recent trends, streaks, or how you&apos;ve been feeling.
                  Your data never leaves Pulse except in anonymized, minimal form for AI.
                </p>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={
                  message.role === 'user'
                    ? styles.userMessage
                    : styles.assistantMessage
                }
              >
                <p className={styles.messageText}>{message.content}</p>
              </div>
            ))}
          </div>

          <div className={styles.footer}>
            {error && (
              <div className={styles.error} role="alert">
                {error}
                {lastRequestId && (
                  <span className={styles.requestId}>
                    Ref: {lastRequestId}
                  </span>
                )}
              </div>
            )}

            <div className={styles.inputRow}>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Pulse about your recent mood or goals..."
                className={styles.textarea}
                rows={2}
              />
              <button
                type="button"
                className={styles.sendButton}
                onClick={handleSend}
                disabled={isSending || !input.trim()}
              >
                {isSending ? 'Sending…' : 'Send'}
              </button>
            </div>

            <p className={styles.disclaimer}>
              Pulse AI is for reflection only and does not provide medical advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}






