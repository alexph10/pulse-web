# Pulse Component Design System
**Based on Signature Card Reference**

## Design Philosophy
- **Data-first**: Clean visualization of information, no gamification
- **Minimal & Modern**: Sophisticated, timeless aesthetic
- **Dark UI**: Deep backgrounds with light text for focus
- **Subtle accents**: Muted colors that don't distract from data

---

## Core Design Patterns

### **Color Palette**

```css
/* Primary Colors */
--card-background: #252c2c;           /* Deep charcoal */
--text-primary: #e4ddd3;              /* Warm cream */
--text-secondary: #a39d96;            /* Muted tan */
--text-tertiary: rgba(228, 221, 211, 0.6);

/* Data Visualization Colors */
--data-green: #2d5a3d;                /* Journal/Nature */
--data-orange: #d4774a;               /* Goals/Action */
--data-gray: #8a9199;                 /* Neutral/Check-ins */

/* Interactive States */
--hover-overlay: rgba(228, 221, 211, 0.05);
--active-overlay: rgba(228, 221, 211, 0.1);
--disabled-overlay: rgba(228, 221, 211, 0.02);

/* Backgrounds & Surfaces */
--surface-subtle: rgba(228, 221, 211, 0.08);
--divider: rgba(228, 221, 211, 0.12);
--border: rgba(228, 221, 211, 0.15);
```

---

## Typography Scale

```css
/* Display (Large Metrics) */
--text-display: 56px;
--text-display-weight: 600;
--text-display-line-height: 1;
--text-display-letter-spacing: -0.02em;

/* Title (Section Headers) */
--text-title: 15px;
--text-title-weight: 500;
--text-title-line-height: 1.4;
--text-title-letter-spacing: -0.01em;

/* Body (Main Content) */
--text-body: 13px;
--text-body-weight: 400;
--text-body-line-height: 1.5;

/* Label (Small Text) */
--text-label: 11px;
--text-label-weight: 400;
--text-label-line-height: 1.4;

/* Metric (Numbers) */
--text-metric: 22px;
--text-metric-weight: 600;
--text-metric-line-height: 1;
--text-metric-letter-spacing: -0.01em;
```

### **Typography Usage**
- **Display**: Large percentage values, hero numbers
- **Title**: Component headers, section labels
- **Body**: Descriptions, longer text content
- **Label**: Small labels, helper text, metadata
- **Metric**: Medium-sized numbers, category values

---

## Spacing Scale

```css
/* Consistent spacing system */
--space-xs: 4px;     /* Tight elements */
--space-sm: 8px;     /* Related items */
--space-md: 16px;    /* Section spacing */
--space-lg: 20px;    /* Group spacing */
--space-xl: 24px;    /* Major sections */
--space-2xl: 32px;   /* Component padding */
--space-3xl: 40px;   /* Large padding */
```

### **Spacing Usage**
- Component padding: `32px - 40px`
- Between sections: `20px - 24px`
- Between related items: `8px`
- Grid gaps: `16px - 32px`

---

## Component Anatomy

### **Card Structure**
```css
.card {
  background: #252c2c;
  border-radius: 0;              /* No border radius - all components */
  padding: 32px 40px;
  min-height: 240px;
}
```

### **Header Pattern**
```jsx
<div className="header">
  <h2 className="title">Section Title</h2>
  <div className="mainMetric">75%</div>
</div>
```

### **Category Grid**
```css
.categories {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  margin-top: 20px;
}
```

### **Dot Indicator**
```css
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 4px;
}
```

---

## Data Visualization Patterns

### **Horizontal Bar Chart**
```css
.bar {
  width: 100%;
  height: 36px;
  display: flex;
  border-radius: 2px;
  overflow: hidden;
  background: rgba(228, 221, 211, 0.08);
}

.barSegment {
  height: 100%;
  transition: width 0.3s ease;
}
```

### **Color Mapping for Data Types**
- **Journal/Writing**: `#2d5a3d` (Green)
- **Goals/Tasks**: `#d4774a` (Orange)
- **Check-ins/Meta**: `#8a9199` (Gray)
- **Mood/Sentiment**: Use gradient from green to orange
- **Activity Level**: Use opacity levels (0.2, 0.4, 0.6, 0.8, 1.0)

---

## Component Templates

### **1. Modal**
```css
/* Overlay */
background: rgba(60, 15, 51, 0.85);
backdrop-filter: blur(8px);

/* Modal Container */
background: #252c2c;
border-radius: 0;
padding: 32px;
max-width: 600px;

/* Header */
font-size: 18px;
font-weight: 600;
color: #e4ddd3;
margin-bottom: 24px;

/* Footer */
padding-top: 24px;
border-top: 1px solid rgba(228, 221, 211, 0.12);
```

