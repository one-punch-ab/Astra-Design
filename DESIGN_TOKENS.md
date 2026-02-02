# Astra DSM 2.0 - Design Tokens

Quick reference for design tokens and values from the Astra Design System.

## Colors

### Brand
```css
--color-primary: #173DA6;
--color-secondary: #007AF5;
```

### Text
```css
--color-text-primary: #18181B;
--color-text-secondary: #3F3F46;
```

### Common UI Colors (to be extracted from Figma as needed)
- Error/Destructive states
- Success states
- Warning states
- Info states
- Disabled states

## Typography

### Font Sizes
```css
--text-heading-1: 18px;
--text-heading-2: 16px;
--text-heading-3: 14px;
--text-body: 14px;
--text-secondary: 12-13px;
--text-mini: 12px;
--text-micro: 11px;
```

### Font Weights
```css
--font-regular: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

## Spacing

### Component Padding
```css
--padding-regular: 20px;
--padding-compact: 16px;
--padding-small: 12px;
--padding-button-horizontal: 16px;
--padding-button-vertical: 8px;
```

### Component Margins
```css
--margin-section: 32px;
--margin-section-small: 24px;
--margin-related: 16px;
--margin-form-field: 12px;
```

## Component Sizes

### Buttons
```css
--button-height-regular: 32px;
--button-height-mini: 24px;
--button-height-micro: 20px;
```

### Input Fields
```css
--input-height-regular: 54px;
--input-height-secondary: 50px;
--textarea-height-regular: 118px;
--compose-box-height: 140px;
```

### Icons
```css
--icon-size-standard: 24px;
--icon-size-micro: 20px;
--icon-size-mini: 16px;
```

### Avatars
```css
--avatar-size-standard: 32px;
--avatar-size-template: 48px;
```

### Cards
```css
--card-agent-template: 321px × 170px;
--card-agent: 321px × 180px;
--card-action: 348px × 80px;
--card-conversation: 300px × 96px;
```

### Tags & Badges
```css
--tag-height-regular: 24px;
--tag-height-mini: 20px;
--badge-height: 20px;
```

### Navigation
```css
--lnb-collapsed: 64px;
--lnb-expanded: 224px;
--top-nav-height: 54px;
--tab-height-horizontal: 30px;
--tab-height-vertical: 36px;
--tab-height-file: 44px;
```

### Modals
```css
--modal-regular-width: 512px;
--modal-xl: 1440px × 840px;
```

### Toast & Banners
```css
--toast-size: 373px × 72px;
--banner-width: 1205px;
--banner-height: 36px;
```

## Border Radius

```css
--radius-small: 4px;
--radius-medium: 6px;
--radius-large: 8px;
--radius-button: 6px;
--radius-card: 8px;
--radius-modal: 12px;
```

## Transitions

```css
--transition-fast: 150ms;
--transition-normal: 200ms;
--transition-slow: 300ms;
--easing-default: cubic-bezier(0.4, 0.0, 0.2, 1);
```

## Z-Index Layers

```css
--z-dropdown: 1000;
--z-sticky: 1020;
--z-fixed: 1030;
--z-modal-backdrop: 1040;
--z-modal: 1050;
--z-popover: 1060;
--z-tooltip: 1070;
```

## Breakpoints

```css
--breakpoint-mobile: 320px;
--breakpoint-tablet: 768px;
--breakpoint-desktop: 1024px;
--breakpoint-wide: 1440px;
```

## Usage Notes

1. **Component sizes are fixed** - Use exact pixel values from the design system
2. **Colors should be used as CSS variables** - Makes theming easier
3. **Spacing should follow the scale** - Use multiples of 4px where possible
4. **Icons are SVG-based** - Scale appropriately while maintaining crispness
5. **Responsive behavior** - Adapt layouts, not component sizes

## Implementation Example

```css
/* Example button implementation */
.button-primary {
  height: var(--button-height-regular);
  padding: var(--padding-button-vertical) var(--padding-button-horizontal);
  background-color: var(--color-primary);
  color: white;
  border-radius: var(--radius-button);
  transition: background-color var(--transition-normal) var(--easing-default);
}

.button-primary:hover {
  background-color: color-mix(in srgb, var(--color-primary) 90%, black);
}
```

---

**Note**: This is a reference document. Actual implementation values should be verified against the Figma design system. Use the Figma MCP tools to extract exact values when building components.
