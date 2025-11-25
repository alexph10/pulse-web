'use client'

import { useMediaQuery } from '@/app/hooks/useMediaQuery'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  icon?: React.ReactNode
}

export default function StatCard({ title, value, subtitle, trend, icon }: StatCardProps) {
  const isMobile = useMediaQuery('(max-width: 767px)')
  
  return (
    <div style={{
      background: '#252c2c',
      border: 'none',
      borderRadius: '0',
      padding: isMobile ? '16px' : '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: isMobile ? '10px' : '12px',
      transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'default',
    }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <span style={{
          fontSize: isMobile ? '10px' : '11px',
          color: '#a39d96',
          fontFamily: 'var(--font-family-satoshi)',
          fontWeight: '400',
          letterSpacing: '-0.01em',
          lineHeight: '1.4'
        }}>
          {title}
        </span>
        {icon && (
          <div style={{
            width: '16px',
            height: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#a39d96'
          }}>
            {icon}
          </div>
        )}
      </div>

      {/* Value */}
      <div style={{
        fontSize: isMobile ? '28px' : '32px',
        fontWeight: '600',
        color: '#e4ddd3',
        fontFamily: 'var(--font-family-satoshi)',
        lineHeight: '1',
        letterSpacing: '-0.02em'
      }}>
        {value}
      </div>

      {/* Footer */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        {subtitle && (
          <span style={{
            fontSize: '10px',
            color: '#a39d96',
            fontFamily: 'var(--font-family-satoshi)',
            fontWeight: '400'
          }}>
            {subtitle}
          </span>
        )}
      </div>
    </div>
  )
}
