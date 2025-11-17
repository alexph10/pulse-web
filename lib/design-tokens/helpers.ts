/**
 * Type-Safe Design Token Helpers
 * Use these helpers to access design tokens with full type safety
 */

import { spacing, SpacingSize } from './spacing';
import { typography, TypographyVariant } from './typography';
import { colors } from './colors';
import { shadows, ShadowSize } from './shadows';
import { borders, BorderRadius, BorderWidth } from './borders';
import { animations, AnimationTiming, AnimationEasing } from './animations';

/**
 * Convert camelCase to kebab-case for CSS variables
 */
function toKebabCase(str: string): string {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase();
}

/**
 * Type-safe design token accessors
 */
export const tokens = {
  /**
   * Get spacing value as CSS variable
   * @example tokens.spacing('lg') => 'var(--spacing-lg)'
   */
  spacing: (size: SpacingSize): string => `var(--spacing-${size})`,
  
  /**
   * Get compact spacing value as CSS variable
   * @example tokens.spacingCompact('lg') => 'var(--spacing-compact-lg)'
   */
  spacingCompact: (size: SpacingSize): string => `var(--spacing-compact-${size})`,
  
  /**
   * Get color value as CSS variable
   * @example tokens.color('accent-primary') => 'var(--accent-primary)'
   */
  color: (path: string): string => {
    // Handle nested paths like 'semantic.success'
    const cssKey = path.replace(/\./g, '-').replace(/([A-Z])/g, '-$1').toLowerCase();
    return `var(--${cssKey})`;
  },
  
  /**
   * Get typography font size as CSS variable
   * @example tokens.fontSize('h1') => 'var(--font-size-h1)'
   */
  fontSize: (variant: TypographyVariant): string => `var(--font-size-${variant})`,
  
  /**
   * Get typography line height as CSS variable
   * @example tokens.lineHeight('body') => 'var(--line-height-body)'
   */
  lineHeight: (variant: TypographyVariant): string => `var(--line-height-${variant})`,
  
  /**
   * Get font family as CSS variable
   * @example tokens.fontFamily('satoshi') => 'var(--font-family-satoshi)'
   */
  fontFamily: (name: 'satoshi' | 'switzer' | 'manier' | 'inter' | 'garamond' | 'cormorant' | 'antonia'): string => 
    `var(--font-family-${name})`,
  
  /**
   * Get shadow value as CSS variable
   * @example tokens.shadow('md') => 'var(--shadow-md)'
   */
  shadow: (size: ShadowSize): string => `var(--shadow-${size})`,
  
  /**
   * Get border radius as CSS variable
   * @example tokens.borderRadius('lg') => 'var(--border-radius-lg)'
   */
  borderRadius: (size: BorderRadius): string => `var(--border-radius-${size})`,
  
  /**
   * Get border width as CSS variable
   * @example tokens.borderWidth('thin') => 'var(--border-width-thin)'
   */
  borderWidth: (size: BorderWidth): string => `var(--border-width-${size})`,
  
  /**
   * Get animation timing as CSS variable
   * @example tokens.animationTiming('standard') => 'var(--animation-timing-standard)'
   */
  animationTiming: (timing: AnimationTiming): string => `var(--animation-timing-${timing})`,
  
  /**
   * Get animation easing as CSS variable
   * @example tokens.animationEasing('easeOut') => 'var(--animation-easing-easeOut)'
   */
  animationEasing: (easing: AnimationEasing): string => `var(--animation-easing-${easing})`,
} as const;

/**
 * Pre-composed component style helpers
 */
