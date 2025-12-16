'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import styles from './ErrorBoundary.module.css'

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
          className={styles.container}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          {/* Error Icon */}
          <div className={styles.iconContainer}>
            <svg
              className={styles.icon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>

          {/* Error Message */}
          <h2 className={styles.title}>
            Something went wrong
          </h2>

          <p className={styles.message}>
            We encountered an unexpected error. Don&apos;t worry—your data is safe. 
            Try refreshing the page or clicking the button below.
          </p>

          {/* Error Details (only in development) */}
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className={styles.details}>
              <summary className={styles.detailsSummary}>
                Error Details (Development Only)
              </summary>
              <pre className={styles.detailsPre}>
                {this.state.error.toString()}
                {this.state.error.stack}
              </pre>
            </details>
          )}

          {/* Action Buttons */}
          <div className={styles.buttonContainer}>
            <button
              onClick={this.handleReset}
              className={styles.buttonPrimary}
              aria-label="Try again to reload the component"
            >
              Try Again
            </button>

            <button
              onClick={() => window.location.href = '/'}
              className={styles.buttonSecondary}
              aria-label="Navigate to home"
            >
              Go to Home
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
