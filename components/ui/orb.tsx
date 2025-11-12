"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface OrbProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number
  color?: string
  intensity?: number
  animated?: boolean
}

const Orb = React.forwardRef<HTMLDivElement, OrbProps>(
  (
    { className, size = 200, color = "#B91C1C", intensity = 1, animated = true, ...props },
    ref
  ) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null)
    const animationRef = React.useRef<number | undefined>(undefined)

    React.useEffect(() => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      canvas.width = size
      canvas.height = size

      let time = 0

      const drawOrb = () => {
        if (!ctx) return

        ctx.clearRect(0, 0, size, size)

        const centerX = size / 2
        const centerY = size / 2
        const baseRadius = size / 3

        // Animate radius with sine wave
        const radius = animated
          ? baseRadius + Math.sin(time * 0.05) * (10 * intensity)
          : baseRadius

        // Create radial gradient
        const gradient = ctx.createRadialGradient(
          centerX,
          centerY,
          radius * 0.3,
          centerX,
          centerY,
          radius
        )

        gradient.addColorStop(0, `${color}FF`)
        gradient.addColorStop(0.5, `${color}AA`)
        gradient.addColorStop(1, `${color}00`)

        // Draw main orb
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
        ctx.fill()

        // Draw secondary glow with animation
        if (animated) {
          const glowRadius = radius + Math.sin(time * 0.08) * (15 * intensity)
          const glowGradient = ctx.createRadialGradient(
            centerX,
            centerY,
            radius * 0.5,
            centerX,
            centerY,
            glowRadius
          )

          glowGradient.addColorStop(0, `${color}40`)
          glowGradient.addColorStop(0.7, `${color}20`)
          glowGradient.addColorStop(1, `${color}00`)

          ctx.fillStyle = glowGradient
          ctx.beginPath()
          ctx.arc(centerX, centerY, glowRadius, 0, Math.PI * 2)
          ctx.fill()
        }

        if (animated) {
          time++
          animationRef.current = requestAnimationFrame(drawOrb)
        }
      }

      drawOrb()

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
      }
    }, [size, color, intensity, animated])

    return (
      <div
        ref={ref}
        className={cn("flex items-center justify-center", className)}
        style={{ width: size, height: size }}
        {...props}
      >
        <canvas
          ref={canvasRef}
          className="rounded-full"
          style={{ width: size, height: size }}
        />
      </div>
    )
  }
)
Orb.displayName = "Orb"

export { Orb }
