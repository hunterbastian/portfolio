# Portfolio Interaction Reel — Design Spec

## Overview

A standalone Remotion project that produces modular motion graphics showcasing the interactive elements of hunterbastian.com. Each interaction is a self-contained composition renderable individually (10-20s clips for talks/posts) or sequenced into a master reel (~65s showcase for LinkedIn/Twitter).

**Approach:** Programmatic recreation. Each interaction is rebuilt as a Remotion composition using React and Remotion's native animation primitives (`spring()`, `interpolate()`, `useCurrentFrame()`). No screen recordings — full creative control over timing, camera, and annotations.

**Animation strategy:** Framer Motion is NOT used — it relies on `requestAnimationFrame` and wall-clock time, which don't exist in Remotion's frame-by-frame rendering. All animations use Remotion's `spring()` (for spring physics), `interpolate()` (for eased transitions), and `useCurrentFrame()` (for frame-based timing). The portfolio's spring configs (stiffness/damping values) are translated to Remotion's `spring()` config format.

**Visual style:** Hybrid editorial — realistic site context (browser frame, real colors/fonts) with cinematic touches (zoomed crops, slow-motion replays, monospace annotation labels).

## Project Location

Standalone project at `~/Desktop/Projects/Code/web/portfolio-reel/`

Separate from the portfolio repo. No shared dependencies — interactions are recreated, not imported.

## Architecture

```
portfolio-reel/
├── src/
│   ├── compositions/           # One per interaction segment
│   │   ├── HeroEntrance.tsx
│   │   ├── TextRevealSegment.tsx
│   │   ├── CoordinateScramble.tsx
│   │   ├── PlaygroundOrbit.tsx
│   │   ├── HoverInteractions.tsx
│   │   ├── SharedElement.tsx
│   │   ├── PageTransitions.tsx
│   │   ├── ScrollStageSegment.tsx
│   │   └── SnakeEasterEgg.tsx
│   ├── components/
│   │   ├── BrowserFrame.tsx     # Fake browser chrome wrapper
│   │   ├── Cursor.tsx           # Spring-animated cursor with click ripple
│   │   ├── Label.tsx            # Monospace annotation callouts
│   │   ├── ZoomCrop.tsx         # Animated scale + translate for detail focus
│   │   └── TransitionWipe.tsx   # Blur crossfade between segments
│   ├── sequences/
│   │   └── MasterReel.tsx       # Composes all segments with transitions
│   ├── styles/
│   │   └── portfolio.ts         # Color palette, font config, spacing tokens
│   └── Root.tsx                 # Remotion entry — registers all compositions
├── public/
│   └── fonts/                   # Inter, JetBrains Mono, EB Garamond
└── package.json
```

## Dependencies

- `remotion@4.x` + `@remotion/cli@4.x` + `@remotion/player@4.x` — core framework
- `react` + `react-dom` — required by Remotion

No Framer Motion — all animations use Remotion's built-in `spring()` and `interpolate()`. Fonts loaded from `public/fonts/` using `delayRender`/`continueRender` to ensure fonts are ready before first frame renders.

## Output Specs

| Property | Value |
|----------|-------|
| Resolution | 1920 x 1080 (16:9) |
| Frame rate | 30fps |
| Format | MP4 (H.264) |
| Audio | Silent — add in post if needed |
| Total duration | ~73s (65s segments + ~8s transitions) |

## Visual Style

### Palette (from portfolio light mode)

- Background: `#f2f0ec` (warm off-white)
- Card: `#f6f5f3`
- Foreground text: `#3f4f5c` (slate blue)
- Accent: `#d4928e` (dusty rose)
- Muted: `#8b8b8b`

### Typography

- **Inter** — UI text in recreated components
- **JetBrains Mono** — annotation labels, code references, timing values
- **EB Garamond** — serif accents (matching portfolio)

### Browser Frame

Minimal rounded-corner window chrome:
- Three traffic light dots (gray, not colored)
- Address bar showing `hunterbastian.com`
- Muted border, no shadow — sits on the `#f2f0ec` background
- Generous padding around the frame

### Cursor

- macOS default arrow appearance
- Spring-animated movement (not linear) between targets
- Subtle radial ripple on click (accent color, fades quickly)

### Annotations (Label component)

- JetBrains Mono, ~12px equivalent
- Accent color `#d4928e`
- Fade in 0.3s after the interaction starts, fade out before segment ends
- Positioned outside the browser frame or in a lower-third area

### Segment Transitions

- 0.5s blur crossfade between segments
- Brief breathing room (~15 frames) of clean background between segments

