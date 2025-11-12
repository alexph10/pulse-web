'use client'

import React from 'react'

type IllustrationType = 'noData' | 'noEntries' | 'loading'

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
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 40px',
      textAlign: 'center',
      minHeight: '400px'
    }}>
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
        <button
          onClick={action.onClick}
          style={{
            background: 'var(--accent-primary)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '10px',
            padding: '12px 24px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontFamily: 'var(--font-family-satoshi)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--accent-primary-hover)'
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = 'var(--shadow-md)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--accent-primary)'
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          {action.text}
        </button>
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
    </div>
  )
}
