/**
 * Design Tokens - Shadows & Elevation
 * Elevation system for depth and hierarchy
 */

export const shadows = {
  none: 'none',
  sm: '0 1px 3px rgba(0, 0, 0, 0.1)',
  md: '0 4px 12px rgba(0, 0, 0, 0.15)',
  lg: '0 8px 24px rgba(0, 0, 0, 0.2)',
  xl: '0 16px 48px rgba(0, 0, 0, 0.25)',
} as const

export const elevation = {
  0: shadows.none,
  1: shadows.sm,
  2: shadows.md,
  3: shadows.lg,
} as const

export type ShadowSize = keyof typeof shadows
export type ElevationLevel = keyof typeof elevation

/**
 * Get shadow value by size
 */
export function getShadow(size: ShadowSize): string {
  return shadows[size]
}

/**
 * Get elevation shadow by level
 */
export function getElevation(level: ElevationLevel): string {
  return elevation[level]
}

