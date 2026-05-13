# Design System — hunterbastian.com

This is the single source of truth for the visual design language of the portfolio. Every component, page, and interaction should reference this document.

---

## Philosophy

Warm minimal, editorial, and lightly tactile. When in doubt, do less. The site should feel like a well-made tool — precise, warm, and quiet. Ambient gradients, glass, and glow are allowed only when they are named system surfaces with a clear job: hero atmosphere, hover feedback, or launchpad depth. Let typography, spacing, imagery, and composition carry most hierarchy.

Light mode by default. Dark mode as an intentional alternative, not an afterthought.

**Core risks (what makes this site memorable):**
1. **Mono editorial identity** — Geist Mono is the readable structural base; Geist Pixel Square appears through `font-header` for brand, hero, labels, and compact interface moments.
2. **Restrained accent system** — `--accent` stays quiet and sparse, while project-specific hover glows are documented exceptions.
3. **Tactile utility surfaces** — Launchpad, resume preview, and contact actions should feel crafted without turning the whole site into glassmorphism.
4. **Sound and haptics** — subtle, opt-in micro-sounds and haptics on key interactions. Multi-sensory craft, never required for comprehension.

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

### Accent Modes

The shipped site uses a quiet green accent in `globals.css` and project-specific hover accent colors in `home-projects.ts`. Seasonal accent helpers exist in `src/lib/season.ts`; if seasonal accent rotation is re-enabled, mount one provider that sets `--accent` and `--ring` together so the visual and focus systems stay aligned.

| Season  | Accent hex | Name          | Mood                        |
|---------|-----------|---------------|-----------------------------|
| Spring  | `#da8a82` | Dusty rose    | Warm, soft, renewal         |
| Summer  | `#c99a5b` | Warm amber    | Golden, sun-soaked, open    |
| Autumn  | `#b57a5d` | Burnt sienna  | Earthy, rich, grounded      |
| Winter  | `#7a8b96` | Slate blue    | Cool, quiet, reflective     |

Implementation rule: all accent changes must flow through CSS custom properties, not one-off hex values inside components. Hard-coded exception colors are allowed only for generated assets, social previews, or carefully named local effects.

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
| **Geist Mono**         | Readability / system text     | Body, project descriptions, metadata, contact copy, MDX prose, lists |
| **Geist Pixel Square** | Identity / compact structure  | TopMeta brand, hero name/location, text actions, project titles, badges, selected labels |
| **HB Handscript**      | Handwritten accent            | Hero handwritten note only                               |

### Rules

- **Geist Mono** is the default `<body>` font. Tailwind `font-mono`, `font-sans`, and `font-inter` currently resolve to Geist Mono.
- **Geist Pixel Square** is opt-in through `font-header`. Use it for compact identity moments, not long paragraphs unless intentionally matching the shipped homepage voice.
- MDX headings (`h2`/`h3`/`h4`) may stay pixel/structural, but body prose should remain highly readable.
- Project detail pages: mono body at `13px`; project titles and compact metadata may use structural treatments.
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
- Compact title case, around `0.85rem`, with tight tracking
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
- `--box-radius: 8px` is the default surface radius. Use larger radii only for explicit variants such as circular avatars, rounded badges, or Launchpad.

### Effect Tokens

Named effect tokens live as CSS custom properties in `src/app/globals.css`. Use the dot name in design discussion and the CSS variable in implementation.

| Token | CSS variable | Usage |
|-------|--------------|-------|
| `surface.glass.soft` | `--surface-glass-soft` | Quiet translucent surfaces such as TopMeta pills and subtle header chrome. |
| `surface.glass.chrome` | `--surface-glass-chrome` | Glossy raised controls such as Launchpad, the compact upload control, and the contact email CTA. |
| `shadow.raised` | `--shadow-raised` | Default raised surface depth for cards, pills, and utility panels. |
| `shadow.hover` | `--shadow-hover` | Hover elevation for raised surfaces. |
| `motion.press` | `--motion-press-transform` | Pressed tactile state. Default is `translateY(0) scale(0.96)`. |
| `motion.peek` | `--motion-peek-transition` | Tooltip, peek, and tiny reveal transitions using opacity, transform, and filter. |
| `accent.editorial.hover` | `--accent-editorial-hover` | Default hover accent for editorial rows, glints, and project/endeavor hover particles. |

Rules:
- If an effect appears in more than one component, make it a token before tuning it.
- Component-specific variants may add local variables, but the base surface, shadow, motion, or accent should point back to these aliases.
- Do not copy glossy gradients directly into new components; use `surface.glass.chrome` and tune only local rim/highlight details.

---

## Border Radius

All standard radii are unified to `--box-radius: 8px` via the Tailwind config. Every Tailwind radius utility (`rounded-sm` through `rounded-3xl`) maps to this single value unless an arbitrary class documents a deliberate exception.

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
- Pressable controls use `motion.press` (`--motion-press-transform`) for tactile feedback
- Links transition `color` and `transform` at `0.15s ease`
- Magnetic hover on pill buttons (via animate-ui Magnetic primitive)
- Web haptics on interactive elements (via web-haptics library)

### Reduced Motion

All motion respects `prefers-reduced-motion: reduce`. Transitions are disabled. No animation should be the only way to convey information.

---

## Touch and Component Sizing

Interactive sizing follows a mobile-first floor, even when the visible text is small.

