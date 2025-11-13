/**
 * Design Tokens - Spacing
 * 8px-based spacing scale for consistent layout
 */

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '32px',
  '3xl': '48px',
  '4xl': '64px',
  '5xl': '96px',
} as const

export type SpacingSize = keyof typeof spacing

/**
 * Get spacing value by key
 */
export function getSpacing(size: SpacingSize): string {
  return spacing[size]
}

