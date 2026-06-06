---
name: "Hunter Bastian Portfolio"
description: "Warm minimal portfolio for a Utah-based design engineer, built around calm craft, tactile interaction, and restrained project storytelling."
colors:
  canvas-warm: "#f9f7f2"
  surface-paper: "#fbfaf6"
  ink-soft: "#4c463d"
  ink-muted: "#837b70"
  rule-soft: "#d8d3ca"
  accent-green: "#6f9c68"
  accent-blue: "#4f7fa4"
  accent-cyan: "#7fb8c6"
  accent-amber: "#d49a4a"
  contact-brown: "#8e5244"
  contact-cyan: "#3b8b94"
typography:
  display:
    fontFamily: "Geist Pixel Square, Geist Mono, ui-monospace, SFMono-Regular, monospace"
    fontSize: "clamp(2.25rem, 4vw, 3rem)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Geist Pixel Square, Geist Mono, ui-monospace, SFMono-Regular, monospace"
    fontSize: "0.95rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Geist Mono, ui-monospace, SFMono-Regular, monospace"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.62
    letterSpacing: "-0.012em"
  label:
    fontFamily: "Geist Mono, ui-monospace, SFMono-Regular, monospace"
    fontSize: "0.68rem"
    fontWeight: 650
    lineHeight: 1
    letterSpacing: "0.09em"
rounded:
  base: "8px"
  small: "6px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
components:
  nav-link:
    textColor: "{colors.ink-muted}"
    typography: "{typography.label}"
    rounded: "{rounded.base}"
    padding: "10px 12px"
  tactile-button:
    backgroundColor: "{colors.surface-paper}"
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.pill}"
    padding: "10px 16px"
  project-surface:
    backgroundColor: "{colors.surface-paper}"
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.base}"
    padding: "8px"
  playground-tile:
    backgroundColor: "{colors.surface-paper}"
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.base}"
    padding: "0"
---

# Design System: Hunter Bastian Portfolio

## 1. Overview

**Creative North Star: "The Quiet Field Notebook"**

The portfolio should feel like a carefully edited field notebook for digital craft: warm, quiet, precise, and a little tactile. It is a brand surface before it is an app. The page itself must prove that Hunter can design and build refined interfaces without relying on loud visual tropes.

The visual system uses a warm paper canvas, soft ink, sparse green and blue accents, compact pixel identity moments, and Geist Mono as the readable structural base. Tactile effects are allowed when they have a clear job: launchpad depth, hover feedback, contact affordance, Playground framing, or hero atmosphere. They should not spread into decorative glassmorphism.

The site rejects SaaS-template composition, generic agency grids, neon AI polish, repeated section eyebrows, over-rounded cards, and empty minimalism that hides the work.

**Key Characteristics:**

- Warm off-white canvas with low-chroma ink and sparse accent.
- Geist Mono for reading, Geist Pixel Square for identity and compact structure.
- Small, precise surfaces with `8px` default radius.
- Motion and haptics as optional craft details, never requirements.
- Project imagery and composition as primary proof of taste.

## 2. Colors

The palette is warm, low-chroma, and restrained. Accent colors should be rare enough that they still feel intentional.

### Primary

- **Soft Ink** (`#4c463d`, CSS source: `--foreground`, `--primary`): Main text, navigation, project titles, and structural marks.
- **Quiet Green** (`#6f9c68`, CSS source: `--accent`, Playground local green): Primary accent for selected states, small status marks, and restrained hover cues.

### Secondary

- **Portfolio Blue** (`#4f7fa4`): Used in Playground and selected atmospheric details when a cooler technical note is needed.
- **Soft Cyan** (`#7fb8c6`): Used for light atmospheric glows and soft depth, especially in Playground.
- **Warm Amber** (`#d49a4a`): Used sparingly for warmth in Playground and seasonal accents.

### Tertiary

