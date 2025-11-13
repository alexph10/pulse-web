/**
 * Design Tokens - Animations
 * Timing functions and durations for consistent animations
 */

export const animations = {
  timing: {
    micro: '150ms',
    standard: '200ms',
    smooth: '300ms',
    slow: '500ms',
  },
  easing: {
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
} as const

export type AnimationTiming = keyof typeof animations.timing
export type AnimationEasing = keyof typeof animations.easing

/**
 * Get animation timing value
 */
export function getTiming(timing: AnimationTiming): string {
  return animations.timing[timing]
}

/**
 * Get animation easing function
 */
export function getEasing(easing: AnimationEasing): string {
  return animations.easing[easing]
}

/**
 * Create transition string
 */
export function createTransition(
  properties: string | string[],
  timing: AnimationTiming = 'standard',
  easing: AnimationEasing = 'easeOut'
): string {
  const props = Array.isArray(properties) ? properties.join(', ') : properties
  return `${props} ${getTiming(timing)} ${getEasing(easing)}`
}

