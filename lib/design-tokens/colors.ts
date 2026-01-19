/**
 * Design Tokens - Colors
 * Single source of truth for all colors in the application
 * Serene Sandstone Theme
 */

export const colors = {
  // Serene Sandstone Theme (Primary)
  visionary: {
    background: '#f5f2eb', // warm cream
    backgroundSecondary: '#faf8f4', // lighter cream
    surface: '#ffffff', // pure white
    surfaceElevated: '#fefefe', // elevated white
    textPrimary: '#385f52', // forest green
    textSecondary: '#4a7364', // medium green
    textTertiary: '#5c8776', // soft green
    textDisabled: '#9eb5ad', // muted green
    accentPrimary: '#385f52', // forest green
    accentPrimaryHover: '#4a7364', // hover green
    accentPrimaryActive: '#2d4d42', // active green
    accentSecondary: '#f6b562', // warm amber
    accentMuted: '#e4a855', // muted amber
    accentSubtle: '#f9d8a8', // soft amber
    borderSubtle: '#e4ddd3', // subtle cream border
    borderEmphasis: '#d4c9bb', // emphasis border
    borderStrong: '#b8a895', // strong border
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
  // Light mode - Clean light theme with dark teal text
  light: {
    background: '#f3f3f1',           // Soft warm gray
    backgroundSecondary: '#f8f8f6',  // Lighter variant
    surface: '#ffffff',              // Pure white
    surfaceElevated: '#fefefe',      // Elevated white
    textPrimary: '#0f2d2c',          // Dark teal - primary text
    textSecondary: '#1a3a38',        // Medium teal - secondary text
    textTertiary: '#245450',         // Lighter teal - tertiary text
    textDisabled: '#3d8a84',         // Muted teal - disabled text
    textInverse: '#f3f3f1',          // Inverted text (for buttons on dark bg)
    accentPrimary: '#0f2d2c',        // Dark teal - accent
    accentPrimaryHover: '#1a3a38',   // Hover state
    accentPrimaryActive: '#0a1f1e',  // Active/pressed state
    accentSecondary: '#adf0dd',      // Mint accent (matches dark mode)
    accentMuted: '#7de8c8',          // Muted mint
    accentSubtle: 'rgba(15, 45, 44, 0.08)', // Subtle teal overlay
    borderSubtle: 'rgba(15, 45, 44, 0.1)',  // Subtle border
    borderEmphasis: 'rgba(15, 45, 44, 0.15)', // Emphasis border
    borderStrong: 'rgba(15, 45, 44, 0.25)',   // Strong border
  },
  // Dark mode - True Black theme with dramatic depth
  dark: {
    background: '#000000',           // True black base
    backgroundSecondary: '#0A0A0A',  // Barely elevated
    surface: '#141414',              // Card/modal surfaces
    surfaceElevated: '#1A1A1A',      // More elevated surfaces
    surfaceHover: '#1F1F1F',         // Hover states
    textPrimary: '#FAFAFA',          // Bright white for contrast
    textSecondary: '#8A8A8A',        // Medium gray
    textTertiary: '#5A5A5A',         // Dark gray
    textDisabled: '#3A3A3A',         // Very dark gray
    textInverse: '#000000',          // Black text on light backgrounds
    accentPrimary: '#B91C1C',        // Brand red
    accentPrimaryHover: '#DC2626',   // Lighter red hover
    accentPrimaryActive: '#991B1B',  // Darker red active
    accentSecondary: '#991B1B',      // Secondary red
    accentTertiary: '#7F1D1D',       // Tertiary red
    accentDarkest: '#5F1010',        // Ultra dark red
    accentMuted: 'rgba(185, 28, 28, 0.25)',      // Muted red overlay
    accentSubtle: 'rgba(185, 28, 28, 0.06)',     // Subtle red overlay
    accentSubtleDark: 'rgba(95, 16, 16, 0.4)',   // Dark red overlay
    borderSubtle: 'rgba(255, 255, 255, 0.05)',   // Very subtle borders
    borderBase: 'rgba(255, 255, 255, 0.08)',     // Base borders
    borderEmphasis: 'rgba(255, 255, 255, 0.12)', // Emphasized borders
    borderStrong: 'rgba(255, 255, 255, 0.16)',   // Strong borders
  },
  // Chart / Accent palettes - warm earth tones
  charts: {
    saffron: '#f5ce58',
    marigold: '#e29c43',
    clay: '#b4623b',
    russet: '#8b4530',
    cocoa: '#5a1b16',
    sand: '#f9d8a8',
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
  // Brand colors - Pulse-specific branding
  brand: {
    limeGreen: '#84ff00', // Primary brand accent
    limeGreenHover: '#a5ff33', // Hover state
    forestGreen: '#385f52', // Primary forest green
    forestGreenHover: '#4a7364', // Forest green hover
    lightGrey: '#d1d5db', // Secondary button background
    lightGreyHover: '#e5e7eb', // Secondary button hover
    black: '#000000', // Text on light backgrounds
    white: '#ffffff', // Text on dark backgrounds
  },
  // Overlay/Backdrop colors for modals, overlays, etc.
  overlay: {
    backdrop: 'rgba(0, 0, 0, 0.5)', // Standard modal backdrop
    backdropDark: 'rgba(0, 0, 0, 0.6)', // Darker modal backdrop
    backdropLight: 'rgba(0, 0, 0, 0.3)', // Lighter backdrop
    backdropSubtle: 'rgba(0, 0, 0, 0.1)', // Very subtle backdrop
    backdropStrong: 'rgba(0, 0, 0, 0.8)', // Strong backdrop
    whiteOverlay: 'rgba(255, 255, 255, 0.9)', // White overlay
    whiteOverlayLight: 'rgba(255, 255, 255, 0.1)', // Light white overlay
    whiteOverlayMedium: 'rgba(255, 255, 255, 0.2)', // Medium white overlay
    whiteOverlaySubtle: 'rgba(255, 255, 255, 0.05)', // Subtle white overlay
    whiteOverlayStrong: 'rgba(255, 255, 255, 0.95)', // Strong white overlay
    successOverlay: 'rgba(158, 244, 208, 0.3)', // Success color overlay
    successOverlaySubtle: 'rgba(158, 244, 208, 0.02)', // Subtle success overlay
  },
} as const

export type ColorTheme = 'light' | 'dark' | 'visionary' | 'red'
export type SemanticColor = keyof typeof colors.semantic

