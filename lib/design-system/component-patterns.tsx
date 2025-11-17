/**
 * Component Patterns Library
 * Pre-composed component styles using design tokens
 * Use these patterns for consistent styling across the app
 */

import { tokens, typographyStyles, componentStyles } from '../design-tokens/helpers';
import { CSSProperties } from 'react';

/**
 * Page Container Pattern
 * Standard container for page content
 */
export const pageContainer: CSSProperties = {
  width: '100%',
  maxWidth: '1400px',
  margin: '0 auto',
  padding: `${tokens.spacing('4xl')} ${tokens.spacing('xl')}`,
};

/**
 * Section Pattern
 * Standard section spacing
 */
export const section: CSSProperties = {
  marginBottom: tokens.spacing('3xl'),
};

/**
 * Card Patterns
 */
export const cardPatterns = {
  default: {
    ...componentStyles.card,
  },
  elevated: {
    ...componentStyles.card,
    boxShadow: tokens.shadow('md'),
  },
  interactive: {
    ...componentStyles.card,
    cursor: 'pointer',
    transition: `all ${tokens.animationTiming('standard')} ${tokens.animationEasing('easeOut')}`,
  },
  compact: {
    ...componentStyles.card,
    padding: tokens.spacing('lg'),
  },
} as const;

/**
 * Button Patterns
 */
export const buttonPatterns = {
  primary: {
    ...componentStyles.button.primary,
  },
  secondary: {
    ...componentStyles.button.secondary,
  },
  ghost: {
    background: 'transparent',
    border: 'none',
    color: tokens.color('text-primary'),
    padding: `${tokens.spacing('sm')} ${tokens.spacing('md')}`,
    borderRadius: tokens.borderRadius('md'),
    cursor: 'pointer',
    transition: `all ${tokens.animationTiming('standard')} ${tokens.animationEasing('easeOut')}`,
  },
  danger: {
    ...componentStyles.button.primary,
    background: tokens.color('error'),
  },
} as const;

/**
 * Form Patterns
 */
export const formPatterns = {
  field: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: tokens.spacing('sm'),
    marginBottom: tokens.spacing('lg'),
  },
  label: {
    ...typographyStyles.small,
    color: tokens.color('text-secondary'),
    fontWeight: 'var(--font-weight-medium)',
  },
  input: {
    ...componentStyles.input,
  },
  error: {
    ...typographyStyles.tiny,
    color: tokens.color('error'),
    marginTop: tokens.spacing('xs'),
  },
  helper: {
    ...typographyStyles.tiny,
    color: tokens.color('text-tertiary'),
    marginTop: tokens.spacing('xs'),
  },
} as const;

/**
 * Layout Patterns
 */
export const layoutPatterns = {
  flexRow: {
    display: 'flex',
    flexDirection: 'row' as const,
    gap: tokens.spacing('md'),
    alignItems: 'center' as const,
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: tokens.spacing('md'),
  },
  grid: {
    display: 'grid',
    gap: tokens.spacing('lg'),
  },
  centered: {
    display: 'flex',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
} as const;

/**
 * Text Patterns
 */
export const textPatterns = {
  heading1: typographyStyles.h1,
  heading2: typographyStyles.h2,
  heading3: typographyStyles.h3,
  heading4: typographyStyles.h4,
  body: typographyStyles.body,
  small: typographyStyles.small,
  caption: {
    ...typographyStyles.tiny,
    color: tokens.color('text-tertiary'),
  },
  link: {
    ...typographyStyles.body,
    color: tokens.color('accent-primary'),
    textDecoration: 'none',
    cursor: 'pointer',
    transition: `color ${tokens.animationTiming('standard')} ${tokens.animationEasing('easeOut')}`,
  },
} as const;

/**
 * Status Patterns (for badges, alerts, etc.)
 */
export const statusPatterns = {
  success: {
    background: tokens.color('success'),
    color: tokens.color('text-primary'),
    padding: `${tokens.spacing('xs')} ${tokens.spacing('sm')}`,
    borderRadius: tokens.borderRadius('sm'),
    ...typographyStyles.tiny,
    fontWeight: 'var(--font-weight-medium)',
  },
  error: {
    background: tokens.color('error'),
    color: tokens.color('text-primary'),
    padding: `${tokens.spacing('xs')} ${tokens.spacing('sm')}`,
    borderRadius: tokens.borderRadius('sm'),
    ...typographyStyles.tiny,
    fontWeight: 'var(--font-weight-medium)',
  },
  warning: {
    background: tokens.color('warning'),
    color: tokens.color('text-primary'),
    padding: `${tokens.spacing('xs')} ${tokens.spacing('sm')}`,
    borderRadius: tokens.borderRadius('sm'),
    ...typographyStyles.tiny,
    fontWeight: 'var(--font-weight-medium)',
  },
  info: {
    background: tokens.color('info'),
    color: tokens.color('text-primary'),
    padding: `${tokens.spacing('xs')} ${tokens.spacing('sm')}`,
    borderRadius: tokens.borderRadius('sm'),
    ...typographyStyles.tiny,
    fontWeight: 'var(--font-weight-medium)',
  },
} as const;

/**
 * Loading States
 */
export const loadingPatterns = {
  skeleton: {
    background: tokens.color('surface-elevated'),
    borderRadius: tokens.borderRadius('md'),
    animation: 'pulse 1.5s ease-in-out infinite',
  },
  spinner: {
    width: tokens.spacing('xl'),
    height: tokens.spacing('xl'),
    border: `${tokens.borderWidth('medium')} solid ${tokens.color('border-subtle')}`,
    borderTopColor: tokens.color('accent-primary'),
    borderRadius: tokens.borderRadius('full'),
    animation: 'spin 1s linear infinite',
  },
} as const;

/**
 * Empty States
 */
export const emptyStatePatterns = {
  container: {
    ...layoutPatterns.centered,
    flexDirection: 'column' as const,
    padding: tokens.spacing('4xl'),
    gap: tokens.spacing('md'),
  },
  icon: {
    fontSize: tokens.fontSize('h1'),
    color: tokens.color('text-tertiary'),
    opacity: 0.5,
  },
  title: {
    ...typographyStyles.h3,
    color: tokens.color('text-secondary'),
  },
  description: {
    ...typographyStyles.body,
    color: tokens.color('text-tertiary'),
    textAlign: 'center' as const,
    maxWidth: '400px',
  },
} as const;

