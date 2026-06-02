---
name: Agro-Heritage Professional
colors:
  surface: '#fbf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fbf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae8e7'
  surface-container-highest: '#e4e2e1'
  on-surface: '#1b1c1c'
  on-surface-variant: '#404942'
  inverse-surface: '#303030'
  inverse-on-surface: '#f3f0f0'
  outline: '#707971'
  outline-variant: '#bfc9bf'
  surface-tint: '#266a46'
  primary: '#0a5634'
  on-primary: '#ffffff'
  primary-container: '#2b6f4a'
  on-primary-container: '#a9efc1'
  inverse-primary: '#90d6a9'
  secondary: '#84532c'
  on-secondary: '#ffffff'
  secondary-container: '#fdbb8c'
  on-secondary-container: '#784923'
  tertiary: '#4c4b48'
  on-tertiary: '#ffffff'
  tertiary-container: '#64635f'
  on-tertiary-container: '#e2e0db'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#acf2c4'
  primary-fixed-dim: '#90d6a9'
  on-primary-fixed: '#002110'
  on-primary-fixed-variant: '#025230'
  secondary-fixed: '#ffdcc5'
  secondary-fixed-dim: '#fab989'
  on-secondary-fixed: '#301400'
  on-secondary-fixed-variant: '#683c17'
  tertiary-fixed: '#e5e2dd'
  tertiary-fixed-dim: '#c9c6c2'
  on-tertiary-fixed: '#1c1c19'
  on-tertiary-fixed-variant: '#474743'
  background: '#fbf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e1'
typography:
  display-lg:
    fontFamily: EB Garamond
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.01em
  display-lg-mobile:
    fontFamily: EB Garamond
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
  headline-md:
    fontFamily: EB Garamond
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 40px
  headline-sm:
    fontFamily: EB Garamond
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  body-lg:
    fontFamily: Merriweather
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 30px
  body-md:
    fontFamily: Merriweather
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  section-gap-desktop: 120px
  section-gap-mobile: 64px
  grid-gutter: 24px
  container-max-width: 1280px
  edge-margin-mobile: 20px
---

## Brand & Style

The design system is rooted in the "Premium Rural Business" aesthetic, specifically tailored for the Argentine livestock sector. It balances the rugged, earth-bound reality of agricultural consignment with the sophisticated professionalism of a high-end financial institution. The brand personality is authoritative yet approachable, emphasizing family-owned reliability and decades of expertise.

The visual style leans into **Minimalism** with a **Tactile** edge. It utilizes generous white space (using a warm beige base) to evoke a sense of honesty and clarity. Unlike tech-heavy interfaces, this system avoids transparency and glowing effects, favoring solid, grounded containers, crisp high-contrast borders, and editorial-inspired typography that feels established and timeless.

## Colors

This color palette is designed to reflect the Argentine landscape and the maturity of the livestock industry.

- **Primary (Forest Green):** Used for key actions, navigation accents, and representing growth and the field.
- **Secondary (Earth Brown):** Used for secondary accents and icon details, grounding the brand in the earth.
- **Tertiary (Warm Beige):** The primary surface color. It replaces pure white to create a "paper-like," premium editorial feel that is easier on the eyes.
- **Neutral (Charcoal):** Used for all primary text and structural borders to ensure maximum legibility and a serious tone.
- **Functional Colors:** Error states use a deep brick red, and success states use a slightly more vibrant leaf green, maintaining the organic tone.

## Typography

The typography system relies on a high-contrast pairing between a classical serif and a functional, warm serif for body text.

- **Headlines (EB Garamond):** Used for all major page headings and section titles. It conveys history, prestige, and literary authority.
- **Body (Merriweather):** Chosen for its exceptional readability in long-form text. Its slightly wider character set feels sturdy and welcoming.
- **Labels (Inter):** Used for UI-specific metadata, buttons, and form labels. This modern sans-serif provides a necessary bridge to contemporary usability standards.

All headlines should be set in Charcoal (#333333). Large display text may use italic variants to highlight "family-owned" or heritage-based messaging.

## Layout & Spacing

The layout follows a **Fixed Grid** model on desktop to maintain an editorial, "book-like" feel. 

- **Desktop:** A 12-column grid with a maximum container width of 1280px. Gutters are kept wide (24px) to ensure content never feels cramped. Section vertical spacing is aggressive (120px) to signify a premium, confident brand.
- **Tablet:** 8-column grid with 40px side margins.
- **Mobile:** 4-column fluid grid. Gutters reduce to 16px. 

Elements should frequently use asymmetrical placements (e.g., a headline spanning 6 columns on the left with a sub-caption spanning 4 columns on the right) to avoid a generic "boxed" look.

## Elevation & Depth

This design system eschews shadows in favor of **Bold Borders** and **Tonal Layers**. Depth is communicated through structural layering rather than optical illusions.

- **Surfaces:** The primary background is always the warm beige (#F5F2ED). Secondary containers (cards or sidebars) use white or a very light tint of the primary green to pull focus.
- **Outlines:** Instead of shadows, use 1px or 2px solid borders in Charcoal (#333333) or a deep muted brown. This creates a crisp, architectural look reminiscent of traditional ledger books.
- **Interactions:** Hover states are indicated by solid color fills (e.g., a button filling with Forest Green) rather than lift or glow effects.

## Shapes

The shape language is conservative and disciplined. A **Soft (1)** roundedness level is applied to maintain a human touch without appearing "bubbly" or overly modern.

- **Small Components:** Buttons and input fields use a 4px (0.25rem) radius.
- **Large Containers:** Cards and image frames use an 8px (0.5rem) radius.
- **Structural Lines:** Horizontal rules and border separators are solid 1px lines, reinforcing the "organized ledger" aesthetic.

## Components

- **Buttons:** Primary buttons are solid Forest Green (#2B6F4A) with white text. Secondary buttons are outlined in Charcoal with no fill. All buttons use the Label-MD (Inter) font for a sharp, utilitarian feel.
- **Cards:** Cards should have a 1px Charcoal border. They do not use shadows. The header area of a card can optionally have a very thin Earth Brown top-border to distinguish categories.
- **Input Fields:** Use a subtle beige-tinted background with a Charcoal bottom-border. On focus, the border transitions to a 2px Forest Green line.
- **Lists:** Consignment data and livestock lists should use "Zebra-striping" with very faint beige/brown tints. Rows should be separated by 1px rules to maintain the data-heavy, professional look.
- **Chips/Badges:** Use solid Earth Brown or Forest Green backgrounds with white text, using the Small Label (Inter) font. These should have a slightly higher corner radius (Pill-shaped) to distinguish them from actionable buttons.
- **Photography:** All imagery should feel natural and unedited, favoring high-quality shots of livestock and Argentine landscapes with a warm, film-like color grade.