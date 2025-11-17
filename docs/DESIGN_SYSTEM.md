# Pulse Design System

**Version:** 1.0.0  
**Last Updated:** January 2025

## Philosophy

Pulse uses an **earth-tone, no-gray** design system with:
- **8px spacing base** for consistent rhythm
- **Accessibility-first** approach (WCAG AA compliance)
- **Single source of truth** - CSS generated from TypeScript tokens
- **Type-safe** token access via helpers

---

## Design Tokens

### Colors

**Visionary Earth Tone Theme (Primary)**

All colors use earth tones - no gray. Colors are semantic and meaningful.

```tsx
// Correct - Use CSS variables
<div style={{ background: 'var(--accent-primary)' }}>
<div style={{ color: 'var(--text-primary)' }}>

// Wrong - Hardcoded colors
<div style={{ background: '#c2593f' }}>
<div style={{ color: '#ffedc1' }}>
```

**Available Color Tokens:**
- `--background`, `--background-secondary`
- `--surface`, `--surface-elevated`
- `--text-primary`, `--text-secondary`, `--text-tertiary`, `--text-disabled`
- `--accent-primary`, `--accent-primary-hover`, `--accent-primary-active`
- `--accent-secondary`, `--accent-muted`, `--accent-subtle`
- `--border-subtle`, `--border-emphasis`, `--border-strong`
- `--success`, `--error`, `--warning`, `--info`

### Spacing

**8px-based spacing scale**

```tsx
// Correct
<div style={{ padding: 'var(--spacing-lg)' }}>  // 16px
<div style={{ margin: 'var(--spacing-xl)' }}>   // 24px
<div style={{ gap: 'var(--spacing-md)' }}>      // 12px

// Wrong
<div style={{ padding: '16px' }}>
<div style={{ margin: '24px' }}>
```

**Available Spacing Tokens:**
- `--spacing-xs`: 4px
- `--spacing-sm`: 8px
- `--spacing-md`: 12px
- `--spacing-lg`: 16px
- `--spacing-xl`: 24px
- `--spacing-2xl`: 32px
- `--spacing-3xl`: 48px
- `--spacing-4xl`: 64px
- `--spacing-5xl`: 96px

**Compact Spacing (0.75x multiplier):**
- `--spacing-compact-xs` through `--spacing-compact-5xl`

### Typography

**Typography scale with consistent hierarchy**

```tsx
// Correct
<h1 style={{ fontSize: 'var(--font-size-h1)' }}>
<p style={{ fontSize: 'var(--font-size-body)' }}>

// Wrong
<h1 style={{ fontSize: '48px' }}>
<p style={{ fontSize: '16px' }}>
```

**Available Typography Tokens:**
- `--font-size-h1`: 48px
- `--font-size-h2`: 36px
- `--font-size-h3`: 24px
- `--font-size-h4`: 20px
- `--font-size-body`: 16px
- `--font-size-small`: 14px
- `--font-size-tiny`: 12px

**Font Families:**
- `--font-family-satoshi`: Primary UI font
- `--font-family-switzer`: Body text font
- `--font-family-garamond`: Serif for journal entries

### Borders

```tsx
// Correct
<div style={{ 
  borderRadius: 'var(--border-radius-lg)',
  border: 'var(--border-width-thin) solid var(--border-subtle)'
}}>

// Wrong
<div style={{ borderRadius: '12px', border: '1px solid #5d3e39' }}>
```

**Available Border Tokens:**
- Radius: `--border-radius-sm`, `--border-radius-md`, `--border-radius-lg`, `--border-radius-xl`, `--border-radius-full`
- Width: `--border-width-thin`, `--border-width-medium`, `--border-width-thick`

### Shadows

```tsx
// Correct
<div style={{ boxShadow: 'var(--shadow-md)' }}>

// Wrong
<div style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' }}>
```

**Available Shadow Tokens:**
- `--shadow-none`
- `--shadow-sm`
- `--shadow-md`
- `--shadow-lg`
- `--shadow-xl`

### Animations

