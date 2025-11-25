'use client'

interface ProgressRingProps {
  progress: number // 0-100
  size?: 'sm' | 'md' | 'lg'
  strokeWidth?: number
  color?: string
  showLabel?: boolean
  label?: string
}

const sizeMap = {
  sm: 48,
  md: 80,
  lg: 120,
}

const strokeWidthMap = {
  sm: 4,
  md: 6,
  lg: 8,
}

export default function ProgressRing({
  progress,
  size = 'md',
  strokeWidth,
  color = 'var(--accent-primary)',
  showLabel = true,
  label,
}: ProgressRingProps) {
  const dimension = sizeMap[size]
  const stroke = strokeWidth || strokeWidthMap[size]
  const radius = (dimension - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference

  return (
    <div
      style={{
        position: 'relative',
        width: dimension,
        height: dimension,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg
        width={dimension}
        height={dimension}
        style={{
          transform: 'rotate(-90deg)',
        }}
      >
        {/* Background circle */}
        <circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          fill="none"
          stroke="rgba(228, 221, 211, 0.12)"
          strokeWidth={stroke}
        />
        
        {/* Progress circle */}
        <circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="square"
          style={{
            transition: 'stroke-dashoffset 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </svg>

      {/* Center label */}
      {showLabel && (
        <div
          style={{
            position: 'absolute',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontSize: size === 'sm' ? '12px' : size === 'md' ? '16px' : '24px',
              fontWeight: '600',
              color: '#e4ddd3',
              fontFamily: 'var(--font-family-satoshi)',
              lineHeight: '1',
            }}
          >
            {Math.round(progress)}%
          </span>
          {label && (
            <span
              style={{
                fontSize: size === 'sm' ? '8px' : size === 'md' ? '10px' : '12px',
                color: '#a39d96',
                fontFamily: 'var(--font-family-satoshi)',
                marginTop: '2px',
              }}
            >
              {label}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
