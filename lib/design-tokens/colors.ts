/**
 * Design Tokens - Colors
 * Single source of truth for all colors in the application
 */

export const colors = {
  // Light mode colors
  light: {
    background: '#F5F1E8',
    backgroundSecondary: '#FFFFFF',
    surface: '#FFFEF9',
    surfaceElevated: '#FFFFFF',
    textPrimary: '#3B2A1A',
    textSecondary: '#6B5644',
    textTertiary: '#8C7860',
    textDisabled: '#C5BDB2',
    accentPrimary: '#B91C1C',
    accentPrimaryHover: '#991B1B',
    accentTertiary: '#DC2626',
    accentMuted: '#FEE2E2',
    borderSubtle: '#E8DCC8',
    borderEmphasis: '#D4C4B0',
  },
  // Dark mode colors
  dark: {
    background: '#1F1814',
    backgroundSecondary: '#282320',
    surface: '#312B26',
    surfaceElevated: '#3A342E',
    textPrimary: '#F5F1E8',
    textSecondary: '#D4C4B0',
    textTertiary: '#8C7860',
    textDisabled: '#6B5644',
    accentPrimary: '#DC2626',
    accentPrimaryHover: '#B91C1C',
    accentTertiary: '#EF4444',
    accentMuted: '#7F1D1D',
    borderSubtle: '#3A342E',
    borderEmphasis: '#4A443E',
  },
  // Semantic colors (theme-agnostic)
  semantic: {
    success: '#10b981',
    successLight: '#d1fae5',
    successDark: '#059669',
    error: '#ef4444',
    errorLight: '#fee2e2',
    errorDark: '#dc2626',
    warning: '#f59e0b',
    warningLight: '#fef3c7',
    warningDark: '#d97706',
    info: '#3b82f6',
    infoLight: '#dbeafe',
    infoDark: '#2563eb',
  },
} as const

export type ColorTheme = 'light' | 'dark'
export type SemanticColor = keyof typeof colors.semantic

