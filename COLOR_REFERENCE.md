# Pulse Color Palette - Quick Reference

## Brand Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Primary** | `#B91C1C` | `rgb(185, 28, 28)` | Main brand color, primary actions |
| **Secondary** | `#991B1B` | `rgb(153, 27, 27)` | Hover states, secondary CTAs |
| **Tertiary** | `#7F1D1D` | `rgb(127, 29, 29)` | Active states, pressed buttons |
| **Darkest** 🆕 | `#5F1010` | `rgb(95, 16, 16)` | Deep backgrounds, ultra-dark accents |
| **Light** | `#DC2626` | `rgb(220, 38, 38)` | Lighter accents, highlights |
| **Subtle** | `rgba(185, 28, 28, 0.06)` | - | Background overlays |
| **Subtle Dark** 🆕 | `rgba(95, 16, 16, 0.4)` | - | Dark red overlays |

---

## Dark Theme Backgrounds

| Name | Hex | RGB | Brightness | Usage |
|------|-----|-----|------------|-------|
| **Base** | `#000000` | `rgb(0, 0, 0)` | 0 | App background |
| **Elevated** | `#0A0A0A` | `rgb(10, 10, 10)` | +10 | Slightly raised surfaces |
| **Surface** | `#141414` | `rgb(20, 20, 20)` | +20 | Cards, modals |
| **Surface Elevated** 🆕 | `#1A1A1A` | `rgb(26, 26, 26)` | +26 | Multi-layer elevation |
| **Surface Hover** | `#1F1F1F` | `rgb(31, 31, 31)` | +31 | Hover states |

**Color Steps:**
```
#000000 → #0A0A0A (+10) → #141414 (+10) → #1A1A1A (+6) → #1F1F1F (+5)
```

---

## Text Colors

| Name | Hex | RGB | Opacity | Usage |
|------|-----|-----|---------|-------|
| **Primary** | `#FAFAFA` | `rgb(250, 250, 250)` | 100% | Body text, headings |
| **Secondary** | `#8A8A8A` | `rgb(138, 138, 138)` | 100% | Supporting text, labels |
| **Tertiary** | `#5A5A5A` | `rgb(90, 90, 90)` | 100% | Muted text, placeholders |
| **Disabled** | `#3A3A3A` | `rgb(58, 58, 58)` | 100% | Disabled states |
| **Inverse** | `#000000` | `rgb(0, 0, 0)` | 100% | Text on light backgrounds |

