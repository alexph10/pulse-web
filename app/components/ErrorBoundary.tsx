'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'

/**
 * ERROR BOUNDARY - Your App's Safety Net
 * 
 * What does this do?
 * - Catches JavaScript errors in child components
 * - Prevents entire app from crashing
 * - Shows fallback UI instead of blank screen
 * - Logs errors for debugging
 * 
 * Why do we need this?
 * Without it: One broken component = entire app dies
 * With it: Broken component shows error message, rest of app works fine
 * 
 * Example:
 * <ErrorBoundary>
 *   <BadgeShowcase /> // If this crashes, only this section breaks
 * </ErrorBoundary>
 */

interface Props {
  children: ReactNode
  fallback?: ReactNode // Custom error UI (optional)
  onError?: (error: Error, errorInfo: ErrorInfo) => void // Custom error handler (optional)
}

interface State {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null
    }
  }

  /**
   * This method is called when an error is thrown
   * It updates state to show fallback UI
   */
  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    }
  }

  /**
   * This method logs error details
   * Called after an error is caught
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to console in development
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // TODO: Send to error logging service (Sentry, LogRocket, etc.)
    // Example: logErrorToService(error, errorInfo)
  }

  /**
   * Reset error state and try again
   */
  handleReset = () => {
    this.setState({
      hasError: false,
      error: null
    })
  }

  render() {
    if (this.state.hasError) {
      // If custom fallback provided, use it
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default fallback UI
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            padding: '40px',
            textAlign: 'center',
            background: 'var(--surface)',
            borderRadius: '12px',
            border: '1px solid var(--border-subtle)',
            margin: '20px'
          }}
        >
          {/* Error Icon */}
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '24px'
            }}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#EF4444"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>

          {/* Error Message */}
          <h2
            style={{
              fontSize: '24px',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: '8px',
              fontFamily: 'var(--font-family-satoshi)'
            }}
          >
            Something went wrong
          </h2>

          <p
            style={{
              fontSize: '15px',
              color: 'var(--text-secondary)',
              marginBottom: '24px',
              maxWidth: '500px',
              lineHeight: '1.6',
              fontFamily: 'var(--font-family-satoshi)'
            }}
          >
            We encountered an unexpected error. Don't worry—your data is safe. 
            Try refreshing the page or clicking the button below.
          </p>

          {/* Error Details (only in development) */}
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details
              style={{
                marginBottom: '24px',
                padding: '16px',
                background: 'var(--background)',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                textAlign: 'left',
                maxWidth: '600px',
                width: '100%'
              }}
            >
              <summary
                style={{
                  cursor: 'pointer',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  marginBottom: '8px',
                  fontFamily: 'var(--font-family-satoshi)'
                }}
              >
                Error Details (Development Only)
              </summary>
              <pre
                style={{
                  fontSize: '13px',
                  color: '#EF4444',
                  overflow: 'auto',
                  fontFamily: 'monospace',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}
              >
                {this.state.error.toString()}
                {this.state.error.stack}
              </pre>
            </details>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={this.handleReset}
              style={{
                padding: '12px 24px',
                background: 'var(--accent-primary)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: 'var(--font-family-satoshi)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(139, 92, 246, 0.3)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              Try Again
            </button>

            <button
              onClick={() => window.location.href = '/dashboard'}
              style={{
                padding: '12px 24px',
                background: 'var(--surface)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: 'var(--font-family-satoshi)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.1)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      )
    }

    // No error? Render children normally
    return this.props.children
  }
}

export default ErrorBoundary
