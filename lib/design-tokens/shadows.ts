/**
 * Design Tokens - Shadows & Elevation
 * Dramatic elevation system for true black backgrounds
 */

export const shadows = {
  none: 'none',
  sm: '0 2px 4px 0 rgba(0, 0, 0, 0.3)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.4)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 10px 10px -5px rgba(0, 0, 0, 0.5)',
  brand: '0 8px 16px -4px rgba(185, 28, 28, 0.4)',
  glow: '0 0 20px rgba(185, 28, 28, 0.5)',
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

