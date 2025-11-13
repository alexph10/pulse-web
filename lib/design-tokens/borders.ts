/**
 * Design Tokens - Borders
 * Border radius and width values for consistent styling
 */

export const borders = {
  radius: {
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  width: {
    thin: '1px',
    medium: '2px',
    thick: '3px',
  },
} as const

export type BorderRadius = keyof typeof borders.radius
export type BorderWidth = keyof typeof borders.width

/**
 * Get border radius value
 */
export function getBorderRadius(size: BorderRadius): string {
  return borders.radius[size]
}

/**
 * Get border width value
 */
export function getBorderWidth(size: BorderWidth): string {
  return borders.width[size]
}

