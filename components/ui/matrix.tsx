"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface MatrixProps extends React.HTMLAttributes<HTMLCanvasElement> {
  fontSize?: number
  speed?: number
  density?: number
  color?: string
}

const Matrix = React.forwardRef<HTMLCanvasElement, MatrixProps>(
  ({ className, fontSize = 16, speed = 50, density = 0.95, color = "#0F0", ...props }, ref) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null)

    React.useImperativeHandle(ref, () => canvasRef.current!)

    React.useEffect(() => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      const resizeCanvas = () => {
        canvas.width = canvas.offsetWidth
        canvas.height = canvas.offsetHeight
      }

      resizeCanvas()
      window.addEventListener("resize", resizeCanvas)

      const columns = Math.floor(canvas.width / fontSize)
      const drops: number[] = Array(columns).fill(1)

      const draw = () => {
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        ctx.fillStyle = color
        ctx.font = `${fontSize}px monospace`

        for (let i = 0; i < drops.length; i++) {
          const text = String.fromCharCode(0x30A0 + Math.random() * 96)
          const x = i * fontSize
          const y = drops[i] * fontSize

          ctx.fillText(text, x, y)

          if (y > canvas.height && Math.random() > density) {
            drops[i] = 0
          }

          drops[i]++
        }
      }

      const interval = setInterval(draw, speed)

      return () => {
        clearInterval(interval)
        window.removeEventListener("resize", resizeCanvas)
      }
    }, [fontSize, speed, density, color])

    return (
      <canvas
        ref={canvasRef}
        className={cn("h-full w-full bg-black", className)}
        {...props}
      />
    )
  }
)
Matrix.displayName = "Matrix"

export { Matrix }
