'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'

/**
 * TOAST NOTIFICATION SYSTEM
 * 
 * What is a toast?
 * - Brief message that appears temporarily
 * - Auto-dismisses after a few seconds
 * - Doesn't block user interaction
 * - Shows success/error/info/warning messages
 * 
 * Why do we need this?
 * - Give users instant feedback on actions
 * - Better UX than alert() or console.log()
 * - Consistent notification style across app
 * 
 * Example usage:
 * const { showToast } = useToast()
 * showToast('Journal saved!', 'success')
 */

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
  id: string // Unique identifier
  message: string // What to display
  type: ToastType // Visual style
  duration?: number // How long to show (ms)
}

interface ToastContextType {
  toasts: Toast[] // All active toasts
  showToast: (message: string, type?: ToastType, duration?: number) => void
  hideToast: (id: string) => void
  clearAllToasts: () => void
}

// ═══════════════════════════════════════════════════════════════════════════
// CONTEXT
// ═══════════════════════════════════════════════════════════════════════════

const ToastContext = createContext<ToastContextType | undefined>(undefined)

// ═══════════════════════════════════════════════════════════════════════════
// PROVIDER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  /**
   * Show a new toast notification
   * 
   * @param message - Text to display
   * @param type - Visual style (success, error, info, warning)
   * @param duration - How long to show in milliseconds (default: 4000)
   */
  const showToast = useCallback((
    message: string,
    type: ToastType = 'info',
    duration: number = 4000
  ) => {
    // Generate unique ID
    const id = Math.random().toString(36).substring(2, 9)

    // Create new toast
    const newToast: Toast = {
      id,
      message,
      type,
      duration
    }

    // Add to toasts array
    setToasts((prev) => [...prev, newToast])

    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        hideToast(id)
      }, duration)
    }
  }, [])

  /**
   * Hide a specific toast
   */
  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  /**
   * Clear all toasts
   */
  const clearAllToasts = useCallback(() => {
    setToasts([])
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, showToast, hideToast, clearAllToasts }}>
      {children}
      <ToastContainer toasts={toasts} onClose={hideToast} />
    </ToastContext.Provider>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// CUSTOM HOOK - Easy access to toast functions
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Custom hook to use toast notifications
 * 
 * Usage in any component:
 * ```
 * const { showToast } = useToast()
 * showToast('Success!', 'success')
 * ```
 */
export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

// ═══════════════════════════════════════════════════════════════════════════
// TOAST CONTAINER - Renders all active toasts
// ═══════════════════════════════════════════════════════════════════════════

function ToastContainer({
  toasts,
  onClose
}: {
  toasts: Toast[]
  onClose: (id: string) => void
}) {
  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        maxWidth: '400px',
        pointerEvents: 'none' // Allow clicks to pass through container
      }}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// TOAST ITEM - Individual toast notification
// ═══════════════════════════════════════════════════════════════════════════

function ToastItem({ toast, onClose }: { toast: Toast; onClose: (id: string) => void }) {
  // Get color and icon based on type
  const getStyles = () => {
    switch (toast.type) {
      case 'success':
        return {
          background: 'linear-gradient(135deg, #10B981, #059669)',
          icon: 'SUCCESS'
        }
      case 'error':
        return {
          background: 'linear-gradient(135deg, #EF4444, #DC2626)',
          icon: 'ERROR'
        }
      case 'warning':
        return {
          background: 'linear-gradient(135deg, #F59E0B, #D97706)',
          icon: 'WARNING'
        }
      case 'info':
      default:
        return {
          background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
          icon: 'INFO'
        }
    }
  }

  const styles = getStyles()

  return (
    <div
      style={{
        background: styles.background,
        color: 'white',
        padding: '16px 20px',
        borderRadius: '12px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        minWidth: '300px',
        animation: 'slideIn 0.3s ease-out',
        pointerEvents: 'auto', // Enable clicks on toast itself
        fontFamily: 'var(--font-family-satoshi)'
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          fontWeight: '700',
          flexShrink: 0
        }}
      >
        {styles.icon}
      </div>

      {/* Message */}
      <p
        style={{
          flex: 1,
          margin: 0,
          fontSize: '14px',
          fontWeight: '500',
          lineHeight: '1.4'
        }}
      >
        {toast.message}
      </p>

      {/* Close Button */}
      <button
        onClick={() => onClose(toast.id)}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'white',
          fontSize: '18px',
          cursor: 'pointer',
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '4px',
          transition: 'background 0.2s ease',
          flexShrink: 0
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = 'transparent'
        }}
        aria-label="Close notification"
      >
        ×
      </button>

      {/* Inline animation keyframes */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
