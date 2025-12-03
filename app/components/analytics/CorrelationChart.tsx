'use client'

import { useMemo } from 'react'

interface CorrelationData {
  x: number
  y: number
  label?: string
}

interface CorrelationChartProps {
  data?: CorrelationData[]
  title?: string
  subtitle?: string
  xLabel?: string
  yLabel?: string
  showTrendline?: boolean
}

const DEFAULT_SAMPLE_DATA: CorrelationData[] = Array.from({ length: 30 }, (_, index) => {
  const x = (index + 1) * 0.35 + 2
  const y = x * 0.7 + ((index % 5) - 2) * 0.4 + 2
  return { x, y }
})

export default function CorrelationChart({
  data,
  title = 'Mood vs Activity',
  subtitle = 'Correlation analysis',
  xLabel = 'Daily Activity',
  yLabel = 'Mood Score',
  showTrendline = true,
}: CorrelationChartProps) {
  const displayData = useMemo<CorrelationData[]>(() => {
    if (data && data.length > 0) {
      return data
    }

    return DEFAULT_SAMPLE_DATA
  }, [data])

  if (displayData.length === 0) {
    return (
      <div
        style={{
          padding: '24px',
          borderRadius: '16px',
          background: 'var(--surface-muted)',
          border: '1px solid var(--border-subtle)',
          textAlign: 'center',
          color: 'var(--text-secondary)',
        }}
        role="status"
        aria-live="polite"
      >
        No correlation data available yet.
      </div>
    )
  }

  // Calculate correlation coefficient
  const n = displayData.length
  const sumX = displayData.reduce((sum, d) => sum + d.x, 0)
  const sumY = displayData.reduce((sum, d) => sum + d.y, 0)
  const sumXY = displayData.reduce((sum, d) => sum + d.x * d.y, 0)
  const sumX2 = displayData.reduce((sum, d) => sum + d.x * d.x, 0)
  const sumY2 = displayData.reduce((sum, d) => sum + d.y * d.y, 0)
  
  const denominatorX = n * sumX2 - sumX * sumX
  const denominatorY = n * sumY2 - sumY * sumY
  const denominatorProduct = denominatorX * denominatorY
  const safeDenominator = denominatorProduct <= 0 ? 0 : Math.sqrt(denominatorProduct)
  const correlation = safeDenominator === 0
    ? 0
    : (n * sumXY - sumX * sumY) / safeDenominator

  // Calculate trendline
  const meanX = sumX / n
  const meanY = sumY / n
  const slopeNumerator = displayData.reduce((sum, d) => sum + (d.x - meanX) * (d.y - meanY), 0)
  const slopeDenominator = displayData.reduce((sum, d) => sum + (d.x - meanX) ** 2, 0)
  const rawSlope = slopeDenominator === 0 ? 0 : slopeNumerator / slopeDenominator
  const slope = Number.isFinite(rawSlope) ? rawSlope : 0
  const rawIntercept = meanY - slope * meanX
  const intercept = Number.isFinite(rawIntercept) ? rawIntercept : 0

  // Chart dimensions
  const width = 100
  const height = 100
  const padding = 0

  const maxX = Math.max(...displayData.map(d => d.x), 10)
  const maxY = Math.max(...displayData.map(d => d.y), 10)

  const scaleX = (x: number) => (x / maxX) * (width - padding * 2) + padding
  const scaleY = (y: number) => height - ((y / maxY) * (height - padding * 2) + padding)
  const clampToRange = (value: number) => {
    if (!Number.isFinite(value)) return 0
    if (value < 0) return 0
    if (value > maxY) return maxY
    return value
  }

  const getCorrelationStrength = (r: number) => {
    const abs = Math.abs(r)
    if (abs > 0.7) return 'Strong'
    if (abs > 0.4) return 'Moderate'
    if (abs > 0.2) return 'Weak'
    return 'Very Weak'
  }

  const getCorrelationColor = (r: number) => {
    const abs = Math.abs(r)
    if (abs > 0.7) return '#2d5a3d'
    if (abs > 0.4) return '#d4774a'
    return '#8a9199'
  }

  return (
    <div style={{
      background: '#252c2c',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    }}>
      {/* Header */}
      <div>
        <h3 style={{
          fontSize: '13px',
          fontWeight: '600',
          color: '#e4ddd3',
          fontFamily: 'var(--font-family-satoshi)',
          marginBottom: '2px',
          letterSpacing: '-0.01em'
        }}>
          {title}
        </h3>
        <p style={{
          fontSize: '10px',
          color: '#a39d96',
          fontFamily: 'var(--font-family-satoshi)',
        }}>
          {subtitle}
        </p>
      </div>

      {/* Chart */}
      <div style={{
        position: 'relative',
        paddingLeft: '32px',
        paddingBottom: '24px',
      }}>
        {/* Y-axis label */}
        <div style={{
          position: 'absolute',
          left: '0',
          top: '50%',
          transform: 'translateY(-50%) rotate(-90deg)',
          fontSize: '9px',
          color: '#a39d96',
          fontFamily: 'var(--font-family-satoshi)',
          fontWeight: '500',
          whiteSpace: 'nowrap',
        }}>
          {yLabel}
        </div>

        {/* Chart area */}
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{
            width: '100%',
            height: '200px',
            background: 'rgba(228, 221, 211, 0.03)',
          }}
        >
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((y) => (
            <line
              key={y}
              x1={0}
              y1={y}
              x2={width}
              y2={y}
              stroke="rgba(228, 221, 211, 0.08)"
              strokeWidth="0.5"
            />
          ))}
          {[0, 25, 50, 75, 100].map((x) => (
            <line
              key={x}
              x1={x}
              y1={0}
              x2={x}
              y2={height}
              stroke="rgba(228, 221, 211, 0.08)"
              strokeWidth="0.5"
            />
          ))}

          {showTrendline && (
            <line
              x1={scaleX(0)}
              y1={scaleY(clampToRange(intercept))}
              x2={scaleX(maxX)}
              y2={scaleY(clampToRange(slope * maxX + intercept))}
              stroke={getCorrelationColor(correlation)}
              strokeWidth="1.5"
              strokeDasharray="4 2"
              opacity="0.6"
            />
          )}

          <defs>
            <radialGradient id="dotGradient">
              <stop offset="0%" stopColor="#310b1e" stopOpacity="1" />
              <stop offset="100%" stopColor="#310b1e" stopOpacity="0.5" />
            </radialGradient>
          </defs>
          {displayData.map((point, idx) => (
            <g key={idx}>
              <circle
                cx={scaleX(point.x)}
                cy={scaleY(point.y)}
                r="4"
                fill="#310b1e"
                opacity="0.15"
              />
              <circle
                cx={scaleX(point.x)}
                cy={scaleY(point.y)}
                r="2.5"
                fill="url(#dotGradient)"
              />
            </g>
          ))}
        </svg>

        {/* X-axis label */}
        <div style={{
          textAlign: 'center',
          fontSize: '9px',
          color: '#a39d96',
          fontFamily: 'var(--font-family-satoshi)',
          fontWeight: '500',
          marginTop: '8px',
        }}>
          {xLabel}
        </div>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        paddingTop: '12px',
        borderTop: '1px solid rgba(228, 221, 211, 0.12)',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px',
        }}>
          <div style={{
            fontSize: '18px',
            fontWeight: '600',
            color: getCorrelationColor(correlation),
            fontFamily: 'var(--font-family-satoshi)',
          }}>
            {correlation.toFixed(2)}
          </div>
          <div style={{
            fontSize: '9px',
            color: '#a39d96',
            fontFamily: 'var(--font-family-satoshi)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            Correlation
          </div>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px',
        }}>
          <div style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#e4ddd3',
            fontFamily: 'var(--font-family-satoshi)',
          }}>
            {getCorrelationStrength(correlation)}
          </div>
          <div style={{
            fontSize: '9px',
            color: '#a39d96',
            fontFamily: 'var(--font-family-satoshi)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            Strength
          </div>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px',
        }}>
          <div style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#e4ddd3',
            fontFamily: 'var(--font-family-satoshi)',
          }}>
            {displayData.length}
          </div>
          <div style={{
            fontSize: '9px',
            color: '#a39d96',
            fontFamily: 'var(--font-family-satoshi)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            Data Points
          </div>
        </div>
      </div>
    </div>
  )
}
