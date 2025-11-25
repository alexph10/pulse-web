'use client'

interface DataPoint {
  date: Date
  value: number
}

interface MoodTrendProps {
  data?: DataPoint[]
  width?: number
  height?: number
}

export default function MoodTrend({ data, width = 400, height = 100 }: MoodTrendProps) {
  // Generate sample data for last 30 days
  const sampleData: DataPoint[] = data || Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000),
    value: 5 + Math.random() * 4 + Math.sin(i / 5) * 2
  }))

  const displayData = data || sampleData

  // Calculate SVG path
  const padding = 20
  const graphWidth = width - padding * 2
  const graphHeight = height - padding * 2

  const minValue = 0
  const maxValue = 10

  const points = displayData.map((point, index) => {
    const x = padding + (index / (displayData.length - 1)) * graphWidth
    const y = padding + graphHeight - ((point.value - minValue) / (maxValue - minValue)) * graphHeight
    return { x, y, value: point.value }
  })

  const pathD = points.reduce((acc, point, index) => {
    if (index === 0) {
      return `M ${point.x},${point.y}`
    }
    return `${acc} L ${point.x},${point.y}`
  }, '')

  // Calculate average
  const average = displayData.reduce((sum, p) => sum + p.value, 0) / displayData.length

  return (
    <div style={{
      background: '#252c2c',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}>
        <div>
          <h3 style={{
            fontSize: '13px',
            fontWeight: '600',
            color: '#e4ddd3',
            fontFamily: 'var(--font-family-satoshi)',
            marginBottom: '2px',
            letterSpacing: '-0.01em'
          }}>
            Mood Trend
          </h3>
          <p style={{
            fontSize: '10px',
            color: '#a39d96',
            fontFamily: 'var(--font-family-satoshi)',
          }}>
            Last 30 days
          </p>
        </div>
        <div style={{
          textAlign: 'right',
        }}>
          <div style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#e4ddd3',
            fontFamily: 'var(--font-family-satoshi)',
            lineHeight: '1',
            letterSpacing: '-0.02em',
          }}>
            {average.toFixed(1)}
          </div>
          <div style={{
            fontSize: '10px',
            color: '#a39d96',
            fontFamily: 'var(--font-family-satoshi)',
            marginTop: '4px',
          }}>
            average
          </div>
        </div>
      </div>

      {/* Graph */}
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ overflow: 'visible' }}
      >
        {/* Grid lines */}
        {[0, 2.5, 5, 7.5, 10].map((value) => {
          const y = padding + graphHeight - ((value - minValue) / (maxValue - minValue)) * graphHeight
          return (
            <line
              key={value}
              x1={padding}
              y1={y}
              x2={width - padding}
              y2={y}
              stroke="rgba(228, 221, 211, 0.08)"
              strokeWidth="1"
            />
          )
        })}

        {/* Area under curve */}
        <path
          d={`${pathD} L ${points[points.length - 1].x},${padding + graphHeight} L ${padding},${padding + graphHeight} Z`}
          fill="rgba(45, 90, 61, 0.15)"
        />

        {/* Line with glow effect */}
        <path
          d={pathD}
          fill="none"
          stroke="#2d5a3d"
          strokeWidth="2"
          strokeLinecap="square"
        />

        {/* Average line */}
        <line
          x1={padding}
          y1={padding + graphHeight - ((average - minValue) / (maxValue - minValue)) * graphHeight}
          x2={width - padding}
          y2={padding + graphHeight - ((average - minValue) / (maxValue - minValue)) * graphHeight}
          stroke="#a39d96"
          strokeWidth="1"
          strokeDasharray="4 4"
        />

        {/* Data points */}
        {points.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="3"
            fill="#2d5a3d"
            stroke="#252c2c"
            strokeWidth="2"
          />
        ))}
      </svg>
    </div>
  )
}