| Pattern | Desktop target | Mobile target | Notes |
|---------|----------------|---------------|-------|
| Text actions / peek links | `min-height: 40px`, `min-width: 40px` | `min-height: 40px`, `min-width: 40px` | Use `PeekAction` for homepage text actions, top nav links, mobile menu text, and launchpad text actions. |
| Icon buttons | `40px` square minimum | `44px` square preferred | Use 44px when the control is isolated or primary on mobile. |
| Shared `Button` primitive | `40px` minimum height/width | `40px` minimum height/width | `xs`, `sm`, `default`, and icon variants keep the same touch floor; use typography/padding for visual density. |
| Contact email CTA | `54-62px` height | `54px` minimum | A single compact glossy pill is allowed here, but Contact still belongs inside the homepage editorial rhythm, not a separate conversion panel. |
| Social/action links | `40px` minimum row height | `40px` minimum row height | Labels may be compact, but the row remains thumb-friendly. |
| Inline utility buttons | `40px` minimum height | `40px` minimum height | Filter controls such as `Clear` must not drop below the shared floor. |

Rules:
- Do not make a mobile-only text action smaller than 40px high just because the label is visually tiny.
- If a label needs to look compact, keep the visible typography small and enlarge the hit area with padding or `min-*` utilities.
- Never overlap invisible hit areas; extra target size must remain inside the component's own layout box.
- Preserve `active:scale-[0.96]` on pressable controls unless the control is static or repeated at very high frequency.

---

## Copywriting

Copy is part of the design system. The site voice is direct, compact, warm, and specific.

### Project Descriptions

- One sentence fragment, usually 4-9 words.
- Lead with the artifact or user value, not internal process.
- Prefer concrete nouns: `Student support minisite`, `Mindfulness app`, `National parks trip-planning app`.
- Avoid inflated claims such as "revolutionary", "beautiful", "world-class", or generic "digital experience".

### CTA Labels

- Use short visible labels: `Contact`, `Resume`, `Preview`, `Launchpad`.
- Use peek/tooltips to clarify action: `Say hi`, `Open resume`, `Preview resume`, `Open experiments`.
- Resume language is always `Resume` in visible UI; `/cv` may stay as the route.
- Contact language should feel human and low-pressure: `Let's work together`, `Connect with me`, `If something here resonates, reach out.`

### Toasts and Feedback

- Toasts confirm the action in present-tense language: `Opening resume`, `Previewing resume`, `Showing all work`.
- Toasts should be short enough to read at a glance.
- Do not use toasts for decorative commentary or instructions.

### Empty and Error States

- Say what happened, then provide the next action.
- Avoid blame and avoid clever copy.
- Keep error copy as calm as the rest of the site.

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

- The live header is `TopMeta.tsx`; do not use the stale `Header.tsx` pattern.
- Header width aligns to the homepage content column (`max-w-[36rem]`).
- Nav, brand, menu, and launchpad text actions use `PeekAction` for shared touch target, press scale, tooltip, and underline behavior.
- Separator is a quiet `border-b border-border/72`.
- Launchpad is the one intentionally tactile pill in the header; keep its depth treatment local to `.launcher-depth-pill`.

---

## Accessibility

- All interactive elements must have `focus-visible` indicators (ring or outline)
- Focus ring color: `--ring` token
- `ResumeModal` uses `role="dialog"` + `aria-modal`
- Error messages use `text-destructive` color
- Dark mode backgrounds never use pure black — preserves readability
- Skip to content, semantic headings, and landmark regions throughout
- Color contrast ratios meet WCAG AA minimum
- Sound is opt-in and never the only way to convey information

---

## Background

The site background is not flat, but it stays quiet. The shipped system has three broad layers:

1. **Warm paper canvas** — `--background` plus a subtle body linear wash
2. **Hero atmosphere** — `grainient-lightglow-01.jpg`, radial masks, and a low-opacity grain layer behind the intro
3. **Section atmosphere** — painterly washes and hover glows that stay behind content

This creates a "paper" feel without being heavy. Dark mode uses the same structure with dark values.

### Hero Atmosphere

The hero glow is the primary atmospheric exception to the "quiet surface" rule. Contact stays inside the standard section system; its email action may use one glossy pill, while surrounding copy and social links remain quiet.

---

## Dark Mode

Toggled via `.dark` class on `<html>`, responds to `prefers-color-scheme`. Not a simple inversion — every token is hand-tuned.

Key differences from light:
- Tactile/glass surfaces use darker rgba backgrounds
- Card shadows are deeper and darker
- Images dimmed to `brightness(0.92)`
- Selection color uses the accent system
- Inset shadows use `rgba(255,255,255,0.04)` for subtle inner edge
- Header and launcher contrast are tuned separately from the body canvas

---

## Naming Conventions

- CSS classes use kebab-case: `.project-card`, `.nord-panel`, `.hero-sky`
- Utility classes prefixed by domain: `.shadow-card`, `.img-inset-outline`
- State classes use `is-` prefix: `.is-emphasis`, `.is-subdued`, `.is-active`
- Animation classes: `.animate-fade-in`
- Mode-specific overrides: `.dark .class-name { ... }`

---

## What This Site Is Not

- Not flashy. No neon, no default glassmorphism, no bouncing elements
- Not trendy for trend's sake. If something is removed, it was intentional
- Not a template. Every detail is considered. If it looks default, revisit it
- Not silent forever. Sound is part of the craft, but always respectful
