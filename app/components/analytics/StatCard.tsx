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
  const isMobile = useMediaQuery({ maxWidth: 767 })
  
  return (
    <div style={{
      background: 'white',
      border: '1px solid var(--border-subtle)',
      borderRadius: '16px',
      padding: isMobile ? '20px' : '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: isMobile ? '10px' : '12px',
      transition: 'all 0.2s ease',
      cursor: 'default'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)'
      e.currentTarget.style.transform = 'translateY(-2px)'
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = 'none'
      e.currentTarget.style.transform = 'translateY(0)'
    }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <span style={{
          fontSize: isMobile ? '13px' : '14px',
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-family-satoshi)',
          fontWeight: '500'
        }}>
          {title}
        </span>
        {icon && (
          <div style={{
            width: isMobile ? '36px' : '40px',
            height: isMobile ? '36px' : '40px',
            borderRadius: '10px',
            background: '#f0fdf4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#10b981'
          }}>
            {icon}
          </div>
        )}
      </div>

      {/* Value */}
      <div style={{
        fontSize: isMobile ? '28px' : '32px',
        fontWeight: '600',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-family-satoshi)',
        lineHeight: '1'
      }}>
        {value}
      </div>

      {/* Footer */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        {trend && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 8px',
            borderRadius: '6px',
            background: trend.isPositive ? '#f0fdf4' : '#fef2f2',
            color: trend.isPositive ? '#10b981' : '#ef4444',
            fontSize: '12px',
            fontWeight: '600'
          }}>
            <span>{trend.isPositive ? '↑' : '↓'}</span>
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
        {subtitle && (
          <span style={{
            fontSize: '13px',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-family-satoshi)'
          }}>
            {subtitle}
          </span>
        )}
      </div>
    </div>
  )
}
