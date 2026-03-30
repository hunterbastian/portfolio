# Design System — hunterbastian.com

This is the single source of truth for the visual design language of the portfolio. Every component, page, and interaction should reference this document.

---

## Philosophy

Warm minimal, Japandi-evolved. When in doubt, do less. The site should feel like a well-made tool — precise, warm, and quiet. No gradients for decoration. No heavy effects. Let typography, spacing, and composition create hierarchy.

Light mode by default. Dark mode as an intentional alternative, not an afterthought.

**Core risks (what makes this site memorable):**
1. **Pixel font identity** — Geist Pixel Square as the primary structural typeface. Nobody in the designer portfolio space does this. It's unexpected, technical, retro-futuristic.
2. **Dusty rose as the only accent** — warm, personal, unmistakable.
3. **Seasonal accent colors** — the accent color shifts with the season. The site feels alive, like a handmade thing someone tends.
4. **Sound design** — subtle, opt-in micro-sounds on key interactions. Multi-sensory craft.

---

## Color System

Warm neutral palette. No pure white, no pure black. Colors defined as CSS custom properties in `globals.css`.

### Light Mode (`:root`)

| Token              | Value      | Usage                          |
|--------------------|------------|--------------------------------|
| `--background`     | `#f2f0ec`  | Warm off-white canvas          |
| `--card`           | `#f5f3ef`  | Slightly lighter panels        |
| `--foreground`     | `#3f4f5c`  | Slate blue text                |
| `--primary`        | `#3f4f5c`  | Same as foreground             |
| `--secondary`      | `#e9e6e1`  | Hover states, subtle fills     |
| `--muted`          | `#e1ded9`  | Disabled/inactive surfaces     |
| `--muted-foreground`| `#3f4f5c` | Section headings, labels       |
| `--accent`         | `#da8a82`  | Dusty rose (spring default)    |
| `--border`         | `#d6d3cd`  | Dividers, input borders        |
| `--ring`           | `#da8a82`  | Focus indicators               |
| `--ink-underline`  | `#b8a48a`  | Hero handscript ink underline   |

### Dark Mode (`.dark`)

| Token              | Value      | Usage                          |
|--------------------|------------|--------------------------------|
| `--background`     | `#1e2830`  | Dark charcoal canvas           |
| `--card`           | `#2a2c2f`  | Slightly lighter panels        |
| `--foreground`     | `#cdc8c0`  | Warm light gray text           |
| `--primary`        | `#cdc8c0`  | Same as foreground             |
| `--secondary`      | `#313335`  | Hover states                   |
| `--muted`          | `#393b3e`  | Disabled/inactive surfaces     |
| `--muted-foreground`| `#9a9590` | Section headings, labels       |
| `--accent`         | `#da8a82`  | Dusty rose (spring default)    |
| `--border`         | `#353739`  | Dividers, input borders        |
| `--ring`           | `#da8a82`  | Focus indicators               |
| `--ink-underline`  | `#b8a48a`  | Hero handscript ink underline   |

### Seasonal Accent Colors

The accent color rotates with the season. The `Header.tsx` seasonal indicator ("Spring", "Summer", etc.) already detects the current season. The accent should match:

| Season  | Accent hex | Name          | Mood                        |
|---------|-----------|---------------|-----------------------------|
| Spring  | `#da8a82` | Dusty rose    | Warm, soft, renewal         |
| Summer  | `#c99a5b` | Warm amber    | Golden, sun-soaked, open    |
| Autumn  | `#b57a5d` | Burnt sienna  | Earthy, rich, grounded      |
| Winter  | `#7a8b96` | Slate blue    | Cool, quiet, reflective     |

Implementation: set `--accent` and `--ring` based on the detected season in `globals.css` or via JS on page load. Dark mode uses the same seasonal accent.

### Principles

- No pure white (`#fff`) or pure black (`#000`) anywhere in the UI
- Accent color is seasonal, used sparingly for interactive hints, never as a loud highlight
- Dark mode images get `brightness(0.92)` to avoid glare
- Selection highlight uses accent at 20% opacity
- `color-mix()` used for blending foreground with accent (e.g., handscript text)

---

## Typography

Two-font system plus a handwritten accent. Each font has a specific role.

### Font Stack

| Font                   | Role                          | Usage                                                    |
|------------------------|-------------------------------|----------------------------------------------------------|
| **Geist Pixel Square** | Identity / structure          | Headings, nav, labels, buttons, section titles, project titles, dates, metadata |
| **Geist Sans**         | Readability / body            | Paragraphs, descriptions, hero intro, experience details, MDX prose, lists |
| **HB Handscript**      | Handwritten accent            | Hero handwritten note only                               |

### Rules