export const componentStyles = {
  /**
   * Standard card styles
   */
  card: {
    padding: tokens.spacing('xl'),
    background: tokens.color('surface'),
    borderRadius: tokens.borderRadius('md'),
    border: `${tokens.borderWidth('thin')} solid ${tokens.color('border-subtle')}`,
    boxShadow: tokens.shadow('sm'),
  },
  
  /**
   * Button styles
   */
  button: {
    primary: {
      padding: `${tokens.spacing('sm')} ${tokens.spacing('xl')}`,
      background: tokens.color('accent-primary'),
      color: tokens.color('text-primary'),
      borderRadius: tokens.borderRadius('lg'),
      border: 'none',
      fontSize: tokens.fontSize('body'),
      fontWeight: 'var(--font-weight-semibold)',
      transition: `all ${tokens.animationTiming('standard')} ${tokens.animationEasing('easeOut')}`,
    },
    secondary: {
      padding: `${tokens.spacing('sm')} ${tokens.spacing('xl')}`,
      background: 'transparent',
      color: tokens.color('accent-primary'),
      border: `${tokens.borderWidth('medium')} solid ${tokens.color('accent-primary')}`,
      borderRadius: tokens.borderRadius('lg'),
      fontSize: tokens.fontSize('body'),
    },
  },
  
  /**
   * Input styles
   */
  input: {
    padding: `${tokens.spacing('md')} ${tokens.spacing('lg')}`,
    background: tokens.color('surface'),
    border: `${tokens.borderWidth('thin')} solid ${tokens.color('border-subtle')}`,
    borderRadius: tokens.borderRadius('md'),
    fontSize: tokens.fontSize('body'),
    color: tokens.color('text-primary'),
    fontFamily: tokens.fontFamily('satoshi'),
  },
} as const;

/**
 * Typography style helpers
 */
export const typographyStyles = {
  h1: {
    fontSize: tokens.fontSize('h1'),
    lineHeight: tokens.lineHeight('h1'),
    fontWeight: 'var(--font-weight-semibold)',
    letterSpacing: 'var(--letter-spacing-heading)',
    fontFamily: tokens.fontFamily('satoshi'),
  },
  h2: {
    fontSize: tokens.fontSize('h2'),
    lineHeight: tokens.lineHeight('h2'),
    fontWeight: 'var(--font-weight-semibold)',
    letterSpacing: 'var(--letter-spacing-heading)',
    fontFamily: tokens.fontFamily('satoshi'),
  },
  h3: {
    fontSize: tokens.fontSize('h3'),
    lineHeight: tokens.lineHeight('h3'),
    fontWeight: 'var(--font-weight-semibold)',
    fontFamily: tokens.fontFamily('satoshi'),
  },
  h4: {
    fontSize: tokens.fontSize('h4'),
    lineHeight: tokens.lineHeight('h4'),
    fontWeight: 'var(--font-weight-semibold)',
    fontFamily: tokens.fontFamily('satoshi'),
  },
  body: {
    fontSize: tokens.fontSize('body'),
    lineHeight: tokens.lineHeight('body'),
    fontWeight: 'var(--font-weight-normal)',
    fontFamily: tokens.fontFamily('switzer'),
  },
  small: {
    fontSize: tokens.fontSize('small'),
    lineHeight: tokens.lineHeight('small'),
    fontWeight: 'var(--font-weight-normal)',
    fontFamily: tokens.fontFamily('switzer'),
  },
} as const;

/**
 * Accessibility helpers
 */
export const a11y = {
  minTouchTarget: '44px', // iOS/Android minimum touch target
  minContrastRatio: 4.5, // WCAG AA standard
  focusRing: `2px solid ${tokens.color('accent-primary')}`,
  focusOffset: '2px',
  minFontSize: '16px', // Minimum readable font size
} as const;

/**
 * Calculate contrast ratio between two colors
 * Returns ratio (1-21, where 4.5+ is WCAG AA, 7+ is WCAG AAA)
 */
export function getContrastRatio(foreground: string, background: string): number {
  // Convert hex to RGB
  const hexToRgb = (hex: string): [number, number, number] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
      : [0, 0, 0];
  };

  // Calculate relative luminance
  const getLuminance = (r: number, g: number, b: number): number => {
    const [rs, gs, bs] = [r, g, b].map((val) => {
      val = val / 255;
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const fgRgb = hexToRgb(foreground);
  const bgRgb = hexToRgb(background);

  const fgLum = getLuminance(fgRgb[0], fgRgb[1], fgRgb[2]);
  const bgLum = getLuminance(bgRgb[0], bgRgb[1], bgRgb[2]);

  const lighter = Math.max(fgLum, bgLum);
  const darker = Math.min(fgLum, bgLum);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if color combination meets WCAG AA contrast requirements
 */
export function checkContrast(foreground: string, background: string): boolean {
  return getContrastRatio(foreground, background) >= a11y.minContrastRatio;
}

