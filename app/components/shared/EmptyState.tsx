'use client'

import React from 'react'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'

type IllustrationType = 'noData' | 'noEntries' | 'loading' | 'journal' | 'goals' | 'notes'

interface EmptyStateAction {
  text: string
  onClick: () => void
}

interface EmptyStateProps {
  title: string
  description: string
  action?: EmptyStateAction
  illustration?: IllustrationType
}

export default function EmptyState({ 
  title, 
  description, 
  action,
  illustration = 'noData' 
}: EmptyStateProps) {
  
  const renderIllustration = () => {
    if (illustration === 'noEntries') {
      return (
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="80" stroke="var(--border-subtle)" strokeWidth="2" strokeDasharray="8 8"/>
          <path d="M100 60V100L120 120" stroke="var(--accent-primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="100" cy="100" r="8" fill="var(--accent-primary)"/>
        </svg>
      )
    }
    
    if (illustration === 'loading') {
      return (
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="80" stroke="var(--border-subtle)" strokeWidth="2"/>
          <circle cx="100" cy="100" r="60" stroke="var(--accent-primary)" strokeWidth="2" strokeDasharray="8 8">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 100 100"
              to="360 100 100"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      )
    }

    if (illustration === 'journal') {
      return (
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="50" y="40" width="100" height="120" rx="8" stroke="var(--border-subtle)" strokeWidth="2" fill="var(--surface)"/>
          <line x1="70" y1="70" x2="130" y2="70" stroke="var(--border-subtle)" strokeWidth="2" strokeLinecap="round"/>
          <line x1="70" y1="90" x2="130" y2="90" stroke="var(--border-subtle)" strokeWidth="2" strokeLinecap="round"/>
          <line x1="70" y1="110" x2="120" y2="110" stroke="var(--border-subtle)" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="100" cy="140" r="20" fill="var(--accent-primary)" opacity="0.2"/>
          <path d="M95 140L100 145L105 140" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
      )
    }

    if (illustration === 'goals') {
      return (
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="80" r="30" stroke="var(--accent-primary)" strokeWidth="3" fill="none"/>
          <path d="M85 80L95 90L115 70" stroke="var(--accent-primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="100" y1="110" x2="100" y2="150" stroke="var(--border-subtle)" strokeWidth="2" strokeLinecap="round"/>
          <line x1="70" y1="150" x2="130" y2="150" stroke="var(--border-subtle)" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    }

    if (illustration === 'notes') {
      return (
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="60" y="50" width="80" height="100" rx="4" stroke="var(--border-subtle)" strokeWidth="2" fill="var(--surface)"/>
          <line x1="75" y1="75" x2="125" y2="75" stroke="var(--border-subtle)" strokeWidth="2" strokeLinecap="round"/>
          <line x1="75" y1="95" x2="125" y2="95" stroke="var(--border-subtle)" strokeWidth="2" strokeLinecap="round"/>
          <line x1="75" y1="115" x2="110" y2="115" stroke="var(--border-subtle)" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="100" cy="135" r="8" fill="var(--accent-primary)" opacity="0.3"/>
        </svg>
      )
    }
    
    return (
      <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="40" y="60" width="120" height="100" rx="8" stroke="var(--border-subtle)" strokeWidth="2"/>
        <line x1="60" y1="85" x2="140" y2="85" stroke="var(--border-subtle)" strokeWidth="2" strokeLinecap="round"/>
        <line x1="60" y1="105" x2="120" y2="105" stroke="var(--border-subtle)" strokeWidth="2" strokeLinecap="round"/>
        <line x1="60" y1="125" x2="130" y2="125" stroke="var(--border-subtle)" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="100" cy="105" r="30" fill="var(--accent-muted)" stroke="var(--accent-primary)" strokeWidth="2"/>
        <path d="M85 105L95 115L115 95" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }

  return (
    <Card
      elevation={0}
      className=""
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--spacing-5xl) var(--spacing-3xl)',
        textAlign: 'center',
        minHeight: '400px',
        background: 'transparent',
        border: 'none'
      }}
    >
      <div style={{
        marginBottom: '32px',
        opacity: 0.8,
        animation: 'fadeIn 0.6s ease-in-out'
      }}>
        {renderIllustration()}
      </div>
      
      <h3 style={{
        fontFamily: 'var(--font-family-satoshi)',
        fontSize: '24px',
        fontWeight: '600',
        color: 'var(--text-primary)',
        marginBottom: '12px',
        letterSpacing: '-0.01em'
      }}>
        {title}
      </h3>
      
      <p style={{
        fontFamily: 'var(--font-family-switzer)',
        fontSize: '15px',
        color: 'var(--text-tertiary)',
        marginBottom: action ? '32px' : '0',
        maxWidth: '400px',
        lineHeight: '1.6'
      }}>
        {description}
      </p>
      
      {action && (
        <Button
          variant="primary"
          onClick={action.onClick}
        >
          {action.text}
        </Button>
      )}
      
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 0.8;
            transform: translateY(0);
          }
        }
      `}</style>
    </Card>
  )
}
