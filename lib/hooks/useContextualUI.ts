'use client'

import { useEffect, useState } from 'react'

interface ContextualUIState {
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night'
  greeting: string
  themeVariation: 'warm' | 'cool' | 'neutral'
  accentIntensity: 'subtle' | 'normal' | 'vibrant'
}

export function useContextualUI(): ContextualUIState {
  const [state, setState] = useState<ContextualUIState>({
    timeOfDay: 'morning',
    greeting: 'Good morning',
    themeVariation: 'neutral',
    accentIntensity: 'normal',
  })

  useEffect(() => {
    const updateContextualUI = () => {
      const hour = new Date().getHours()
      
      let timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night'
      let greeting: string
      let themeVariation: 'warm' | 'cool' | 'neutral'
      let accentIntensity: 'subtle' | 'normal' | 'vibrant'

      if (hour >= 5 && hour < 12) {
        timeOfDay = 'morning'
        greeting = 'Good morning'
        themeVariation = 'warm'
        accentIntensity = 'vibrant'
      } else if (hour >= 12 && hour < 17) {
        timeOfDay = 'afternoon'
        greeting = 'Good afternoon'
        themeVariation = 'neutral'
        accentIntensity = 'normal'
      } else if (hour >= 17 && hour < 22) {
        timeOfDay = 'evening'
        greeting = 'Good evening'
        themeVariation = 'warm'
        accentIntensity = 'normal'
      } else {
        timeOfDay = 'night'
        greeting = 'Still up?'
        themeVariation = 'cool'
        accentIntensity = 'subtle'
      }

      setState({
        timeOfDay,
        greeting,
        themeVariation,
        accentIntensity,
      })

      // Apply contextual CSS variables
      const root = document.documentElement
      
      if (themeVariation === 'warm') {
        root.style.setProperty('--contextual-accent', '#FB923C')
        root.style.setProperty('--contextual-bg-tint', 'rgba(251, 146, 60, 0.05)')
      } else if (themeVariation === 'cool') {
        root.style.setProperty('--contextual-accent', '#EA580C')
        root.style.setProperty('--contextual-bg-tint', 'rgba(234, 88, 12, 0.03)')
      } else {
        root.style.setProperty('--contextual-accent', 'var(--accent-primary)')
        root.style.setProperty('--contextual-bg-tint', 'transparent')
      }
    }

    updateContextualUI()
    
    // Update every hour
    const interval = setInterval(updateContextualUI, 3600000)
    
    return () => clearInterval(interval)
  }, [])

  return state
}

