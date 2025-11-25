export const gridSystem = {
  // Container Widths
  containers: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1400px',
    full: '100%',
  },

  // Column Counts by Breakpoint
  columns: {
    mobile: 1,
    tablet: 2,
    desktop: 3,
    wide: 4,
  },

  // Gap System (4px base scale)
  gaps: {
    none: '0',
    xs: '4px',
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '24px',
    '3xl': '32px',
  },

  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Grid Templates
  templates: {
    // Auto-fit responsive grid (for dashboard cards)
    autoFit: (minWidth: string, gap: string) => ({
      display: 'grid',
      gridTemplateColumns: `repeat(auto-fit, minmax(min(${minWidth}, 100%), 1fr))`,
      gap: gap,
    }),

    // Fluid grid that expands on wider screens
    fluid: (minWidth: string, maxColumns: number, gap: string) => ({
      display: 'grid',
      gridTemplateColumns: `repeat(auto-fit, minmax(max(${minWidth}, calc((100% - (${maxColumns} - 1) * ${gap}) / ${maxColumns})), 1fr))`,
      gap: gap,
    }),

    // Fixed column grid
    columns: (count: number, gap: string) => ({
      display: 'grid',
      gridTemplateColumns: `repeat(${count}, 1fr)`,
      gap: gap,
    }),

    // Sidebar layout
    sidebar: (sidebarWidth: string, gap: string) => ({
      display: 'grid',
      gridTemplateColumns: `${sidebarWidth} 1fr`,
      gap: gap,
    }),

    // Asymmetric layout
    asymmetric: (ratio: string, gap: string) => ({
      display: 'grid',
      gridTemplateColumns: ratio,
      gap: gap,
    }),

    // Full bleed with content max-width
    fullBleed: (maxWidth: string) => ({
      display: 'grid',
      gridTemplateColumns: `1fr minmax(0, ${maxWidth}) 1fr`,
    }),
  },

  // Widget Size Configuration
  widgetSizes: {
    small: {
      minWidth: '280px',
      gridSpan: 'auto',
    },
    medium: {
      minWidth: '400px',
      gridSpan: 'span 2',
    },
    large: {
      minWidth: '600px',
      gridSpan: 'span 3',
    },
    full: {
      minWidth: '100%',
      gridSpan: '1 / -1',
    },
  },
}

// Utility function to get grid span based on widget size
export const getGridSpan = (size: 'small' | 'medium' | 'large' | 'full'): string => {
  return gridSystem.widgetSizes[size]?.gridSpan || 'auto'
}

// Utility function to get min width based on widget size
export const getMinWidth = (size: 'small' | 'medium' | 'large' | 'full'): string => {
  return gridSystem.widgetSizes[size]?.minWidth || '280px'
}
