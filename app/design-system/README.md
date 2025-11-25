# Pulse Design System

## Structure

```
design-system/
├── page.tsx              # Original component showcase
├── reference/            # NEW: Design patterns reference
│   ├── page.tsx         # Visual reference page
│   └── reference.module.css
└── README.md            # This file
```

## Design System Resources

### **1. Pattern Documentation**
[`/COMPONENT_DESIGN_SYSTEM.md`](../../COMPONENT_DESIGN_SYSTEM.md) (Root)
- Complete design patterns guide
- Component templates (Modal, Table, Input, Button, etc.)
- Color palette with hex codes
- Typography scale
- Spacing system
- Animation guidelines
- Component checklist

### **2. CSS Variables**
[`app/components/ui/design-system.css`](../components/ui/design-system.css)
- All design tokens as CSS variables (`--ds-*`)
- Utility classes for quick prototyping
- Responsive breakpoints
- Import this into any component:
  ```css
  @import '@/app/components/ui/design-system.css';
  ```

### **3. Visual Reference**
**URL**: `/design-system/reference`
- Live component examples
- Color swatches
- Typography scale preview
- Spacing visualization
- Interactive card pattern example

### **4. Original Component Library**
**URL**: `/design-system`
- Existing component showcase
- Button, Card, Input examples
- Color and spacing tokens

---

## Quick Start

### **1. Using CSS Variables**

```tsx
// In your component's CSS module
.myCard {
  background: var(--ds-card-background);
  padding: var(--ds-space-2xl) var(--ds-space-3xl);
  color: var(--ds-text-primary);
}

.myTitle {
  font-size: var(--ds-text-title);
  font-weight: var(--ds-weight-medium);
}
```

### **2. Using Utility Classes**

```tsx
import '@/app/components/ui/design-system.css'

<div className="ds-card">
  <h1 className="ds-text-display">75%</h1>
  <p className="ds-text-label">Completion Rate</p>
</div>
```

### **3. Following Patterns**

Reference [`COMPONENT_DESIGN_SYSTEM.md`](../../COMPONENT_DESIGN_SYSTEM.md) for:
- Component templates (copy-paste ready CSS)
- Color usage guidelines
- Spacing rules
- Animation patterns

---

## Component Checklist

When building new components:

- [ ] Uses `#252c2c` background for cards
- [ ] Text: `#e4ddd3` (primary), `#a39d96` (secondary)
- [ ] Padding: `32px-40px` for large components
- [ ] Border radius: `0` (no border radius on any elements)
- [ ] Typography scale (11px, 13px, 15px, 22px, 56px)
- [ ] Spacing scale (4px, 8px, 16px, 20px, 24px, 32px, 40px)
- [ ] Data colors: Green, Orange, Gray
- [ ] Smooth transitions (0.2s-0.3s)
- [ ] Responsive down to 480px
- [ ] Accessible (keyboard + ARIA)

---

## Next Steps

Build these components using the design system:

1. **Modal** - Card pattern + overlay
2. **Table** - Row hover states + card background
3. **DatePicker** - Popover + card pattern
4. **Divider** - Simple line with optional label
5. **Tooltip** - Mini card with small padding
6. **Form Fields** - Subtle backgrounds + focus states

Each component template is in `COMPONENT_DESIGN_SYSTEM.md`!

---

**Last Updated**: Now
**Based On**: Signature Card (Weekly Task Completion)