- **Contact Brown** (`#8e5244`): Contact and editorial hover warmth.
- **Contact Cyan** (`#3b8b94`): Email/contact-specific utility accent.

### Neutral

- **Warm Canvas** (`#f9f7f2`, CSS source: `--background`): Default page background.
- **Paper Surface** (`#fbfaf6`, CSS source: `--card`, `--surface-paper-rgb`): Cards, tiles, framed surfaces, and utility panels.
- **Muted Ink** (`#837b70`, CSS source: `--muted-foreground`, `--subtle-foreground`): Metadata, captions, secondary labels.
- **Soft Rule** (`#d8d3ca`, CSS source: `--border`): Dividers, focus offsets, and quiet edges.

### Named Rules

**The Accent Scarcity Rule.** Accent should usually occupy less than 10 percent of a viewport. Its rarity is part of the brand.

**The No Pure White Rule.** Avoid pure `#fff` as a default fill. When local white is needed for optical lift, blend it into a named paper or chrome surface.

**The Warmth Without Beige Trap Rule.** The existing warm canvas is part of the identity, but new sections should not solve every problem by adding more cream, sand, or parchment tones.

## 3. Typography

**Display Font:** Geist Pixel Square, with Geist Mono and system monospace fallbacks.
**Body Font:** Geist Mono, with system monospace fallbacks.
**Accent Font:** HB Handscript Preview for the hero handwritten note only.

**Character:** The type system is compact, structural, and personal. Geist Mono keeps the site readable and tool-like; Geist Pixel Square adds the recognizable portfolio voice in short identity moments.

### Hierarchy

- **Display** (`400`, `clamp(2.25rem, 4vw, 3rem)`, `1`): Brand moments, hero identity, and highly controlled display use. Keep max sizes modest.
- **Headline** (`600`, `1.25rem` to `2rem`, `1.15`): Section-specific headings when a page needs stronger hierarchy than the homepage list rhythm.
- **Title** (`600`, `0.9rem` to `1rem`, `1.25`): Project rows, tile titles, launchpad items, and compact UI labels that need identity.
- **Body** (`400`, `14px`, `1.62`): Intro copy, project descriptions, MDX prose, and list content. Keep line length around 65 to 75 characters.
- **Label** (`650`, `0.53rem` to `0.72rem`, `0.07em` to `0.13em`): Metadata, captions, small controls, and status text. Use uppercase sparingly.

### Named Rules

**The Pixel Is a Spice Rule.** Geist Pixel Square is for identity, compact labels, and selected UI moments. Do not use it for long paragraphs.

**The Mono Must Stay Human Rule.** Geist Mono can be the base face, but spacing, line height, and short copy need to keep it from feeling like a terminal costume.

## 4. Elevation

Elevation is subtle and mostly material. The system uses tonal layering, inset rims, and small layered shadows instead of heavy cards. Shadows should define state or surface role, not decorate every section.

### Shadow Vocabulary

- **Raised Surface** (`var(--shadow-raised)`): Default for project cards, pills, and utility panels.
- **Raised Hover** (`var(--shadow-hover)`): Hover state for raised surfaces. Keep the same shadow structure with slightly deeper values.
- **Chrome Surface** (`var(--surface-glass-chrome-shadow)`): Signature glossy controls such as Launchpad, compact upload controls, and contact CTAs.
- **Soft Glass** (`var(--surface-glass-soft-shadow)`): Quiet translucent surfaces such as TopMeta pills and subtle header chrome.
- **Playground Media Depth** (`0 18px 42px -32px rgba(35, 31, 27, 0.42)`): Gallery media frames only. Keep this soft and narrow.

### Named Rules

**The Named Material Rule.** Do not copy a glossy gradient into a new component unless it maps to an existing material token such as `surface.glass.chrome`.

**The No Ghost Card Rule.** Avoid pairing a decorative 1px border with a wide soft drop shadow. Pick a clear edge or a clear shadow.

## 5. Components