### **2. Table**
```css
/* Table Container */
background: #252c2c;
border-radius: 0;

/* Header Row */
background: rgba(228, 221, 211, 0.05);
font-size: 11px;
font-weight: 500;
color: #a39d96;
text-transform: uppercase;
letter-spacing: 0.05em;
padding: 12px 16px;

/* Body Row */
padding: 16px;
border-bottom: 1px solid rgba(228, 221, 211, 0.08);
font-size: 13px;
color: #e4ddd3;

/* Hover State */
background: rgba(228, 221, 211, 0.03);
```

### **3. Form Input**
```css
/* Input Field */
background: rgba(228, 221, 211, 0.05);
border: 1px solid rgba(228, 221, 211, 0.15);
border-radius: 0;
padding: 12px 16px;
font-size: 13px;
color: #e4ddd3;

/* Focus State */
border-color: #d4774a;
background: rgba(228, 221, 211, 0.08);
outline: none;

/* Label */
font-size: 11px;
font-weight: 500;
color: #a39d96;
margin-bottom: 8px;
```

### **4. Button**
```css
/* Primary Button */
background: #d4774a;
color: #252c2c;
padding: 12px 24px;
border-radius: 0;
font-size: 13px;
font-weight: 500;

/* Secondary Button */
background: rgba(228, 221, 211, 0.08);
color: #e4ddd3;
border: 1px solid rgba(228, 221, 211, 0.15);

/* Ghost Button */
background: transparent;
color: #a39d96;
```

### **5. Divider**
```css
/* Horizontal Divider */
height: 1px;
background: rgba(228, 221, 211, 0.12);
margin: 24px 0;

/* Vertical Divider */
width: 1px;
background: rgba(228, 221, 211, 0.12);
margin: 0 24px;

/* With Label */
position: relative;
text-align: center;
&::before { content: ''; }
span {
  background: #252c2c;
  padding: 0 12px;
  font-size: 11px;
  color: #a39d96;
}
```

---

## Interaction States

### **Hover States**
```css
/* Subtle highlight */
background: rgba(228, 221, 211, 0.05);
transform: translateY(-1px);
transition: all 0.2s ease;
```

### **Active States**
```css
/* Pressed effect */
transform: translateY(0);
background: rgba(228, 221, 211, 0.1);
```

### **Focus States**
```css
/* Keyboard navigation */
outline: 2px solid #d4774a;
outline-offset: 2px;
```

### **Disabled States**
```css
opacity: 0.4;
cursor: not-allowed;
pointer-events: none;
```

---

## Responsive Breakpoints

```css
/* Mobile */
@media (width <= 480px) {
  --space-2xl: 16px;
  --space-3xl: 24px;
  --text-display: 36px;
  --text-metric: 18px;
}

/* Tablet */
@media (width <= 768px) {
  --space-2xl: 24px;
  --space-3xl: 32px;
  --text-display: 44px;
  --text-metric: 20px;
}

/* Desktop */
@media (width >= 1024px) {
  /* Use default values */
}
```

---

## Animation Guidelines

```css
/* Transitions */
--transition-fast: 0.15s ease;
--transition-base: 0.2s ease;
--transition-slow: 0.3s ease;

/* Easing Functions */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);
```

### **Animation Usage**
- **Hover**: 0.2s ease
- **Click**: 0.15s ease
- **Modal open**: 0.3s ease-out
- **Data updates**: 0.3s ease (smooth number changes)

---

## Component Checklist

When building new components, ensure:

- [ ] Uses `#252c2c` background for cards
- [ ] Text colors: `#e4ddd3` (primary), `#a39d96` (secondary)
- [ ] Padding: `32px - 40px` for large components
- [ ] Border radius: `0` (no border radius on any elements)
- [ ] Typography follows the scale (11px, 13px, 15px, 22px, 56px)
- [ ] Spacing uses the scale (4px, 8px, 16px, 20px, 24px, 32px, 40px)
- [ ] Data colors: Green (#2d5a3d), Orange (#d4774a), Gray (#8a9199)
- [ ] Transitions are smooth (0.2s - 0.3s ease)
- [ ] Responsive down to 480px width
- [ ] Accessible (keyboard navigation, ARIA labels)
- [ ] Dark-first design (no light mode compromises)

---

## Next Components to Build

1. **Modal** - Use overlay + card pattern
2. **Table** - Use card background + row hover states
3. **DatePicker** - Use card background + popover pattern
4. **Divider** - Simple line with optional label
5. **Tooltip** - Small card with 8px padding
6. **Tabs** - Underline pattern like your page toggle
7. **Form Fields** - Subtle background with focus states

---

**Last Updated**: Now
**Reference**: Signature Card (Weekly Task Completion)