```tsx
// Correct
<div style={{ 
  transition: `all var(--animation-timing-standard) var(--animation-easing-easeOut)`
}}>

// Wrong
<div style={{ transition: 'all 200ms ease-out' }}>
```

**Available Animation Tokens:**
- Timing: `--animation-timing-micro`, `--animation-timing-standard`, `--animation-timing-smooth`, `--animation-timing-slow`
- Easing: `--animation-easing-easeIn`, `--animation-easing-easeOut`, `--animation-easing-easeInOut`, `--animation-easing-spring`

---

## Type-Safe Helpers

Use the type-safe helpers for better developer experience:

```tsx
import { tokens, componentStyles, typographyStyles } from '@/lib/design-tokens/helpers';

// Spacing
<div style={{ padding: tokens.spacing('lg') }}>

// Colors
<div style={{ background: tokens.color('accent-primary') }}>

// Typography
<h1 style={typographyStyles.h1}>Title</h1>

// Pre-composed styles
<div style={componentStyles.card}>
```

---

## Component Patterns

### Cards

```tsx
// Use the Card component from app/components/ui/Card.tsx
import { Card } from '@/components/ui';

<Card elevation={2} hoverable>
  Content
</Card>
```

### Buttons

```tsx
// Use the Button component from app/components/ui/Button.tsx
import { Button } from '@/components/ui';

<Button variant="primary" size="md">
  Click me
</Button>
```

### Forms

```tsx
// Use Input/Textarea components
import { Input, Textarea } from '@/components/ui';

<Input placeholder="Enter text" />
<Textarea placeholder="Enter longer text" />
```

---

## Accessibility Standards

### Contrast Ratios

All text must meet WCAG AA standards:
- **Normal text**: 4.5:1 contrast ratio minimum
- **Large text (18px+)**: 3:1 contrast ratio minimum

Use the contrast checker:
```tsx
import { checkContrast } from '@/lib/design-tokens/helpers';

const isAccessible = checkContrast('#ffedc1', '#363d49'); // true
```

### Touch Targets

Minimum touch target size: **44px × 44px** (iOS/Android standard)

```tsx
// Correct
<button style={{ minHeight: '44px', minWidth: '44px' }}>

// Wrong
<button style={{ height: '32px', width: '32px' }}>
```

### Focus States

All interactive elements must have visible focus states:

```css
/* Automatically applied via globals.css */
*:focus-visible {
  outline: 2px solid var(--accent-primary);
  outline-offset: 2px;
}
```

---

## Usage Guidelines

### DO

- Use CSS variables from `generated-tokens.css`
- Use type-safe helpers in TypeScript/JSX
- Follow the 8px spacing grid
- Check contrast ratios for accessibility
- Use semantic color names
- Document custom component styles

### DON'T

- Hardcode colors (`#c2593f`, `rgb(...)`, `rgba(...)`)
- Hardcode spacing (`16px`, `24px`, `1rem`)
- Hardcode font sizes (`18px`, `20px`)
- Use gray colors (use earth tones instead)
- Create new tokens without updating TypeScript source
- Bypass the design system for "quick fixes"

---

## Adding New Tokens

1. **Add to TypeScript source** (`lib/design-tokens/`)
2. **Run generation script**: `npm run design:generate`
3. **Use in CSS**: Reference the generated CSS variable
4. **Update documentation**: Add to this file

---

## Migration Guide

### From Hardcoded to Tokens

**Before:**
```css
.button {
  padding: 16px 24px;
  background: #c2593f;
  color: #ffffff;
  border-radius: 8px;
}
```

**After:**
```css
.button {
  padding: var(--spacing-lg) var(--spacing-xl);
  background: var(--accent-primary);
  color: var(--text-primary);
  border-radius: var(--border-radius-md);
}
```

---

## Tools & Scripts

- `npm run design:generate` - Generate CSS from TypeScript tokens
- `npm run design:validate` - Validate design token usage
- `npm run lint:css` - Lint CSS files for violations

---

## Resources

- [Design Tokens Source](../lib/design-tokens/)
- [Generated CSS](../app/generated-tokens.css)
- [Type-Safe Helpers](../lib/design-tokens/helpers.ts)