- **Geist Pixel Square** is the default `<body>` font. Everything inherits pixel unless overridden
- **Geist Sans** is applied via CSS to `p`, `li`, `dd`, `blockquote`, `figcaption` elements
- MDX headings (`h2`/`h3`/`h4`) stay pixel even inside Geist Sans prose sections
- Project detail pages: pixel for title + date, Geist Sans at `13px` for everything else
- Never use pixel for paragraph-length text — it's for identity, not reading
- Headings use `text-wrap: balance` to prevent orphans
- Body copy uses `text-wrap: pretty`
- `-webkit-font-smoothing: antialiased` on body for crisp rendering on macOS
- OG images use GeistMono (Satori requires TTF, pixel font is woff2 only)

### Sizing

Fluid typography via `clamp()` in Tailwind config:

| Token          | Range                          |
|----------------|--------------------------------|
| `fluid-sm`     | `0.875rem` -> `1rem`           |
| `fluid-base`   | `1rem` -> `1.125rem`           |
| `fluid-lg`     | `1.125rem` -> `1.25rem`        |
| `fluid-xl`     | `1.25rem` -> `1.5rem`          |
| `fluid-2xl`    | `1.5rem` -> `2rem`             |
| `fluid-3xl`    | `1.875rem` -> `2.5rem`         |
| `fluid-4xl`    | `2.25rem` -> `3rem`            |

### Section Headings

All section headings (Projects, Endeavors, Experience, etc.) are styled as:
- `12px` uppercase, `letter-spacing: 0.04em`, `font-weight: 500`
- Color: `--muted-foreground`
- Plain text — no interactive buttons, no collapse toggles

---

## Surfaces & Elevation

Shadows over borders. Multi-layer `box-shadow` creates depth without hard edges.

### Card Shadow (`.shadow-card`, `.project-card`)

```css
/* Light */
box-shadow:
  0px 0px 0px 1px rgba(0, 0, 0, 0.06),
  0px 1px 2px -1px rgba(0, 0, 0, 0.06),
  0px 2px 4px 0px rgba(0, 0, 0, 0.04);

/* Dark */
box-shadow:
  0 1px 3px rgba(0, 0, 0, 0.3),
  0 0 0 1px rgba(255, 255, 255, 0.04) inset;
```

### Card Hover

```css
/* Light */
box-shadow:
  0px 0px 0px 1px rgba(0, 0, 0, 0.08),
  0px 2px 4px -1px rgba(0, 0, 0, 0.08),
  0px 8px 20px -4px rgba(0, 0, 0, 0.1);

/* Dark */
box-shadow:
  0 8px 24px rgba(0, 0, 0, 0.5),
  0 0 0 1px rgba(255, 255, 255, 0.08) inset;
```

### Principles

- Prefer shadows over solid borders — shadows adapt to any background
- Hover state: same shadow structure, slightly darker/deeper values
- Transition shadows with `transition-[box-shadow]`
- Cards get a subtle light-gradient `::after` overlay on hover (165deg angle)
- Dark mode uses `inset` shadows with white at low opacity for inner edge definition
- `--box-radius: 16px` for all surfaces (unified via Tailwind `borderRadius` override)

---

## Border Radius

All radii are unified to `--box-radius: 16px` via the Tailwind config. Every Tailwind radius utility (`rounded-sm` through `rounded-3xl`) maps to this single value.

**Concentric radius rule**: Outer radius = inner radius + padding. Nested elements must calculate their radius relative to their parent to avoid visual mismatch.

---

## Images

- All project images optimized as WebP via `scripts/optimize-images.js`
- Images get an inset outline for depth: `outline: 1px solid rgba(0,0,0,0.1); outline-offset: -1px`
- Dark mode outline: `rgba(255,255,255,0.1)`
- `image-rendering: -webkit-optimize-contrast` for sharper rendering
- Images fade in: `transition: opacity 0.3s ease-in-out`
- Unloaded images (`img:not([src])`) are hidden with `opacity: 0`

---

## Motion

Spring-first animation system. Constants in `src/lib/motion.ts`.

### Easing

| Constant              | Value                                      | Use                          |
|-----------------------|--------------------------------------------|------------------------------|
| `MOTION_EASE_SOFT`    | `[0.16, 1, 0.3, 1]`                       | Default entrance/reveal      |
| `MOTION_EASE_EXIT`    | `[0.4, 0, 0.7, 0.2]`                      | Exit transitions             |
| `MOTION_SPRING_SMOOTH`| `{ stiffness: 170, damping: 26, mass: 1 }` | Interactive/layout elements  |

### Principles

- **Springs for interaction**, easing curves for one-shot sequences
- Stagger enter animations: `~100ms` delay between items, combine `opacity + blur + translateY`
- Subtle exits: less movement than enter. Small fixed offset (`-12px`) instead of full container height
- `motionDurationMs()` / `motionDelayMs()` helpers respect `prefers-reduced-motion`
- Animation orchestration follows the **Interface Craft storyboard pattern**: named timing constants at file top, stage-driven sequencing via single integer state, config objects for initial/final values
- `button:active` gets `transform: scale(0.96)` for tactile press feedback
- Links transition `color` and `transform` at `0.15s ease`
- Magnetic hover on pill buttons (via animate-ui Magnetic primitive)
- Web haptics on interactive elements (via web-haptics library)

