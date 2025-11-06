# Custom Fonts Documentation

## Installed Fonts

Your project now has **Satoshi** and **Switzer** font families imported from `/public/`.

## Font Files Location

- **Satoshi**: `/public/Satoshi_Complete/Fonts/WEB/fonts/`
- **Switzer**: `/public/Switzer_Complete/Fonts/WEB/fonts/`

## How to Use

### Method 1: Inline Styles (React/TypeScript)

```tsx
<h1 style={{ fontFamily: 'Satoshi' }}>Heading with Satoshi</h1>
<p style={{ fontFamily: 'Switzer' }}>Paragraph with Switzer</p>
```

### Method 2: CSS Modules

```css
.title {
  font-family: 'Satoshi', sans-serif;
  font-weight: 700;
}

.body {
  font-family: 'Switzer', sans-serif;
  font-weight: 400;
}
```

### Method 3: Tailwind CSS (with inline styles)

```tsx
<div style={{ fontFamily: 'Satoshi' }} className="text-4xl font-bold">
  Satoshi Bold Heading
</div>
```

## Available Font Weights

### Satoshi
- 300 - Light
- 400 - Regular
- 500 - Medium
- 700 - Bold
- 900 - Black
- Variable font (300-900)

### Switzer
- 100 - Thin
- 200 - Extralight
- 300 - Light
- 400 - Regular
- 500 - Medium
- 600 - Semibold
- 700 - Bold
- 800 - Extrabold
- 900 - Black
- Variable font (100-900)

## Examples

### Satoshi Font Examples

```tsx
<p style={{ fontFamily: 'Satoshi', fontWeight: 300 }}>Light text</p>
<p style={{ fontFamily: 'Satoshi', fontWeight: 400 }}>Regular text</p>
<p style={{ fontFamily: 'Satoshi', fontWeight: 500 }}>Medium text</p>
<p style={{ fontFamily: 'Satoshi', fontWeight: 700 }}>Bold text</p>
<p style={{ fontFamily: 'Satoshi', fontWeight: 900 }}>Black text</p>
```

### Switzer Font Examples

```tsx
<p style={{ fontFamily: 'Switzer', fontWeight: 100 }}>Thin text</p>
<p style={{ fontFamily: 'Switzer', fontWeight: 300 }}>Light text</p>
<p style={{ fontFamily: 'Switzer', fontWeight: 400 }}>Regular text</p>
<p style={{ fontFamily: 'Switzer', fontWeight: 600 }}>Semibold text</p>
<p style={{ fontFamily: 'Switzer', fontWeight: 700 }}>Bold text</p>
```

## Default Font

The default body font is set to **Satoshi** in `app/layout.tsx`:

```tsx
<body style={{ fontFamily: 'Satoshi, sans-serif' }}>
```

## Font Loading

All fonts use:
- **Format**: WOFF2 (primary) with WOFF fallback
- **Display**: swap (for better performance)
- **Loading**: Optimized with variable fonts where available

## File Structure

```
app/
├── fonts.css          # Font-face declarations
├── globals.css        # Imports fonts.css
└── layout.tsx         # Sets default font

public/
├── Satoshi_Complete/
│   └── Fonts/WEB/fonts/
│       ├── Satoshi-Variable.woff2
│       ├── Satoshi-Regular.woff2
│       └── ...
└── Switzer_Complete/
    └── Fonts/WEB/fonts/
        ├── Switzer-Variable.woff2
        ├── Switzer-Regular.woff2
        └── ...
```
