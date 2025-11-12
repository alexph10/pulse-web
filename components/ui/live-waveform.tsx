"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface LiveWaveformProps extends React.HTMLAttributes<HTMLDivElement> {
  audioData?: Uint8Array
  width?: number
  height?: number
  barCount?: number
  barColor?: string
  barGap?: number
}

const LiveWaveform = React.forwardRef<HTMLDivElement, LiveWaveformProps>(
  (
    {
      className,
      audioData,
      width = 300,
      height = 100,
      barCount = 50,
      barColor = "#B91C1C",
      barGap = 2,
      ...props
    },
    ref
  ) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null)

    React.useEffect(() => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      canvas.width = width
      canvas.height = height

      // Clear canvas
      ctx.clearRect(0, 0, width, height)

      const barWidth = (width - barGap * (barCount - 1)) / barCount

      if (!audioData || audioData.length === 0) {
        // Draw flat line when no audio data
        ctx.fillStyle = barColor + "40"
        for (let i = 0; i < barCount; i++) {
          const x = i * (barWidth + barGap)
          const barHeight = 4
          const y = height / 2 - barHeight / 2
          ctx.fillRect(x, y, barWidth, barHeight)
        }
        return
      }

      // Calculate how many data points to skip for each bar
      const step = Math.floor(audioData.length / barCount)

      for (let i = 0; i < barCount; i++) {
        const dataIndex = i * step
        const value = audioData[dataIndex] || 0
        
        // Normalize value (0-255) to bar height
        const normalizedValue = value / 255
        const barHeight = Math.max(4, normalizedValue * height)

        const x = i * (barWidth + barGap)
        const y = height / 2 - barHeight / 2

        // Create gradient for bars
        const gradient = ctx.createLinearGradient(x, y, x, y + barHeight)
        gradient.addColorStop(0, barColor)
        gradient.addColorStop(1, barColor + "80")

        ctx.fillStyle = gradient
        ctx.fillRect(x, y, barWidth, barHeight)
      }
    }, [audioData, width, height, barCount, barColor, barGap])

    return (
      <div
        ref={ref}
        className={cn("flex items-center justify-center", className)}
        {...props}
      >
        <canvas
          ref={canvasRef}
          className="rounded"
          style={{ width, height }}
        />
      </div>
    )
  }
)
LiveWaveform.displayName = "LiveWaveform"

export { LiveWaveform }