### Reduced Motion

All motion respects `prefers-reduced-motion: reduce`. Transitions are disabled. No animation should be the only way to convey information.

---

## Sound Design

Opt-in micro-sounds for key interactions. Sound is a progressive enhancement, never required.

### Principles

- **Muted by default** — sound only activates after user interaction or explicit opt-in
- **Quiet and organic** — soft clicks, gentle tones, not UI beeps
- **Sparse** — only on meaningful moments, not every hover or scroll
- **Respect system settings** — honor device mute/silent mode

### Recommended Sound Points

| Interaction           | Sound type         | Character                |
|-----------------------|--------------------|--------------------------|
| Nav link click        | Soft click         | Wooden, tactile          |
| Project card hover    | Gentle tone        | Warm, brief, ascending   |
| Snake easter egg      | Chime              | Playful, rewarding       |
| Page transition       | Subtle whoosh      | Airy, directional        |
| Season change (rare)  | Ambient tone       | Nature-inspired          |

### Implementation

Use `src/lib/sounds/` (context + types already exist). Load audio files lazily. Use Web Audio API for low-latency playback. Pair with existing web-haptics for multi-sensory feedback.

---

## Icons

`nucleo-pixel-essential` — tree-shakeable React SVG icon library.

```tsx
import { IconChevronLeft } from 'nucleo-pixel-essential'
<IconChevronLeft size={12} />
```

Icons receive group-hover effects (scale, rotate, translate) via parent `group` class. Keep icon sizes small and consistent — `12px` for inline, `16px` for standalone.

---

## Layout

### Breakpoints

| Token       | Value     | Description         |
|-------------|-----------|---------------------|
| `xs`        | `375px`   | Extra small phones  |
| `sm`        | `640px`   | Small tablets       |
| `md`        | `768px`   | Large tablets       |
| `lg`        | `1024px`  | Small desktops      |
| `xl`        | `1280px`  | Large desktops      |
| `2xl`       | `1536px`  | Extra large         |
| `tall`      | `min-height: 800px` | Tall viewports |
| `short`     | `max-height: 600px` | Short viewports |

### Page Structure

- Homepage sections (Projects, Endeavors, Experience, Education, Contact) are always expanded — no collapse toggles
- Safe area insets respected via `env(safe-area-inset-*)` spacing tokens
- `overscroll-behavior-y: none` on `html, body` to prevent pull-to-refresh interference
- Performance sections use `content-visibility: auto` with `contain-intrinsic-size: 640px`

### Header

- Frosted glass effect: `backdrop-filter: saturate(118%) blur(20px)`
- Vertical nav layout with emphasis/subdued sizing states
- Nav links: `8px` base, `10px` for active emphasis, `7px` for subdued
- Separator uses box-shadow (not border) for hairline rendering

---

## Accessibility

- All interactive elements must have `focus-visible` indicators (ring or outline)
- Focus ring color: `--ring` token (seasonal accent)
- `ResumeModal` uses `role="dialog"` + `aria-modal`
- Error messages use `text-destructive` color
- Dark mode backgrounds never use pure black — preserves readability
- Skip to content, semantic headings, and landmark regions throughout
- Color contrast ratios meet WCAG AA minimum
- Sound is opt-in and never the only way to convey information

---

## Background

The site background is not flat — it has three subtle layers:

1. **Warm radial gradient** — very faint warmth from center-top
2. **Linear paper gradient** — barely visible top-down wash
3. **Grain texture** — `5px` repeating dot pattern at near-invisible opacity

This creates a "paper" feel without being heavy. Dark mode uses the same structure with dark values.

### Hero Sky

The hero section has its own sky gradient overlay with two radial spot highlights. Both modes defined in `.hero-sky`.

---

## Dark Mode

Toggled via `.dark` class on `<html>`, responds to `prefers-color-scheme`. Not a simple inversion — every token is hand-tuned.

Key differences from light:
- Frost panels use darker rgba backgrounds
- Card shadows are deeper and darker
- Images dimmed to `brightness(0.92)`
- Selection color uses seasonal accent
- Inset shadows use `rgba(255,255,255,0.04)` for subtle inner edge
- Header frost opacity increases from `0.66` to `0.88`

---

## Naming Conventions

- CSS classes use kebab-case: `.project-card`, `.nord-panel`, `.hero-sky`
- Utility classes prefixed by domain: `.shadow-card`, `.img-inset-outline`
- State classes use `is-` prefix: `.is-emphasis`, `.is-subdued`, `.is-active`
- Animation classes: `.animate-fade-in`
- Mode-specific overrides: `.dark .class-name { ... }`

---

## What This Site Is Not

- Not flashy. No neon, no glassmorphism, no bouncing elements
- Not trendy for trend's sake. If something is removed, it was intentional
- Not a template. Every detail is considered. If it looks default, revisit it
- Not silent forever. Sound is part of the craft, but always respectful