### Buttons

- **Shape:** Pills for text actions and `8px` for compact icon or utility controls.
- **Primary:** Warm paper or chrome surface with soft ink text. Accent is used for hover or focus, not as a default fill.
- **Hover / Focus:** Use color, small translate, and named shadow tokens. Focus rings use `--ring` and must remain visible.
- **Press:** Preserve `active:scale-[0.96]` or `--motion-press-transform` unless the control is static or repeated at very high frequency.

### Chips

- **Style:** Compact text, restrained tint, and a visible 40px hit target when interactive.
- **State:** Selected or filter states should use ink contrast and a small accent cue rather than saturated fills.

### Cards / Containers

- **Corner Style:** Default `8px`. Larger radii are exceptions for avatars, pills, and shell-level compositions.
- **Background:** `--card`, local paper mixes, or named chrome/glass surfaces.
- **Shadow Strategy:** Use `shadow.raised` at rest and `shadow.hover` on hover. Do not nest cards inside other cards.
- **Border:** Soft rules only. Avoid side-stripe accents.
- **Internal Padding:** Tight by default; increase spacing only when the content needs a slower read.

### Inputs / Fields

- **Style:** Paper surface, `8px` radius, soft rule border, and clear ink text.
- **Focus:** Visible ring or border shift using `--ring`.
- **Error / Disabled:** Preserve contrast. Disabled controls should not become unreadable pale gray.

### Navigation

- **Style:** Small, centered, tactile, and quiet. Top navigation must stay clickable above animated page surfaces.
- **Typography:** Geist Pixel or Geist Mono depending on the control, never large marketing nav.
- **States:** Hover can use soft accent tints and a small vertical lift. Active press uses scale feedback.

### Playground Gallery

- **Role:** A visual archive surface inspired by a designed project board, not a card grid.
- **Layout:** Desktop should show the whole gallery without vertical scroll. Tiles stay in a two-row, four-column rhythm at desktop sizes.
- **Frames:** Each project image can have project-specific composition if the source asset needs it. Use slug-based classes for exceptions, as with `grand-teton-wallet`, `mountain`, and `sunset-graphic`.
- **Captions:** Keep route-code-like labels out of the top-left corner. Year metadata is enough unless the tile is focused or hovered.
- **Surface:** Large rounded shell is allowed as an outer frame. Individual tiles stay `8px` radius and quiet.

### Signature Utility Surfaces

Launchpad, contact email, resume preview, and Playground are allowed to feel more tactile than the rest of the site. They should still share the same ink, paper, radius, and restrained accent rules.

## 6. Do's and Don'ts

### Do:

- **Do** keep the first read calm: small typography, quiet hierarchy, and visible work.
- **Do** use `font-header` for short brand and identity moments such as hero name, location, compact labels, and selected project titles.
- **Do** keep body and project prose in Geist Mono with generous line height.
- **Do** preserve `8px` as the default radius for cards, tiles, and compact panels.
- **Do** use project-specific image composition when a source asset has unusual whitespace or aspect ratio.
- **Do** test desktop and mobile viewports in the browser before calling visual work done.
- **Do** keep sound and haptics optional.

### Don't:

- **Don't** make the portfolio feel like a generic SaaS landing page with metric blocks, stock gradients, or conversion-section scaffolding.
- **Don't** make it feel like a generic agency portfolio with oversized interchangeable project cards.
- **Don't** use over-glossy glass UI as the whole identity. Gloss belongs only to named surfaces with a job.
- **Don't** use neon, dark-purple AI polish, or cyan-purple gradient tropes.
- **Don't** repeat tiny uppercase eyebrows above every section.
- **Don't** use numbered section markers unless the content is truly sequential.
- **Don't** hide personality behind empty minimalism.
- **Don't** rely on motion, sound, or haptics for comprehension.
- **Don't** use text that overflows its container at mobile, tablet, or desktop breakpoints.
