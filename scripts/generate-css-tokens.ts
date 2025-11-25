/**
 * Generate CSS Variables from TypeScript Design Tokens
 * This ensures a single source of truth - CSS is generated from TS tokens
 */

import { writeFileSync } from 'fs';
import { join } from 'path';
import { colors, spacing, typography, shadows, borders, animations } from '../lib/design-tokens';

function toKebabCase(str: string): string {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase();
}

function generateCSSVariables(): string {
  const lines: string[] = [];
  
  lines.push('/*');
  lines.push(' * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY');
  lines.push(' * Generated from lib/design-tokens/');
  lines.push(' * Run: npm run design:generate');
  lines.push(' */');
  lines.push('');
  lines.push(':root {');
  
  // Font Families (from globals.css - these are static)
  lines.push('  /* Font Families */');
  lines.push("  --font-family-satoshi: 'Satoshi', sans-serif;");
  lines.push("  --font-family-switzer: 'Switzer', sans-serif;");
  lines.push("  --font-family-manier: 'Manier', sans-serif;");
  lines.push("  --font-family-inter: 'Inter', sans-serif;");
  lines.push("  --font-family-garamond: 'EB Garamond', serif;");
  lines.push("  --font-family-cormorant: 'Cormorant Garamond', serif;");
  lines.push("  --font-family-antonia: 'Antonia H1', serif;");
  lines.push('');
  
  // Colors - Visionary theme (primary)
  lines.push('  /* Colors - Visionary Earth Tone Theme (Primary) */');
  Object.entries(colors.visionary).forEach(([key, value]) => {
    const cssKey = toKebabCase(key);
    lines.push(`  --${cssKey}: ${value};`);
  });
  lines.push('');
  
  // Chart Colors / Accent Palette
  if (colors.charts) {
    lines.push('  /* Chart Accent Palette */');
    Object.entries(colors.charts).forEach(([key, value]) => {
      const cssKey = toKebabCase(key);
      lines.push(`  --chart-${cssKey}: ${value};`);
    });
    lines.push('');
  }

  // Semantic Colors
  lines.push('  /* Semantic Colors - Earth Tones */');
  Object.entries(colors.semantic).forEach(([key, value]) => {
    lines.push(`  --${key}: ${value};`);
  });
  lines.push('');
  
  // Brand Colors
  lines.push('  /* Brand Colors - Pulse-specific branding */');
  Object.entries(colors.brand).forEach(([key, value]) => {
    const cssKey = toKebabCase(key);
    lines.push(`  --brand-${cssKey}: ${value};`);
  });
  lines.push('');
  
  // Spacing
  lines.push('  /* Spacing Scale (8px base) */');
  Object.entries(spacing).forEach(([key, value]) => {
    lines.push(`  --spacing-${key}: ${value};`);
  });
  lines.push('');
  
  // Compact Spacing (0.75x multiplier)
  lines.push('  /* Compact Spacing Scale (0.75x multiplier) */');
  Object.entries(spacing).forEach(([key, value]) => {
    const numValue = parseInt(value);
    const compactValue = Math.round(numValue * 0.75);
    lines.push(`  --spacing-compact-${key}: ${compactValue}px;`);
  });
  lines.push('');
  lines.push('  --section-gap: 36px;');
  lines.push('  --card-gap: 18px;');
  lines.push('');
  
  // Typography
  lines.push('  /* Typography Scale */');
  Object.entries(typography).forEach(([key, value]) => {
    lines.push(`  --font-size-${key}: ${value.fontSize};`);
    lines.push(`  --line-height-${key}: ${value.lineHeight};`);
    lines.push(`  --font-weight-${key}: ${value.fontWeight};`);
    lines.push(`  --letter-spacing-${key}: ${value.letterSpacing};`);
  });
  lines.push('');
  
  // Global typography values
  lines.push('  --line-height-tight: 1.1;');
  lines.push('  --line-height-normal: 1.55;');
  lines.push('  --line-height-relaxed: 1.65;');
  lines.push('  --letter-spacing-tight: -0.03em;');
  lines.push('  --letter-spacing-heading: -0.03em;');
  lines.push('  --letter-spacing-normal: 0;');
  lines.push('  --font-weight-normal: 400;');
  lines.push('  --font-weight-medium: 500;');
  lines.push('  --font-weight-semibold: 600;');
  lines.push('  --font-weight-bold: 700;');
  lines.push('');
  
  // Borders
  lines.push('  /* Border Radius */');
  Object.entries(borders.radius).forEach(([key, value]) => {
    lines.push(`  --border-radius-${key}: ${value};`);
  });
  lines.push('');
  
  lines.push('  /* Border Width */');
  Object.entries(borders.width).forEach(([key, value]) => {
    lines.push(`  --border-width-${key}: ${value};`);
  });
  lines.push('');
  
  // Shadows
  lines.push('  /* Shadows - Earth Tone Tinted */');
  Object.entries(shadows).forEach(([key, value]) => {
    if (key === 'none') {
      lines.push(`  --shadow-${key}: ${value};`);
    } else {
      // Convert to earth-tone tinted shadows
      const earthToneShadow = value.replace('rgba(0, 0, 0,', 'rgba(93, 62, 57,'); // congo-brown tint
      lines.push(`  --shadow-${key}: ${earthToneShadow};`);
    }
  });
  lines.push('');
  
  // Animations
  lines.push('  /* Animation Timing */');
  Object.entries(animations.timing).forEach(([key, value]) => {
    lines.push(`  --animation-timing-${key}: ${value};`);
  });
  lines.push('');
  
  lines.push('  /* Animation Easing */');
  Object.entries(animations.easing).forEach(([key, value]) => {
    lines.push(`  --animation-easing-${key}: ${value};`);
  });
  lines.push('');
  
  // Badge System Colors
  lines.push('  /* Badge System Colors - Earth Tones */');
  lines.push('  --badge-bronze: #8d503a; /* potters-clay */');
  lines.push('  --badge-silver: #814837; /* ironstone */');
  lines.push('  --badge-gold: #c67b22; /* ochre */');
  lines.push('  --badge-platinum: #b46c41; /* brown-rust */');
  lines.push('  --badge-green-glow: rgba(22, 163, 74, 0.3);');
  lines.push('');
  
  lines.push('}');
  lines.push('');
  
  // Dark mode
  lines.push('/* Dark mode via data attribute */');
  lines.push("[data-theme='dark'] {");
  lines.push('  /* Visionary Theme - Even Darker */');
  Object.entries(colors.dark).forEach(([key, value]) => {
    const cssKey = toKebabCase(key);
    lines.push(`  --${cssKey}: ${value};`);
  });
  lines.push('');
  lines.push('  /* Shadows - Darker */');
  Object.entries(shadows).forEach(([key, value]) => {
    if (key !== 'none') {
      const darkerShadow = value.replace(/rgba\(0, 0, 0, ([\d.]+)\)/, (_, opacity) => 
        `rgba(93, 62, 57, ${parseFloat(opacity) + 0.05})`
      );
      lines.push(`  --shadow-${key}: ${darkerShadow};`);
    }
  });
  lines.push('}');
  lines.push('');
  
  // System preference fallback
  lines.push('/* Fallback to system preference if no manual selection */');
  lines.push('@media (prefers-color-scheme: dark) {');
  lines.push('  :root:not([data-theme]) {');
  lines.push('    /* Same as dark theme above */');
  Object.entries(colors.dark).forEach(([key, value]) => {
    const cssKey = toKebabCase(key);
    lines.push(`    --${cssKey}: ${value};`);
  });
  lines.push('  }');
  lines.push('}');
  
  return lines.join('\n');
}

// Main execution
const outputPath = join(process.cwd(), 'app/generated-tokens.css');
const css = generateCSSVariables();

writeFileSync(outputPath, css, 'utf-8');
console.log(`Generated CSS tokens at ${outputPath}`);
console.log(`   Total lines: ${css.split('\n').length}`);

