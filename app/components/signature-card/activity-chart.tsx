'use client'

import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { format, subDays } from 'date-fns'
import { useAuth } from '@/app/contexts/AuthContext'
import styles from './activity-chart.module.css'

interface ActivityDataPoint {
  date: Date
  value: number
}

export default function ActivityChart() {
  const { user } = useAuth()
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [activityData, setActivityData] = useState<ActivityDataPoint[]>(() => {
    // Initialize with empty 30 days immediately so chart always renders
    const emptyDays: ActivityDataPoint[] = []
    for (let i = 29; i >= 0; i--) {
      const date = subDays(new Date(), i)
      emptyDays.push({ date, value: 0 })
    }
    return emptyDays
  })

  // Observe container size changes
  useEffect(() => {
    if (!containerRef.current) return

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        setDimensions({ width, height })
      }
    })

    resizeObserver.observe(containerRef.current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  // Fetch activity data
  useEffect(() => {
    if (!user) return

    const fetchActivity = async () => {
      try {
        const response = await fetch('/api/activity')
        if (response.ok) {
          const data = await response.json()
          
          // Build data points for last 30 days
          const points: ActivityDataPoint[] = []
          for (let i = 29; i >= 0; i--) {
            const date = subDays(new Date(), i)
            const dateString = format(date, 'yyyy-MM-dd')
            const dayData = data.activities?.[dateString]
            
            // Total activity count
            const totalActivity = (dayData?.journalCount || 0) + (dayData?.goalsCount || 0)
            points.push({ date, value: totalActivity })
          }
          
          setActivityData(points)
        }
      } catch (error) {
        console.error('Error fetching activity:', error)
      }
    }

    fetchActivity()
  }, [user])

  // Render D3 chart
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return

    const svg = d3.select(svgRef.current)
    const container = containerRef.current
    
    // Clear previous render
    svg.selectAll('*').remove()

    // Get container dimensions with safety checks
    const containerWidth = container.clientWidth
    const containerHeight = container.clientHeight
    
    // Don't render if container has no dimensions yet
    if (containerWidth === 0 || containerHeight === 0) return
    
    // Set explicit SVG dimensions
    svg
      .attr('width', containerWidth)
      .attr('height', containerHeight)
      .attr('viewBox', `0 0 ${containerWidth} ${containerHeight}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')

    const margin = { top: 20, right: 20, bottom: 30, left: 35 }
    const width = containerWidth - margin.left - margin.right
    const height = containerHeight - margin.top - margin.bottom
    
    // Additional safety check for negative dimensions
    if (width <= 0 || height <= 0) return

    // Create main group
    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Scales
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(activityData, d => d.date) as [Date, Date])
      .range([0, width])

    const maxValue = d3.max(activityData, d => d.value) || 10
    const yScale = d3
      .scaleLinear()
      .domain([0, maxValue + 2])
      .range([height, 0])
      .nice()

    // Define gradient
    const gradient = svg
      .append('defs')
      .append('linearGradient')
      .attr('id', 'area-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%')

    gradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#a0522d')
      .attr('stop-opacity', 0.3)

    gradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#a0522d')
      .attr('stop-opacity', 0.05)

    // Gridlines (subtle)
    const gridlines = d3.axisLeft(yScale)
      .tickSize(-width)
      .tickFormat(() => '')
      .ticks(4)

    g.append('g')
      .attr('class', 'grid')
      .call(gridlines)
      .style('stroke', 'rgba(228, 221, 211, 0.08)')
      .style('stroke-width', '0.5px')
      .selectAll('.domain')
      .remove()

    // Area generator
    const area = d3
      .area<ActivityDataPoint>()
      .curve(d3.curveMonotoneX)
      .x(d => xScale(d.date))
      .y0(height)
      .y1(d => yScale(d.value))

    // Line generator
    const line = d3
      .line<ActivityDataPoint>()
      .curve(d3.curveMonotoneX)
      .x(d => xScale(d.date))
      .y(d => yScale(d.value))

    // Draw area with gradient
    g.append('path')
      .datum(activityData)
      .attr('fill', 'url(#area-gradient)')
      .attr('d', area)

    // Draw line
    g.append('path')
      .datum(activityData)
      .attr('fill', 'none')
      .attr('stroke', '#a0522d')
      .attr('stroke-width', 2)
      .attr('d', line)

    // X Axis
    const xAxis = d3
      .axisBottom(xScale)
      .ticks(6)
      .tickFormat((d) => format(d as Date, 'MMM d'))

    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis)
      .style('color', '#8a8684')
      .style('font-size', '11px')
      .selectAll('.domain')
      .style('stroke', 'rgba(228, 221, 211, 0.1)')

    g.selectAll('.tick line')
      .style('stroke', 'rgba(228, 221, 211, 0.1)')

    // Y Axis
    const yAxis = d3
      .axisLeft(yScale)
      .ticks(4)
      .tickFormat(d => d.toString())

    g.append('g')
      .call(yAxis)
      .style('color', '#8a8684')
      .style('font-size', '11px')
      .selectAll('.domain')
      .style('stroke', 'rgba(228, 221, 211, 0.1)')

    g.selectAll('.tick line')
      .style('stroke', 'rgba(228, 221, 211, 0.1)')

  }, [activityData, dimensions])

  return (
    <div ref={containerRef} className={styles.chartContainer}>
      <svg ref={svgRef} className={styles.svg}></svg>
    </div>
  )
}

