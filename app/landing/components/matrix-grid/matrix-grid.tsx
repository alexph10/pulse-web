'use client'

import { useEffect, useRef } from 'react'
import styles from './matrix-grid.module.css'

export default function MatrixGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Grid properties
    const gridSize = 20
    const cols = Math.floor(canvas.width / gridSize)
    const rows = Math.floor(canvas.height / gridSize)
    
    // Create dot positions with random activation
    const dots: { x: number; y: number; active: boolean; intensity: number; pulse: number }[] = []
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        dots.push({
          x: i * gridSize,
          y: j * gridSize,
          active: Math.random() > 0.95,
          intensity: Math.random(),
          pulse: Math.random() * Math.PI * 2
        })
      }
    }

    let animationFrame: number

    const animate = () => {
      ctx.fillStyle = 'rgba(56, 95, 82, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'
      ctx.lineWidth = 0.5
      
      for (let i = 0; i <= cols; i++) {
        ctx.beginPath()
        ctx.moveTo(i * gridSize, 0)
        ctx.lineTo(i * gridSize, canvas.height)
        ctx.stroke()
      }
      
      for (let j = 0; j <= rows; j++) {
        ctx.beginPath()
        ctx.moveTo(0, j * gridSize)
        ctx.lineTo(canvas.width, j * gridSize)
        ctx.stroke()
      }

      // Draw animated dots
      dots.forEach((dot) => {
        // Randomly activate/deactivate dots
        if (Math.random() > 0.998) {
          dot.active = !dot.active
        }

        if (dot.active) {
          dot.pulse += 0.05
          const pulseIntensity = (Math.sin(dot.pulse) + 1) / 2
          
          // Mix of lime green and rust colors
          const isLime = dot.intensity > 0.7
          const color = isLime 
            ? `rgba(132, 255, 0, ${pulseIntensity * 0.8})` 
            : `rgba(160, 82, 45, ${pulseIntensity * 0.6})`
          
          ctx.fillStyle = color
          ctx.beginPath()
          ctx.arc(dot.x + gridSize / 2, dot.y + gridSize / 2, 2 + pulseIntensity * 2, 0, Math.PI * 2)
          ctx.fill()

          // Add glow effect
          ctx.shadowBlur = 10
          ctx.shadowColor = color
          ctx.fill()
          ctx.shadowBlur = 0
        }
      })

      animationFrame = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrame)
    }
  }, [])

  return <canvas ref={canvasRef} className={styles.canvas} />
}