## Segment Specifications

### 1. Hero Entrance (8s / 240 frames)

Recreate the homepage hero entrance storyboard.

- **What to show:** Profile image fades in + scales 0.94 to 1, text panel glides up, intro paragraph + note rise in
- **Camera:** Start with full browser frame. At ~4s, smooth zoom into the hero area
- **Label:** `40ms -> 80ms -> 160ms stagger` — appears after entrance completes
- **Timing reference:** `HERO_ENTRANCE` config from `AnimatedHomePage.tsx` (profileDelay: 40, textPanelDelay: 80, textItemsDelay: 160, duration: 320)

### 2. TextReveal (6s / 180 frames)

Recreate the word-by-word blur-to-sharp text animation.

- **What to show:** A paragraph of text where each word materializes from blur
- **Camera:** Tight crop on text area — no browser frame, just the text against background
- **Label:** `word-by-word . 40ms stagger`
- **Pacing:** Animation durations doubled from original (duration: 1.0s per word, stagger: 0.08s) for dramatic slow-motion effect
- **Timing reference:** `TextReveal.tsx` original values (duration: 0.5, staggerDelay: 0.04) — doubled for this segment

### 3. Coordinate Scramble (5s / 150 frames)

Recreate the header coordinate hover effect.

- **What to show:** Three lines of monospace text (coordinates, location, season). Cursor enters, text scrambles to random characters, then resettles
- **Camera:** Tight crop on header top-left area
- **Label:** `randomized on hover`
- **Reference:** `Header.tsx` CoordinateDisplay — `useScrambleText` hook

### 4. PlaygroundOrbit (8s / 240 frames)

Recreate the orbital project card layout.

- **What to show:** Center label fades in from blur, then cards stagger in (blur + scale 0.8 to 1) and begin orbiting
- **Camera:** Wide shot showing full orbit, then at ~5s zoom to follow one card
- **Label:** `120ms stagger . continuous orbit`
- **Timing reference:** `PlaygroundOrbit.tsx` ENTRANCE config (centerDelay: 0.3, cardsDelay: 0.6, cardStagger: 0.12)

### 5. Hover Interactions (8s / 240 frames)

Combined segment showing TiltCard and GlareHover side by side.

- **What to show:** Two cards side by side. Cursor moves to left card (tilts in 3D), pauses, moves to right card (light sweep follows cursor)
- **Camera:** Split view — equal space for both
- **Label left:** `spring: 240 / 30` (stiffness/damping from TiltCard)
- **Label right:** `glare: -45deg . 250%`
- **Reference:** `TiltCard.tsx` (TILT_SPRING, DEFAULT_MAX_TILT: 2.8deg), `GlareHover.tsx` (glareAngle: -45, glareSize: 250)

### 6. Shared Element Transition (10s / 300 frames) — showstopper

Recreate the card-to-detail-page fly transition.

- **What to show:** Project grid visible. Cursor clicks a card. Card image lifts out and flies to the detail page hero position. Page content fades in beneath.
- **Camera:** Full browser frame. Follow the flying element.
- **Internal timing breakdown:**
  - 0-1.5s: Grid view, cursor moves to card
  - 1.5-2.0s: Click + hold phase (card lifts)
  - 2.0-2.5s: Fly phase at 1x (0.48s)
  - 2.5-2.7s: Fade phase at 1x (0.22s)
  - 2.7-3.2s: Brief pause on detail page
  - 3.2-3.5s: Hard cut, "0.3x" label appears
  - 3.5-8.5s: Slow-motion replay of fly phase (~5s at 0.3x) with dotted motion path line overlay
  - 8.5-10s: Hold on final state, label visible
- **Label:** `hold -> fly 0.48s -> fade 0.22s`
- **Reference:** `ProjectTransitionOverlay.tsx` (FLY_DURATION: 0.48, FADE_DURATION: 0.22, phases: hold/fly/fade)

### 7. Page Transitions (7s / 210 frames)

Recreate route-change animations.

- **What to show:** Navigate between 2-3 pages. Each exit: content blurs + drifts up. Each entrance: new content slides down from blur.
- **Camera:** Full browser frame throughout. Cursor clicks nav links.
- **Label:** `exit: up -8px blur 3px . enter: down 18px blur 4px`
- **Reference:** `PageTransition.tsx` TIMING config (oldFadeDuration: 450, newSlideDuration: 700) and PAGE config (exitY: -8, initialY: 18)

### 8. ScrollStage (8s / 240 frames)

Recreate scroll-driven case study navigation.

