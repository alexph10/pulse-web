# Divider Component

A simple, flexible divider component for creating visual separation between sections.

## Features

- Horizontal and vertical orientations
- Optional text label
- Spacing variants (sm, md, lg)
- Fully accessible
- Responsive

## Usage

```tsx
import { Divider } from '@/app/components/ui'

// Basic horizontal divider
<Divider />

// With label
<Divider label="Section Title" />

// Spacing variants
<Divider spacing="sm" />  // 16px margin
<Divider spacing="md" />  // 24px margin (default)
<Divider spacing="lg" />  // 32px margin

// Vertical divider
<Divider orientation="vertical" />
```

## API

### Props

- `orientation?: 'horizontal' | 'vertical'` - Divider orientation (default: 'horizontal')
- `label?: string` - Optional text label (only for horizontal)
- `spacing?: 'sm' | 'md' | 'lg'` - Margin spacing (default: 'md')
- `className?: string` - Additional CSS classes

## Examples

### Section Separator
```tsx
<h2>Section 1</h2>
<p>Content...</p>
<Divider />
<h2>Section 2</h2>
```

### With Label
```tsx
<Divider label="Analytics" />
<Divider label="Settings" />
```

### Vertical in Flex Layout
```tsx
<div style={{ display: 'flex', alignItems: 'center' }}>
  <span>Left</span>
  <Divider orientation="vertical" />
  <span>Right</span>
</div>
```

## Styling

- Color: `rgba(228, 221, 211, 0.12)` (subtle)
- Height/Width: 1px
- Label: 11px uppercase, letter-spaced
- Fully responsive

## Demo

Visit `/design-system/components-demo` to see live examples.








