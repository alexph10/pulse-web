"use client"

import { createContext, type ReactNode, useCallback, useContext, useEffect, useId, useRef } from "react"
import { motion, stagger, useAnimate, useAnimationFrame } from "motion/react"
import { cn } from "@/lib/utils"

// Floating Context and Components
interface FloatingContextType {
  registerElement: (id: string, element: HTMLDivElement, depth: number) => void
  unregisterElement: (id: string) => void
}

const FloatingContext = createContext<FloatingContextType | null>(null)

interface FloatingProps {
  children: ReactNode
  className?: string
  sensitivity?: number
  easingFactor?: number
}

const Floating = ({ children, className, sensitivity = 1, easingFactor = 0.05, ...props }: FloatingProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const elementsMap = useRef(
    new Map<
      string,
      {
        element: HTMLDivElement
        depth: number
        currentPosition: { x: number; y: number }
        offset: { x: number; y: number }
        speed: { x: number; y: number }
      }
    >(),
  )
  const timeRef = useRef(0)

  const registerElement = useCallback((id: string, element: HTMLDivElement, depth: number) => {
    elementsMap.current.set(id, {
      element,
      depth,
      currentPosition: { x: 0, y: 0 },
      offset: { x: Math.random() * Math.PI * 2, y: Math.random() * Math.PI * 2 },
      speed: { x: 0.3 + Math.random() * 0.4, y: 0.2 + Math.random() * 0.3 },
    })
  }, [])

  const unregisterElement = useCallback((id: string) => {
    elementsMap.current.delete(id)
  }, [])

  useAnimationFrame((time) => {
    if (!containerRef.current) return

    timeRef.current = time / 1000

    elementsMap.current.forEach((data) => {
      const strength = data.depth * sensitivity * 15

      const targetX = Math.sin(timeRef.current * data.speed.x + data.offset.x) * strength
      const targetY = Math.cos(timeRef.current * data.speed.y + data.offset.y) * strength

      const dx = targetX - data.currentPosition.x
      const dy = targetY - data.currentPosition.y

      data.currentPosition.x += dx * easingFactor
      data.currentPosition.y += dy * easingFactor

      data.element.style.transform = `translate3d(${data.currentPosition.x}px, ${data.currentPosition.y}px, 0)`
    })
  })

  return (
    <FloatingContext.Provider value={{ registerElement, unregisterElement }}>
      <div ref={containerRef} className={cn("absolute top-0 left-0 w-full h-full", className)} {...props}>
        {children}
      </div>
    </FloatingContext.Provider>
  )
}

interface FloatingElementProps {
  children: ReactNode
  className?: string
  depth?: number
}

const FloatingElement = ({ children, className, depth = 1 }: FloatingElementProps) => {
  const elementRef = useRef<HTMLDivElement>(null)
  const id = useId()
  const context = useContext(FloatingContext)

  useEffect(() => {
    if (!elementRef.current || !context) return

    const nonNullDepth = depth ?? 0.01

    context.registerElement(id, elementRef.current, nonNullDepth)
    return () => context.unregisterElement(id)
  }, [depth, context, id])

  return (
    <div ref={elementRef} className={cn("absolute will-change-transform", className)}>
      {children}
    </div>
  )
}

// Shape configuration
const shapes = [
  { color: "#8B4513", glow: "rgba(139, 69, 19, 0.6)" },
  { color: "#CD853F", glow: "rgba(205, 133, 63, 0.5)" },
  { color: "#FFDAB9", glow: "rgba(255, 218, 185, 0.4)" },
  { color: "#EBE5E0", glow: "rgba(235, 229, 224, 0.4)" },
]

// Floating Background Component
export default function FloatingBackground() {
  const [scope, animate] = useAnimate()

  useEffect(() => {
    animate(".floating-shape", { opacity: [0, 1] }, { duration: 0.5, delay: stagger(0.15) })
  }, [animate])

  return (
    <div
      className="absolute inset-0 w-full h-full overflow-hidden"
      ref={scope}
    >
      <Floating sensitivity={1} className="overflow-hidden">
        {/* Top left - dark brown */}
        <FloatingElement depth={0.5} className="top-[5%] left-[8%]">
          <motion.div
            initial={{ opacity: 0 }}
            className="floating-shape w-40 h-40 md:w-56 md:h-56"
            style={{
              backgroundColor: shapes[0].color,
              filter: "blur(80px)",
              boxShadow: `0 0 200px ${shapes[0].glow}`,
            }}
          />
        </FloatingElement>

        {/* Top right - peach */}
        <FloatingElement depth={2} className="top-[10%] left-[70%]">
          <motion.div
            initial={{ opacity: 0 }}
            className="floating-shape w-48 h-64 md:w-64 md:h-80"
            style={{
              backgroundColor: shapes[2].color,
              filter: "blur(80px)",
              boxShadow: `0 0 200px ${shapes[2].glow}`,
            }}
          />
        </FloatingElement>

        {/* Bottom left - tan */}
        <FloatingElement depth={1.5} className="top-[60%] left-[5%]">
          <motion.div
            initial={{ opacity: 0 }}
            className="floating-shape w-52 h-40 md:w-72 md:h-52"
            style={{
              backgroundColor: shapes[1].color,
              filter: "blur(80px)",
              boxShadow: `0 0 200px ${shapes[1].glow}`,
            }}
          />
        </FloatingElement>

        {/* Bottom right - cream */}
        <FloatingElement depth={1} className="top-[65%] left-[75%]">
          <motion.div
            initial={{ opacity: 0 }}
            className="floating-shape w-44 h-44 md:w-60 md:h-60"
            style={{
              backgroundColor: shapes[3].color,
              filter: "blur(80px)",
              boxShadow: `0 0 200px ${shapes[3].glow}`,
            }}
          />
        </FloatingElement>
      </Floating>
    </div>
  )
}