- **What to show:** A simplified case study page with 3 scroll-driven stages. Simulated smooth scroll (driven by `interpolate()` on frame count) causes content blocks to crossfade/translate as scroll progress advances from 0 to 1.
- **Internal timing:**
  - 0-1s: Static case study hero visible
  - 1-3s: Scroll progresses, stage 1 → stage 2 transition
  - 3-5s: Continue scroll, stage 2 → stage 3 transition
  - 5-6.5s: Zoom crop into the stage 2→3 transition moment
  - 6.5-8s: Hold on zoomed view, label visible
- **Camera:** Full browser frame with scroll indicator visible. At ~5s, zoom into a stage transition.
- **Label:** `scroll-driven chapters`
- **Reference:** `ScrollStage.tsx` MDX component — recreate a simplified version with 3 content blocks that crossfade based on a scroll progress value

### 9. Snake Easter Egg (5s / 150 frames)

Recreate the footer hidden game.

- **What to show:** Footer visible. Cursor moves to trigger area, clicks. Snake game grid appears. Brief automated gameplay (3-4 moves).
- **Camera:** Zoom into footer area for the reveal
- **Label:** `easter egg` with a small snake emoji
- **Ending:** Fade to black after brief gameplay — serves as the reel closer
- **Reference:** `FooterSnakeEasterEgg.tsx`, `snake.ts` game logic

## Shared Components

### BrowserFrame

Wraps composition content in a minimal browser window:
- Rounded corners (12px outer, 8px inner content area)
- Traffic light dots: three 10px circles, all `#c8c8c8` (gray, not colored)
- Address bar: pill shape, `JetBrains Mono` 11px, shows `hunterbastian.com`
- Border: 1px `rgba(0,0,0,0.06)`
- Content area has the portfolio background color
- The frame itself sits on a slightly darker or matching background

### Cursor

Animated pointer that moves between interaction targets:
- Visual: macOS default arrow cursor (SVG recreation)
- Movement: Remotion `spring()` with `{ config: { stiffness: 170, damping: 26 } }` — matches portfolio's MOTION_SPRING_SMOOTH
- Click effect: radial ripple at click point, accent color, 0.3s fade
- Each segment defines a cursor choreography as an array: `{ x: number, y: number, frame: number, click?: boolean }[]` — cursor interpolates between waypoints using spring physics, triggers click ripple when `click: true`

### Label

Annotation callout for showing technical details:
- Font: JetBrains Mono, 12px
- Color: `#d4928e` (accent)
- Background: `rgba(212, 146, 142, 0.08)` pill
- Animation: fade in 0.3s, hold, fade out 0.3s
- Position: passed as prop, typically bottom-right outside browser frame or lower-third overlay

### ZoomCrop

Animated camera movement within a composition:
- Accepts `from` rect and `to` rect (or scale + translate values)
- Spring-animated transition between positions
- Used mid-segment to focus on detail areas
- Clips overflow so zoom feels like a camera move, not a scale

### TransitionWipe

Between-segment transitions in MasterReel:
- Default: 0.5s blur crossfade (outgoing blurs to 6px while fading, incoming deblurs from 6px)
- 15 frames of clean background between segments (breathing room)

## Rendering

### Individual segments

```bash
npx remotion render HeroEntrance out/hero-entrance.mp4
npx remotion render SharedElement out/shared-element.mp4
# ... any single composition
```

### Master reel

```bash
npx remotion render MasterReel out/master-reel.mp4
```

### Preview

```bash
npx remotion studio
```

Opens Remotion Studio in the browser for real-time preview of any composition.

## Configuration

A `remotion.config.ts` at the project root:

```ts
import { Config } from '@remotion/cli/config'

Config.setVideoImageFormat('jpeg')
Config.setOverwriteOutput(true)
```

### Font Loading

Fonts are loaded via `@font-face` in a global CSS file. Each composition's root component uses `delayRender()` on mount and calls `continueRender()` after confirming fonts are loaded via `document.fonts.ready`. This prevents blank-text frames during rendering.

## Success Criteria

1. Each of the 9 segments renders independently as a clean 10-20s MP4
2. MasterReel composes all segments with transitions into a ~73s video
3. Visual style matches portfolio aesthetic (colors, fonts, spacing)
4. Browser frame looks realistic but minimal
5. Cursor movement feels natural (spring-animated, not robotic)
6. Labels are readable and positioned cleanly
7. The shared-element transition segment includes the slow-motion replay with motion path overlay
8. Output is 1920x1080 @ 30fps MP4
