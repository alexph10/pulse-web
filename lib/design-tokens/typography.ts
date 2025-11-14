/**
 * Design Tokens - Typography
 * Typography scale and hierarchy for consistent text styling
 */

export const typography = {
  h1: {
    fontSize: '48px',
    lineHeight: '1.2',
    fontWeight: '600',
    letterSpacing: '-0.02em',
  },
  h2: {
    fontSize: '36px',
    lineHeight: '1.2',
    fontWeight: '600',
    letterSpacing: '-0.01em',
  },
  h3: {
    fontSize: '24px',
    lineHeight: '1.3',
    fontWeight: '600',
    letterSpacing: '0',
  },
  h4: {
    fontSize: '20px',
    lineHeight: '1.4',
    fontWeight: '600',
    letterSpacing: '0',
  },
  body: {
    fontSize: '16px',
    lineHeight: '1.55', /* slightly reduced for compactness */
    fontWeight: '400',
    letterSpacing: '0',
  },
  small: {
    fontSize: '14px',
    lineHeight: '1.45', /* slightly reduced for compactness */
    fontWeight: '400',
    letterSpacing: '0',
  },
  tiny: {
    fontSize: '12px',
    lineHeight: '1.4',
    fontWeight: '400',
    letterSpacing: '0',
  },
} as const

export type TypographyVariant = keyof typeof typography

/**
 * Get typography styles by variant
 */
export function getTypography(variant: TypographyVariant) {
  return typography[variant]
}

