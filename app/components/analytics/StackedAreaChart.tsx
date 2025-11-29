'use client'

interface AreaSeries {
  name: string
  color: string
  data: number[]
}

interface StackedAreaChartProps {
  series?: AreaSeries[]
  labels?: string[]
  title?: string
  subtitle?: string
}

// Generate sample data at module level
const generateSampleSeries = (): AreaSeries[] => [
  {
    name: 'Journal',
    color: '#2d5a3d',
    data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 3) + 1),
  },
  {
    name: 'Goals',
    color: '#d4774a',
    data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 2) + 1),
  },
  {
    name: 'Habits',
    color: '#8a9199',
    data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 2)),
  },
];

const defaultSampleSeries = generateSampleSeries();
const defaultSampleLabels = Array.from({ length: 30 }, (_, idx) => `Day ${idx + 1}`);

export default function StackedAreaChart({
  series,
  labels,
  title = 'Activity Trends',
  subtitle = 'Cumulative activity over time',
}: StackedAreaChartProps) {
  const sampleSeries = series || defaultSampleSeries
  const sampleLabels = labels || defaultSampleLabels

  const displaySeries = series || sampleSeries
  const displayLabels = labels || sampleLabels

  // Calculate stacked values
  const stackedData = displayLabels.map((_, idx) => {
    let cumulative = 0
    return displaySeries.map(s => {
      cumulative += s.data[idx]
      return cumulative
    })
  })

  const maxValue = Math.max(...stackedData.flat(), 1)

  // Chart dimensions
  const width = 100
  const height = 100
  const padding = 2

  const scaleX = (index: number) => 
    (index / (displayLabels.length - 1)) * (width - padding * 2) + padding
  const scaleY = (value: number) => 
    height - ((value / maxValue) * (height - padding * 2) + padding)

  // Generate path for each series
  const generatePath = (seriesIndex: number) => {
    const points = displayLabels.map((_, idx) => ({
      x: scaleX(idx),
      y: scaleY(stackedData[idx][seriesIndex]),
    }))

    const basePoints = displayLabels.map((_, idx) => ({
      x: scaleX(idx),
      y: seriesIndex === 0 ? height : scaleY(stackedData[idx][seriesIndex - 1]),
    }))

    const topPath = points.map((p, idx) => 
      `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
    ).join(' ')

    const bottomPath = basePoints.reverse().map((p) => 
      `L ${p.x} ${p.y}`
    ).join(' ')

    return `${topPath} ${bottomPath} Z`
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
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{
          width: '100%',
          height: '160px',
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
            strokeWidth="0.3"
          />
        ))}

        {/* Gradients for each series */}
        <defs>
          {displaySeries.map((s, idx) => (
            <linearGradient key={idx} id={`gradient-${idx}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={s.color} stopOpacity="0.9" />
              <stop offset="100%" stopColor={s.color} stopOpacity="0.4" />
            </linearGradient>
          ))}
        </defs>

        {/* Areas (render in reverse order so bottom series is on top visually) */}
        {displaySeries.map((s, idx) => (
          <path
            key={idx}
            d={generatePath(idx)}
            fill={`url(#gradient-${idx})`}
            style={{
              transition: 'opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.95'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1'
            }}
          />
        ))}

        {/* Hover overlay for interactivity */}
        {displayLabels.map((_, idx) => (
          <rect
            key={idx}
            x={scaleX(idx) - 1.5}
            y={0}
            width={3}
            height={height}
            fill="transparent"
            style={{ cursor: 'default' }}
          />
        ))}
      </svg>

      {/* Legend */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '16px',
        paddingTop: '8px',
        borderTop: '1px solid rgba(228, 221, 211, 0.12)',
      }}>
        {displaySeries.map((s, idx) => {
          const total = s.data.reduce((sum, val) => sum + val, 0)
          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <div style={{
                width: '12px',
                height: '8px',
                background: s.color,
              }} />
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '4px',
              }}>
                <span style={{
                  fontSize: '11px',
                  color: '#e4ddd3',
                  fontFamily: 'var(--font-family-satoshi)',
                  fontWeight: '500',
                }}>
                  {s.name}
                </span>
                <span style={{
                  fontSize: '9px',
                  color: '#a39d96',
                  fontFamily: 'var(--font-family-satoshi)',
                }}>
                  ({total})
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
