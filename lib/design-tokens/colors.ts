/**
 * Design Tokens - Colors
 * Single source of truth for all colors in the application
 */

export const colors = {
  // Visionary Earth Tone Theme (Primary)
  visionary: {
    background: '#363d49', // bright-gray
    backgroundSecondary: '#3f373c', // thunder
    surface: '#623e33', // quincy
    surfaceElevated: '#5d3e39', // congo-brown
    textPrimary: '#ffedc1', // egg-white
    textSecondary: '#fdedc1', // beeswax
    textTertiary: '#c67b22', // ochre
    textDisabled: '#814837', // ironstone
    accentPrimary: '#c2593f', // crail
    accentPrimaryHover: '#b46c41', // brown-rust
    accentPrimaryActive: '#8d503a', // potters-clay
    accentSecondary: '#c67b22', // ochre
    accentMuted: '#814837', // ironstone
    accentSubtle: '#5d3e39', // congo-brown
    borderSubtle: '#5d3e39', // congo-brown
    borderEmphasis: '#814837', // ironstone
    borderStrong: '#8d503a', // potters-clay
  },
  // Purple Theme (from reference images)
  purple: {
    background: '#3A1F5C', // dark purple
    backgroundSecondary: '#2D1A47',
    surface: '#4A2B6B',
    surfaceElevated: '#5A3B7B',
    textPrimary: '#C8BFE7', // light lavender
    textSecondary: '#B8A8D8',
    textTertiary: '#9A8BC8',
    textDisabled: '#6B5A8B',
    accentPrimary: '#C8BFE7', // light lavender
    accentPrimaryHover: '#D8CFE7',
    accentPrimaryActive: '#B8A8D8',
    accentSecondary: '#9A8BC8',
    accentMuted: '#7A6BA8',
    accentSubtle: '#6B5A8B',
    borderSubtle: '#4A2B6B',
    borderEmphasis: '#5A3B7B',
    borderStrong: '#6A4B8B',
  },
  // Red Theme (from reference images)
  red: {
    background: '#4A0000', // dark maroon
    backgroundSecondary: '#3A0000',
    surface: '#5A0000',
    surfaceElevated: '#6A0000',
    textPrimary: '#FFFFFF',
    textSecondary: '#FFCCCC',
    textTertiary: '#FF9999',
    textDisabled: '#996666',
    accentPrimary: '#FF0000', // bright red
    accentPrimaryHover: '#FF3333',
    accentPrimaryActive: '#CC0000',
    accentSecondary: '#FF6666',
    accentMuted: '#CC3333',
    accentSubtle: '#990000',
    borderSubtle: '#5A0000',
    borderEmphasis: '#6A0000',
    borderStrong: '#7A0000',
  },
  // Light mode colors - Visionary Earth Tone Theme (Default)
  light: {
    background: '#363d49', // bright-gray
    backgroundSecondary: '#3f373c', // thunder
    surface: '#623e33', // quincy
    surfaceElevated: '#5d3e39', // congo-brown
    textPrimary: '#ffedc1', // egg-white
    textSecondary: '#fdedc1', // beeswax
    textTertiary: '#c67b22', // ochre
    textDisabled: '#814837', // ironstone
    accentPrimary: '#c2593f', // crail
    accentPrimaryHover: '#b46c41', // brown-rust
    accentPrimaryActive: '#8d503a', // potters-clay
    accentSecondary: '#c67b22', // ochre
    accentMuted: '#814837', // ironstone
    accentSubtle: '#5d3e39', // congo-brown
    borderSubtle: '#5d3e39', // congo-brown
    borderEmphasis: '#814837', // ironstone
    borderStrong: '#8d503a', // potters-clay
  },
  // Dark mode colors - Even darker for true dark mode
  dark: {
    background: '#0A0705',
    backgroundSecondary: '#120E0A',
    surface: '#1A1510',
    surfaceElevated: '#241B15',
    textPrimary: '#F5F3F0',
    textSecondary: '#D4C9BC',
    textTertiary: '#A1937F',
    textDisabled: '#5E5650',
    accentPrimary: '#FB923C',
    accentPrimaryHover: '#FDBA74',
    accentPrimaryActive: '#F97316',
    accentSecondary: '#FED7AA',
    accentMuted: '#9A3412',
    accentSubtle: '#7C2D12',
    borderSubtle: '#2A2218',
    borderEmphasis: '#3A2E24',
    borderStrong: '#4A3D30',
  },
  // Semantic colors (theme-agnostic) - Earth tones, no gray
  semantic: {
    success: '#16A34A', // green (keep for success)
    successLight: '#22C55E',
    successDark: '#15803D',
    error: '#c2593f', // crail red-orange
    errorLight: '#b46c41', // brown-rust
    errorDark: '#8d503a', // potters-clay
    warning: '#c67b22', // ochre
    warningLight: '#d6892a',
    warningDark: '#a6691a',
    info: '#814837', // ironstone (brown-blue tone)
    infoLight: '#9a5845',
    infoDark: '#6a3829',
  },
} as const

export type ColorTheme = 'light' | 'dark' | 'visionary' | 'purple' | 'red'
export type SemanticColor = keyof typeof colors.semantic

