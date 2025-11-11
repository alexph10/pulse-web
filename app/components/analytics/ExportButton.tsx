'use client'

import React, { useState } from 'react'

interface ExportButtonProps {
  onExport: () => Promise<void>
  disabled?: boolean
}

export default function ExportButton({ onExport, disabled }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleClick = async () => {
    if (disabled || isExporting) return

    setIsExporting(true)
    try {
      await onExport()
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isExporting}
      style={{
        background: disabled || isExporting ? '#A0AEC0' : '#8B2F2F',
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        padding: '12px 24px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: disabled || isExporting ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s ease-in-out',
        fontFamily: 'Satoshi, sans-serif',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        opacity: disabled || isExporting ? 0.7 : 1
      }}
      onMouseEnter={(e) => {
        if (!disabled && !isExporting) {
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = '0 8px 16px rgba(139, 47, 47, 0.2)'
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !isExporting) {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = 'none'
        }
      }}
    >
      {isExporting ? (
        <>
          <div style={{
            width: '16px',
            height: '16px',
            border: '2px solid white',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.6s linear infinite'
          }} />
          Exporting...
        </>
      ) : (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Export PDF
        </>
      )}
      
      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </button>
  )
}