**Contrast Ratios (on #000000):**
- Primary: **19.5:1** (AAA+)
- Secondary: **5.8:1** (AA)
- Tertiary: **3.5:1** (AA Large Text)

---

## Border Colors

| Name | Value | Opacity | Usage |
|------|-------|---------|-------|
| **Subtle** | `rgba(255, 255, 255, 0.05)` | 5% | Subtle dividers |
| **Base** | `rgba(255, 255, 255, 0.08)` | 8% | Standard borders |
| **Emphasis** | `rgba(255, 255, 255, 0.12)` | 12% | Emphasized borders |
| **Strong** | `rgba(255, 255, 255, 0.16)` | 16% | Strong borders |

**Opacity Progression:** 5% → 8% → 12% → 16%

---

## Shadow System

### Standard Shadows

| Name | Value | Strength |
|------|-------|----------|
| **Small** | `0 1px 2px 0 rgba(0, 0, 0, 0.3)` | Light |
| **Medium** | `0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)` | Medium |
| **Large** | `0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.4)` | Heavy |
| **Extra Large** | `0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 10px 10px -5px rgba(0, 0, 0, 0.5)` | Very Heavy |

### Brand Shadows

| Name | Value | Usage |
|------|-------|-------|
| **Brand** | `0 8px 16px -4px rgba(185, 28, 28, 0.4)` | Brand-colored shadows |
| **Glow** | `0 0 20px rgba(185, 28, 28, 0.5)` | Glow effects |

**Shadow Opacity Progression:** 0.3 → 0.4 → 0.5 → 0.6

---

## Semantic Colors

### Success

| Variant | Hex | RGB | Usage |
|---------|-----|-----|-------|
| Base | `#10B981` | `rgb(16, 185, 129)` | Success states |
| Light | `#34D399` | `rgb(52, 211, 153)` | Hover/Light variant |
| Dark | `#059669` | `rgb(5, 150, 105)` | Active/Dark variant |
| Background | `rgba(16, 185, 129, 0.1)` | - | Success backgrounds |
| Border | `rgba(16, 185, 129, 0.3)` | - | Success borders |

### Error

| Variant | Hex | RGB | Usage |
|---------|-----|-----|-------|
| Base | `#EF4444` | `rgb(239, 68, 68)` | Error states |
| Light | `#F87171` | `rgb(248, 113, 113)` | Hover/Light variant |
| Dark | `#DC2626` | `rgb(220, 38, 38)` | Active/Dark variant |
| Background | `rgba(239, 68, 68, 0.1)` | - | Error backgrounds |
| Border | `rgba(239, 68, 68, 0.3)` | - | Error borders |

### Warning

| Variant | Hex | RGB | Usage |
|---------|-----|-----|-------|
| Base | `#F59E0B` | `rgb(245, 158, 11)` | Warning states |
| Light | `#FBBF24` | `rgb(251, 191, 36)` | Hover/Light variant |
| Dark | `#D97706` | `rgb(217, 119, 6)` | Active/Dark variant |
| Background | `rgba(245, 158, 11, 0.1)` | - | Warning backgrounds |
| Border | `rgba(245, 158, 11, 0.3)` | - | Warning borders |

### Info

| Variant | Hex | RGB | Usage |
|---------|-----|-----|-------|
| Base | `#3B82F6` | `rgb(59, 130, 246)` | Info states |
| Light | `#60A5FA` | `rgb(96, 165, 250)` | Hover/Light variant |
| Dark | `#2563EB` | `rgb(37, 99, 235)` | Active/Dark variant |
| Background | `rgba(59, 130, 246, 0.1)` | - | Info backgrounds |
| Border | `rgba(59, 130, 246, 0.3)` | - | Info borders |

---

## Mood Colors (10 Moods)

Each mood has 4 variants: `base`, `light`, `dark`, `bg`

| Mood | Base Color | Hex | Usage |
|------|------------|-----|-------|
| **Joyful** | Emerald Green | `#10B981` | Positive emotions |
| **Calm** | Blue | `#3B82F6` | Peaceful states |
| **Energized** | Purple | `#8B5CF6` | Active/excited |
| **Grateful** | Pink | `#EC4899` | Thankful feelings |
| **Reflective** | Cyan | `#06B6D4` | Contemplative |
| **Neutral** | Gray | `#6B7280` | Balanced |
| **Anxious** | Amber | `#F59E0B` | Worried states |
| **Frustrated** | Red | `#EF4444` | Anger/frustration |
| **Sad** | Slate | `#64748B` | Low mood |
| **Overwhelmed** | Orange | `#F97316` | Stressed |

---

## Chart Colors

### Primary Scale (Brand Reds)
```
#B91C1C → #DC2626 → #EF4444 → #F87171 → #FCA5A5
```

### Sequential (Multi-color)
```
#10B981 → #3B82F6 → #8B5CF6 → #EC4899 → #F59E0B
```

### Categorical (8 Colors)
```
#B91C1C | #3B82F6 | #10B981 | #F59E0B | #8B5CF6 | #EC4899 | #06B6D4 | #EF4444
```

---

## Gradients

| Name | Value | Usage |
|------|-------|-------|
| **Brand** | `linear-gradient(135deg, #B91C1C 0%, #991B1B 100%)` | Primary brand gradient |
| **Brand Subtle** | `linear-gradient(135deg, rgba(185,28,28,0.1) 0%, rgba(153,27,27,0.05) 100%)` | Subtle backgrounds |
| **Dark** | `linear-gradient(180deg, #000000 0%, #0A0A0A 100%)` | Dark gradients |
| **Mood Positive** | `linear-gradient(135deg, #10B981 0%, #3B82F6 100%)` | Positive emotions |
| **Mood Negative** | `linear-gradient(135deg, #EF4444 0%, #F59E0B 100%)` | Negative emotions |
| **Surface** | `linear-gradient(180deg, #141414 0%, #0A0A0A 100%)` | Surface gradients |

---

## Usage Guidelines

### When to Use Each Background

- **Base (#000000)**: Main app background, page backgrounds
- **Elevated (#0A0A0A)**: Navigation bars, sidebars
- **Surface (#141414)**: Cards, panels, main content areas
- **Surface Elevated (#1A1A1A)**: Nested cards, popovers, tooltips
- **Surface Hover (#1F1F1F)**: Hover states on interactive surfaces

### When to Use Each Text Color

- **Primary (#FAFAFA)**: 
  - Body text (minimum 14px)
  - Headings
  - Important labels
  - CTAs

- **Secondary (#8A8A8A)**:
  - Supporting text
  - Form labels
  - Metadata (dates, counts)
  - Secondary headings

- **Tertiary (#5A5A5A)**:
  - Placeholders
  - Help text
  - Captions
  - Disabled text labels
  - **Only use for 14px+ text**

- **Disabled (#3A3A3A)**:
  - Disabled state text
  - Inactive elements
  - **Minimum 18px text size**

### When to Use Each Shadow

- **Small**: Buttons, inputs, small cards
- **Medium**: Standard cards, dropdowns, tooltips
- **Large**: Modals, popovers, elevated panels
- **Extra Large**: Full-screen modals, important dialogs
- **Brand**: Brand-colored elements (CTAs, highlights)
- **Glow**: Focus states, active elements, notifications

---

## Component Defaults

### Buttons
- Primary: `background: #B91C1C`, `shadow: medium`
- Secondary: `border: 1.5px solid #B91C1C`, `shadow: small`
- Tertiary: `background: #141414`, `border: subtle`, `shadow: small`
- Ghost: `background: transparent`, `shadow: none`

### Cards
- Default: `background: #141414`, `border: subtle`, `shadow: none`
- Hoverable: `hover: shadow-medium`
- Clickable: `hover: shadow-medium`, `active: shadow-small`

### Inputs
- Default: `background: #141414`, `border: base`, `shadow: small`
- Focus: `border: #B91C1C`, `shadow: medium + focus-ring`
- Error: `border: #EF4444`, `background: rgba(239,68,68,0.04)`

### Modals
- Overlay: `background: rgba(0,0,0,0.75)`, `blur: 12px`
- Content: `background: #141414`, `border: subtle`, `shadow: xl`

---

## Accessibility

### Minimum Contrast Ratios

| Text Level | Contrast Required | Primary | Secondary | Tertiary |
|------------|-------------------|---------|-----------|----------|
| **Small Text (< 14px)** | 7:1 (AAA) | ✓ 19.5:1 | ✗ 5.8:1 | ✗ 3.5:1 |
| **Body Text (14-18px)** | 4.5:1 (AA) | ✓ 19.5:1 | ✓ 5.8:1 | ✗ 3.5:1 |
| **Large Text (18px+)** | 3:1 (AA) | ✓ 19.5:1 | ✓ 5.8:1 | ✓ 3.5:1 |

### Recommendations
- Use **Primary** for all body text
- Use **Secondary** for 14px+ supporting text
- Use **Tertiary** only for 18px+ decorative text
- Never use Disabled for important information

---

## Preview Links

- **Full Color System**: `/design-system/colors`
- **Component Library**: `/design-system/ui-library`
- **Button Variants**: `/design-system/components-demo`
- **Modal Examples**: `/design-system/modal-demo`

---

*Last updated: November 24, 2025*
*Pulse Design System v2.0 - Dark Theme*
