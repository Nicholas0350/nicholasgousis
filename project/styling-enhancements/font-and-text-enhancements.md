# Font & Text Enhancement Plan

## 1. Font Setup ✅
### Primary Fonts
- [x] Geist Sans (body text)
- [x] Geist Mono (code/technical content)
- [x] Add Space Grotesk (headings)
  - Added Google Fonts CDN
  - Configured in Tailwind
  - Added font utilities

### Font Variables in layout.tsx ✅
```typescript
// Using Google Fonts CDN instead of local fonts
// Configured in <head> with preconnect links
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet" />
```

## 2. Typography Scale in tailwind.config.ts

```typescript
theme: {
  extend: {
    fontSize: {
      'display-1': ['6rem', { lineHeight: '1', letterSpacing: '-0.03em', fontWeight: '700' }],
      'display-2': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.03em', fontWeight: '700' }],
      'h1': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '600' }],
      'h2': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '600' }],
      'h3': ['2.25rem', { lineHeight: '1.2', fontWeight: '600' }],
      'h4': ['1.875rem', { lineHeight: '1.2', fontWeight: '500' }],
      'body-xl': ['1.5rem', { lineHeight: '1.5', fontWeight: '400' }],
      'body-lg': ['1.25rem', { lineHeight: '1.5', fontWeight: '400' }],
      'body': ['1rem', { lineHeight: '1.5', fontWeight: '400' }],
      'small': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
      'xs': ['0.75rem', { lineHeight: '1.5', fontWeight: '400' }],
    }
  }
}
```

Usage examples:
```jsx
// Display text
<h1 className="font-heading text-display-1">Large Title</h1>

// Headings
<h2 className="font-heading text-h2">Section Title</h2>

// Body text
<p className="text-body-lg">Large paragraph text</p>
<p className="text-body">Regular paragraph text</p>
<p className="text-small">Small text</p>
```

## 3. Text Colors & Opacity in globals.css

```css
:root {
  --text-primary: 1;
  --text-secondary: 0.85;
  --text-tertiary: 0.7;

  --color-text-primary: 20 20 30;
  --color-text-secondary: 71 84 103;
  --color-text-tertiary: 107 114 128;
}

.dark {
  --color-text-primary: 255 255 255;
  --color-text-secondary: 226 232 240;
  --color-text-tertiary: 148 163 184;
}

.text-gradient {
  @apply bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-primary;
}

.text-balance {
  text-wrap: balance;
}
```

## 4. Implementation Checklist

### Font Integration
- [x] Add Cabinet Grotesk font file
- [x] Update layout.tsx with variable font
- [x] Add font-display: swap
- [ ] Test font loading

### Typography Updates
- [ ] Update tailwind config
- [ ] Add text gradient utilities
- [ ] Test responsive behavior

### Component Updates
- [ ] Hero Section (display-1)
- [ ] About Section (h2)
- [ ] Services Section (h3)
- [ ] Portfolio Section (h2)
- [ ] Contact Section (h3)

### Responsive Design
- [ ] Mobile (80% scale)
- [ ] Tablet (90% scale)
- [ ] Desktop (100% scale)
- [ ] Large screens (120% scale)

## 5. Testing Requirements

### Performance
- [ ] Font loading optimization
- [ ] FOUT handling
- [ ] Bundle size impact

### Accessibility
- [ ] Contrast ratios (WCAG)
- [ ] Readable font sizes
- [ ] Proper heading hierarchy

### Cross-browser
- [ ] Chrome, Firefox, Safari, Edge
- [ ] Mobile browsers
- [ ] Print stylesheet
