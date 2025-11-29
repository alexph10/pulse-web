/**
 * Pulse Color System
 * Comprehensive color palette for the mental wellness app
 * Inspired by Ramp, Linear, and ElevenLabs design systems
 */

export const pulseColors = {
  // === BRAND COLORS ===
  brand: {
    primary: '#B91C1C',      // Dark Red - Main brand color
    secondary: '#991B1B',    // Darker Red - Hover states
    tertiary: '#7F1D1D',     // Deepest Red - Active states
    darkest: '#5F1010',      // Ultra dark red - Deep backgrounds
    light: '#DC2626',        // Lighter Red - Accents
    subtle: 'rgba(185, 28, 28, 0.06)', // More subtle transparent overlay
    subtleDark: 'rgba(95, 16, 16, 0.4)', // Dark red overlay
  },

  // === MOOD COLORS ===
  // Used for journal entries, mood tracking, and data visualization
  mood: {
    joyful: {
      base: '#10B981',       // Emerald green
      light: '#34D399',
      dark: '#059669',
      bg: 'rgba(16, 185, 129, 0.1)',
    },
    calm: {
      base: '#3B82F6',       // Blue
      light: '#60A5FA',
      dark: '#2563EB',
      bg: 'rgba(59, 130, 246, 0.1)',
    },
    energized: {
      base: '#8B5CF6',       // Purple
      light: '#A78BFA',
      dark: '#7C3AED',
      bg: 'rgba(139, 92, 246, 0.1)',
    },
    grateful: {
      base: '#D97706',       // Dark Orange
      light: '#F59E0B',
      dark: '#B45309',
      bg: 'rgba(217, 119, 6, 0.1)',
    },
    reflective: {
      base: '#06B6D4',       // Cyan
      light: '#22D3EE',
      dark: '#0891B2',
      bg: 'rgba(6, 182, 212, 0.1)',
    },
    neutral: {
      base: '#6B7280',       // Gray
      light: '#9CA3AF',
      dark: '#4B5563',
      bg: 'rgba(107, 114, 128, 0.1)',
    },
    anxious: {
      base: '#F59E0B',       // Amber
      light: '#FBBF24',
      dark: '#D97706',
      bg: 'rgba(245, 158, 11, 0.1)',
    },
    frustrated: {
      base: '#EF4444',       // Red
      light: '#F87171',
      dark: '#DC2626',
      bg: 'rgba(239, 68, 68, 0.1)',
    },
    sad: {
      base: '#64748B',       // Slate
      light: '#94A3B8',
      dark: '#475569',
      bg: 'rgba(100, 116, 139, 0.1)',
    },
    overwhelmed: {
      base: '#F97316',       // Orange
      light: '#FB923C',
      dark: '#EA580C',
      bg: 'rgba(249, 115, 22, 0.1)',
    },
  },

  // === SEMANTIC COLORS ===
  semantic: {
    success: {
      base: '#10B981',
      light: '#34D399',
      dark: '#059669',
      bg: 'rgba(16, 185, 129, 0.1)',
      border: 'rgba(16, 185, 129, 0.3)',
    },
    error: {
      base: '#EF4444',
      light: '#F87171',
      dark: '#DC2626',
      bg: 'rgba(239, 68, 68, 0.1)',
      border: 'rgba(239, 68, 68, 0.3)',
    },
    warning: {
      base: '#F59E0B',
      light: '#FBBF24',
      dark: '#D97706',
      bg: 'rgba(245, 158, 11, 0.1)',
      border: 'rgba(245, 158, 11, 0.3)',
    },
    info: {
      base: '#3B82F6',
      light: '#60A5FA',
      dark: '#2563EB',
      bg: 'rgba(59, 130, 246, 0.1)',
      border: 'rgba(59, 130, 246, 0.3)',
    },
  },

  // === NEUTRAL COLORS (DARK THEME) ===
  dark: {
    background: {
      base: '#000000',       // True black background
      elevated: '#0A0A0A',   // Barely raised surfaces
      surface: '#141414',    // Card/modal backgrounds
      surfaceElevated: '#1A1A1A', // More elevated surfaces
      hover: '#1F1F1F',      // Hover states
    },
    text: {
      primary: '#FAFAFA',    // Main text - brighter for true black bg
      secondary: '#8A8A8A',  // Supporting text - darker
      tertiary: '#5A5A5A',   // Muted text - much darker
      disabled: '#3A3A3A',   // Disabled text - very dark
      inverse: '#000000',    // Text on light backgrounds
    },
    border: {
      subtle: 'rgba(255, 255, 255, 0.05)',   // Subtle dividers - more subtle
      base: 'rgba(255, 255, 255, 0.08)',     // Standard borders - darker
      emphasis: 'rgba(255, 255, 255, 0.12)', // Emphasized borders - darker
      strong: 'rgba(255, 255, 255, 0.16)',   // Strong borders - darker
    },
  },

  // === LIGHT COLORS (FUTURE LIGHT MODE) ===
  light: {
    background: {
      base: '#FFFFFF',
      elevated: '#FAFAFA',
      surface: '#F5F5F5',
      hover: '#F0F0F0',
    },
    text: {
      primary: '#0F0F0F',
      secondary: '#525252',
      tertiary: '#737373',
      disabled: '#A3A3A3',
      inverse: '#FFFFFF',
    },
    border: {
      subtle: 'rgba(0, 0, 0, 0.06)',
      base: 'rgba(0, 0, 0, 0.1)',
      emphasis: 'rgba(0, 0, 0, 0.15)',
      strong: 'rgba(0, 0, 0, 0.2)',
    },
  },

  // === CHART COLORS ===
  // Optimized palette for data visualization
  charts: {
    primary: ['#B91C1C', '#DC2626', '#EF4444', '#F87171', '#FCA5A5'],
    sequential: ['#10B981', '#3B82F6', '#8B5CF6', '#D97706', '#F59E0B'],
    diverging: ['#10B981', '#34D399', '#6B7280', '#FCA5A5', '#EF4444'],
    categorical: [
      '#B91C1C', // Brand red
      '#3B82F6', // Blue
      '#10B981', // Green
      '#F59E0B', // Amber
      '#8B5CF6', // Purple
      '#D97706', // Dark Orange
      '#06B6D4', // Cyan
      '#EF4444', // Red
    ],
  },

  // === GRADIENT COLORS ===
  gradients: {
    brand: 'linear-gradient(135deg, #B91C1C 0%, #991B1B 100%)',
    brandSubtle: 'linear-gradient(135deg, rgba(185, 28, 28, 0.8) 0%, rgba(153, 27, 27, 0.6) 100%)',
    dark: 'linear-gradient(180deg, #1A1A1A 0%, #0F0F0F 100%)',
    moodPositive: 'linear-gradient(135deg, #10B981 0%, #3B82F6 100%)',
    moodNegative: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
    surface: 'linear-gradient(180deg, rgba(255, 255, 255, 0.02) 0%, transparent 100%)',
  },

  // === SHADOW COLORS ===
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    brand: '0 8px 16px -4px rgba(185, 28, 28, 0.2)',
    glow: '0 0 20px rgba(185, 28, 28, 0.3)',
  },
}

// === HELPER FUNCTIONS ===

/**
 * Get mood color by mood name
 */
export function getMoodColor(mood: string): string {
  const moodLower = mood.toLowerCase()
  const moodColors = pulseColors.mood as Record<string, { base: string }>
  return moodColors[moodLower]?.base || pulseColors.mood.neutral.base
}

/**
 * Get mood background color
 */
export function getMoodBgColor(mood: string): string {
  const moodLower = mood.toLowerCase()
  const moodColors = pulseColors.mood as Record<string, { bg: string }>
  return moodColors[moodLower]?.bg || pulseColors.mood.neutral.bg
}

/**
 * Get semantic color by type
 */
export function getSemanticColor(type: 'success' | 'error' | 'warning' | 'info'): string {
  return pulseColors.semantic[type].base
}

/**
 * Convert hex to rgba
 */
export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

// === TYPE EXPORTS ===
export type MoodType = keyof typeof pulseColors.mood
export type SemanticType = keyof typeof pulseColors.semantic
