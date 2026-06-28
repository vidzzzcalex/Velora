---
name: Velora OS
colors:
  surface: '#faf9f9'
  surface-dim: '#dbdad9'
  surface-bright: '#faf9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f3'
  surface-container: '#efeded'
  surface-container-high: '#e9e8e8'
  surface-container-highest: '#e3e2e2'
  on-surface: '#1b1c1c'
  on-surface-variant: '#444748'
  inverse-surface: '#2f3031'
  inverse-on-surface: '#f2f0f0'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  secondary: '#755a2a'
  on-secondary: '#ffffff'
  secondary-container: '#fcd89c'
  on-secondary-container: '#775d2d'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1d1b1a'
  on-tertiary-container: '#868381'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474646'
  secondary-fixed: '#ffdea9'
  secondary-fixed-dim: '#e5c188'
  on-secondary-fixed: '#271900'
  on-secondary-fixed-variant: '#5b4315'
  tertiary-fixed: '#e6e1df'
  tertiary-fixed-dim: '#cac6c3'
  on-tertiary-fixed: '#1d1b1a'
  on-tertiary-fixed-variant: '#484645'
  background: '#faf9f9'
  on-background: '#1b1c1c'
  surface-variant: '#e3e2e2'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 72px
    fontWeight: '400'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '400'
    lineHeight: '1.1'
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '400'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: -0.01em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  gutter: 24px
  margin-mobile: 24px
  margin-desktop: 64px
  section-gap: 120px
---

## Brand & Style

This design system embodies the intersection of high-end editorial publishing and advanced automotive intelligence. The personality is quiet, confident, and authoritative—eschewing the frantic aesthetics of typical software for the calm, curated experience of a luxury museum or a premium lifestyle periodical.

The visual language draws heavily from **Minimalism** and **Editorial** traditions. It prioritizes "negative space as a feature," using generous margins to create a sense of exclusivity and focus. Layouts should feel like a bespoke composition rather than a rigid grid, utilizing asymmetrical balance and organic curved transitions to soften the technological edge of the AI operating system. The emotional goal is to provide the user with a "digital sanctuary"—a place where complex urban mobility becomes a serene, guided experience.

## Colors

The palette is anchored by **Warm Ivory**, which provides a softer, more organic foundation than pure clinical white. **Luxury Black** is used for primary information and structural elements, ensuring high-contrast legibility and a sense of permanence. 

**Minimal Gold** is reserved strictly for high-value interactions, AI status indicators, and subtle branding accents; it should be used sparingly to maintain its premium impact. **Soft Grey** serves as the utility color for secondary metadata, thin dividers, and inactive states, ensuring the interface remains uncluttered and hierarchical.

## Typography

The typographic strategy relies on the tension between the classical elegance of **Playfair Display** and the systematic clarity of **Inter**. 

Headlines should be treated as hero elements, often using large-scale sizes to create an editorial focal point. For long-form reading and technical data, Inter provides a neutral, highly readable counterpoint. Labels and small metadata should utilize uppercase styling with increased letter spacing to mimic the look of luxury mastheads and architectural signage.

## Layout & Spacing

This design system utilizes a **Fluid Grid** with wide margins to create a "letterboxed" feel. The layout philosophy is asymmetrical; elements should not always align to a central axis, but rather feel placed with intent, similar to a high-fashion magazine spread.

- **Desktop:** A 12-column grid with 64px outer margins and 24px gutters.
- **Mobile:** A 4-column grid with 24px margins.
- **Vertical Rhythm:** Use large vertical gaps (section-gap) between major content blocks to allow the eye to rest. Organic, sweeping curves should be used to transition between different background containers rather than harsh straight lines.

## Elevation & Depth

To maintain a flat, editorial aesthetic, standard drop shadows are prohibited. Instead, hierarchy is established through:

1.  **Tonal Layers:** Using slight variations of the Warm Ivory background or Soft Grey for container backgrounds.
2.  **Backdrop Blurs:** High-end "Glassmorphism" is used for floating navigation bars or overlays, with a 20px-40px blur radius and low-opacity Ivory tint.
3.  **Thin Dividers:** Use 0.5px or 1px strokes in Soft Grey (#8E8E8E at 30% opacity) to separate content sections without adding visual weight.
4.  **Organic Overlaps:** Elements like image masks may slightly overlap text blocks to create depth without the need for shadows.

## Shapes

The shape language is a blend of sharp, architectural lines and soft, organic curves. While the base roundedness is `0.5rem`, image masks and primary containers should utilize significantly larger, non-uniform curves (e.g., a "squircle" or a custom organic path) to feel more like natural objects and less like digital blocks.

Buttons and input fields should maintain a consistent `Rounded` (0.5rem) corner radius to ensure they feel modern and tactile but not overly "bubbly" or playful.

## Components

### Buttons
Primary buttons are solid Luxury Black with white text. Secondary buttons use a Thin Divider style with a ghost border. All button interactions must be eased with a 300ms cubic-bezier transition.

### Input Fields
Minimalist under-line style or very light-filled containers. Focus states should be indicated by the label shifting to Minimal Gold, avoiding heavy outlines.

### Image Masks
Images are never simple rectangles. They should use asymmetrical rounded corners or circular organic masks to reinforce the "handcrafted" aesthetic.

### Cards & Containers
Cards do not have shadows. They are defined by subtle background shifts or the thin 0.5px border. Information density within cards must remain low.

### AI Status (The "Aura")
The Velora AI presence is represented by a soft, pulsing gradient blur using Minimal Gold, appearing as a background glow rather than a standard "bot" icon.