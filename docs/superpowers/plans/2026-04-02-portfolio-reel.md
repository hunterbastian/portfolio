# Portfolio Interaction Reel — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone Remotion project that renders 9 modular motion graphics showcasing portfolio interactions, composable into a ~73s master reel.

**Architecture:** Each interaction is a self-contained Remotion `<Composition>` using `spring()`, `interpolate()`, and `useCurrentFrame()` for all animation. Shared editorial components (BrowserFrame, Cursor, Label, ZoomCrop, TransitionWipe) wrap each segment. A `<Series>`-based MasterReel sequences all segments with blur crossfade transitions.

**Tech Stack:** Remotion 4.x, React, TypeScript

**Spec:** `docs/superpowers/specs/2026-04-02-portfolio-reel-design.md`

---

## File Map

| File | Responsibility |
|------|---------------|
| `src/Root.tsx` | Register all compositions with Remotion |
| `src/styles/portfolio.ts` | Colors, font families, spacing tokens |
| `src/styles/fonts.css` | `@font-face` declarations for Inter, JetBrains Mono, EB Garamond |
| `src/lib/font-loader.ts` | `useFontLoader()` hook — `delayRender`/`continueRender` for font readiness |
| `src/components/BrowserFrame.tsx` | Minimal browser chrome wrapper |
| `src/components/Cursor.tsx` | Spring-animated cursor with click ripple |
| `src/components/Label.tsx` | Monospace annotation callout |
| `src/components/ZoomCrop.tsx` | Animated scale+translate camera movement |
| `src/components/TransitionWipe.tsx` | Blur crossfade between segments |
| `src/compositions/HeroEntrance.tsx` | Segment 1: hero stagger entrance |
| `src/compositions/TextRevealSegment.tsx` | Segment 2: word-by-word blur reveal |
| `src/compositions/CoordinateScramble.tsx` | Segment 3: header text scramble |
| `src/compositions/PlaygroundOrbit.tsx` | Segment 4: orbital card layout |
| `src/compositions/HoverInteractions.tsx` | Segment 5: TiltCard + GlareHover |
| `src/compositions/SharedElement.tsx` | Segment 6: card-to-page fly + slow-mo replay |
| `src/compositions/PageTransitions.tsx` | Segment 7: route change animations |
| `src/compositions/ScrollStageSegment.tsx` | Segment 8: scroll-driven case study |
| `src/compositions/SnakeEasterEgg.tsx` | Segment 9: footer snake game reveal |
| `src/sequences/MasterReel.tsx` | Composes all segments via `<Series>` |
| `remotion.config.ts` | Remotion CLI config |

---

### Task 1: Project Scaffold

**Files:**
- Create: `~/Desktop/Projects/Code/web/portfolio-reel/` (entire project)
- Create: `package.json`, `tsconfig.json`, `remotion.config.ts`, `src/Root.tsx`, `src/styles/portfolio.ts`, `src/styles/fonts.css`, `src/lib/font-loader.ts`

- [ ] **Step 1: Create project directory**

```bash
mkdir -p ~/Desktop/Projects/Code/web/portfolio-reel
cd ~/Desktop/Projects/Code/web/portfolio-reel
```

- [ ] **Step 2: Initialize npm and install dependencies**

```bash
npm init -y
npm install remotion @remotion/cli @remotion/player react react-dom
npm install -D typescript @types/react @types/react-dom
```

- [ ] **Step 3: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "dist",
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  },
  "include": ["src/**/*", "remotion.config.ts"]
}
```

- [ ] **Step 4: Create remotion.config.ts**

```ts
import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
```

- [ ] **Step 5: Create src/styles/portfolio.ts**

```ts
export const COLORS = {
  background: '#f2f0ec',
  card: '#f6f5f3',
  foreground: '#3f4f5c',
  accent: '#d4928e',
  muted: '#8b8b8b',
  border: 'rgba(0,0,0,0.06)',
  trafficLight: '#c8c8c8',
} as const;

export const FONTS = {
  inter: 'Inter',
  mono: 'JetBrains Mono',
  serif: 'EB Garamond',
} as const;

export const VIDEO = {
  width: 1920,
  height: 1080,
  fps: 30,
} as const;
```

- [ ] **Step 6: Copy font files from portfolio**

```bash
mkdir -p public/fonts
# Copy from portfolio's font sources or download:
# Inter (variable), JetBrains Mono, EB Garamond
# Place .woff2 files in public/fonts/
```

The portfolio uses `next/font` which downloads fonts at build time — there are no static woff2 files to copy. Download the fonts directly:
```bash
# Inter (variable)
curl -L -o public/fonts/inter-variable.woff2 "https://fonts.gstatic.com/s/inter/v18/UcCo3FwrK3iLTcviYwY.woff2"
# JetBrains Mono (variable)
curl -L -o public/fonts/jetbrains-mono-variable.woff2 "https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKxjPVmUsaaDhw.woff2"
# EB Garamond (variable)
curl -L -o public/fonts/eb-garamond-variable.woff2 "https://fonts.gstatic.com/s/ebgaramond/v27/SlGDmQSNjdsmc35JDF1K5E55YMjF_7DPuGi-6_RkC49_Yw.woff2"
```
Verify font file names match `fonts.css` declarations. If URLs have changed, download from Google Fonts manually.

- [ ] **Step 7: Create src/styles/fonts.css**

```css
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-variable.woff2') format('woff2');
  font-weight: 100 900;
  font-display: block;
}

@font-face {
  font-family: 'JetBrains Mono';
  src: url('/fonts/jetbrains-mono-variable.woff2') format('woff2');
  font-weight: 100 800;
  font-display: block;
}

@font-face {
  font-family: 'EB Garamond';
  src: url('/fonts/eb-garamond-variable.woff2') format('woff2');
  font-weight: 400 800;
  font-display: block;
}
```

Note: Remotion serves `public/` at root, so paths are `/fonts/...` not `/public/fonts/...`. Adjust file names to match the actual font files copied in step 6.

- [ ] **Step 8: Create src/lib/font-loader.ts**

```ts
import { useCallback, useEffect, useState } from 'react';
import { delayRender, continueRender } from 'remotion';

export function useFontLoader() {
  const [handle] = useState(() => delayRender('Loading fonts'));

  useEffect(() => {
    document.fonts.ready.then(() => {
      continueRender(handle);
    });
  }, [handle]);
}
```

- [ ] **Step 9: Create src/Root.tsx with a single test composition**

```tsx
import './styles/fonts.css';
import { Composition } from 'remotion';
import { VIDEO } from './styles/portfolio';
import { useFontLoader } from './lib/font-loader';

const TestComp: React.FC = () => {
  useFontLoader();
  return (
    <div style={{ background: '#f2f0ec', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontFamily: 'Inter', fontSize: 48, color: '#3f4f5c' }}>Portfolio Reel</p>
    </div>
  );
};

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Test"
      component={TestComp}
      durationInFrames={60}
      fps={VIDEO.fps}
      width={VIDEO.width}
      height={VIDEO.height}
    />
  );
};
```

**Important:** `fonts.css` is imported in Root.tsx so `@font-face` rules are available to all compositions. Every composition component must call `useFontLoader()` at its root to ensure fonts are loaded before rendering.

- [ ] **Step 10: Add scripts to package.json**

Add to `scripts`:
```json
{
  "studio": "remotion studio src/Root.tsx",
  "render": "remotion render src/Root.tsx",
  "render:all": "remotion render src/Root.tsx MasterReel out/master-reel.mp4"
}
```

- [ ] **Step 11: Verify — run Remotion Studio**

```bash
npx remotion studio src/Root.tsx
```

Expected: Browser opens showing the Test composition with "Portfolio Reel" text.

- [ ] **Step 12: Initialize git and commit**

```bash
git init
printf "node_modules/\nout/\ndist/\n" > .gitignore
git add -A
git commit -m "feat: scaffold Remotion project with styles, fonts, and config"
```

---

### Task 2: BrowserFrame Component

**Files:**
- Create: `src/components/BrowserFrame.tsx`

- [ ] **Step 1: Create BrowserFrame.tsx**

```tsx
import React from 'react';
import { COLORS, FONTS } from '../styles/portfolio';

interface BrowserFrameProps {
  children: React.ReactNode;
  url?: string;
}

export const BrowserFrame: React.FC<BrowserFrameProps> = ({
  children,
  url = 'hunterbastian.com',
}) => {
  const dot = (key: number) => (
    <div
      key={key}
      style={{
        width: 10,
        height: 10,
        borderRadius: '50%',
        backgroundColor: COLORS.trafficLight,
      }}
    />
  );

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.background,
        padding: 60,
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 12,
          border: `1px solid ${COLORS.border}`,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Title bar */}
        <div
          style={{
            height: 44,
            backgroundColor: COLORS.card,
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            gap: 8,
            borderBottom: `1px solid ${COLORS.border}`,
          }}
        >
          <div style={{ display: 'flex', gap: 6 }}>
            {[0, 1, 2].map(dot)}
          </div>
          <div
            style={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                backgroundColor: COLORS.background,
                borderRadius: 6,
                padding: '4px 24px',
                fontFamily: FONTS.mono,
                fontSize: 11,
                color: COLORS.muted,
                letterSpacing: '0.02em',
              }}
            >
              {url}
            </div>
          </div>
          <div style={{ width: 54 }} /> {/* Balance the dots */}
        </div>
        {/* Content */}
        <div
          style={{
            flex: 1,
            backgroundColor: COLORS.background,
            borderRadius: '0 0 8px 8px',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
```

- [ ] **Step 2: Add a test composition to Root.tsx**

Register a `BrowserFrameTest` composition that wraps some placeholder content in BrowserFrame. Verify it renders in Studio.

- [ ] **Step 3: Verify in Remotion Studio**

```bash
npx remotion studio src/Root.tsx
```

Expected: Browser frame with traffic light dots, address bar showing "hunterbastian.com", and placeholder content inside.

- [ ] **Step 4: Commit**

```bash
git add src/components/BrowserFrame.tsx src/Root.tsx
git commit -m "feat: add BrowserFrame component"
```

---

### Task 3: Cursor Component

**Files:**
- Create: `src/components/Cursor.tsx`

- [ ] **Step 1: Create Cursor.tsx**

```tsx
import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Sequence,
} from 'remotion';
import { COLORS } from '../styles/portfolio';

export interface CursorWaypoint {
  x: number;
  y: number;
  frame: number;
  click?: boolean;
}

interface CursorProps {
  waypoints: CursorWaypoint[];
}

const CURSOR_SVG = `M 0 0 L 0 17 L 4.5 13.5 L 8 20 L 10.5 19 L 7 12.5 L 12 12 Z`;

export const Cursor: React.FC<CursorProps> = ({ waypoints }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (waypoints.length === 0) return null;

  // Find current segment
  let segIdx = 0;
  for (let i = 0; i < waypoints.length - 1; i++) {
    if (frame >= waypoints[i].frame) segIdx = i;
  }

  const current = waypoints[segIdx];
  const next = waypoints[Math.min(segIdx + 1, waypoints.length - 1)];

  // Spring between waypoints
  const progress = spring({
    frame: frame - current.frame,
    fps,
    config: { stiffness: 170, damping: 26 },
  });

  const x = interpolate(progress, [0, 1], [current.x, next.x]);
  const y = interpolate(progress, [0, 1], [current.y, next.y]);

  // Click ripple
  const isClicking = waypoints.some(
    (wp) => wp.click && Math.abs(frame - wp.frame) < 12
  );
  const clickWp = waypoints.find(
    (wp) => wp.click && Math.abs(frame - wp.frame) < 12
  );
  const rippleProgress = clickWp
    ? interpolate(frame - clickWp.frame, [0, 9], [0, 1], {
        extrapolateRight: 'clamp',
      })
    : 0;

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {/* Ripple */}
      {isClicking && clickWp && (
        <div
          style={{
            position: 'absolute',
            left: clickWp.x - 15,
            top: clickWp.y - 15,
            width: 30,
            height: 30,
            borderRadius: '50%',
            backgroundColor: COLORS.accent,
            opacity: interpolate(rippleProgress, [0, 1], [0.4, 0]),
            transform: `scale(${interpolate(rippleProgress, [0, 1], [0.5, 2])})`,
          }}
        />
      )}
      {/* Cursor arrow */}
      <svg
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: 16,
          height: 24,
          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.15))',
        }}
        viewBox="0 0 14 22"
      >
        <path d={CURSOR_SVG} fill="white" stroke="black" strokeWidth={1} />
      </svg>
    </div>
  );
};
```

- [ ] **Step 2: Test in a composition**

Add a test composition to Root.tsx with BrowserFrame + Cursor moving between 3 waypoints with a click.

- [ ] **Step 3: Verify in Remotion Studio**

Cursor should spring-animate between waypoints and show a ripple on click frames.

- [ ] **Step 4: Commit**

```bash
git add src/components/Cursor.tsx src/Root.tsx
git commit -m "feat: add Cursor component with spring movement and click ripple"
```

---

### Task 4: Label Component

**Files:**
- Create: `src/components/Label.tsx`

- [ ] **Step 1: Create Label.tsx**

```tsx
import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { COLORS, FONTS } from '../styles/portfolio';

interface LabelProps {
  text: string;
  x: number;
  y: number;
  enterFrame: number;
  exitFrame: number;
}

export const Label: React.FC<LabelProps> = ({
  text,
  x,
  y,
  enterFrame,
  exitFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeInDuration = Math.round(fps * 0.3); // 0.3s
  const fadeOutDuration = Math.round(fps * 0.3);

  const opacity = interpolate(
    frame,
    [
      enterFrame,
      enterFrame + fadeInDuration,
      exitFrame - fadeOutDuration,
      exitFrame,
    ],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  if (opacity <= 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        opacity,
        fontFamily: FONTS.mono,
        fontSize: 12,
        color: COLORS.accent,
        backgroundColor: 'rgba(212, 146, 142, 0.08)',
        padding: '4px 12px',
        borderRadius: 6,
        whiteSpace: 'nowrap',
        letterSpacing: '0.02em',
      }}
    >
      {text}
    </div>
  );
};
```

- [ ] **Step 2: Verify in a test composition**

- [ ] **Step 3: Commit**

```bash
git add src/components/Label.tsx
git commit -m "feat: add Label annotation component with fade in/out"
```

---

### Task 5: ZoomCrop Component

**Files:**
- Create: `src/components/ZoomCrop.tsx`

- [ ] **Step 1: Create ZoomCrop.tsx**

```tsx
import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

interface ZoomCropProps {
  children: React.ReactNode;
  /** Frame to start zooming */
  zoomStartFrame: number;
  /** Target scale (e.g., 2 = 2x zoom) */
  scale?: number;
  /** Translate X in pixels at full zoom */
  translateX?: number;
  /** Translate Y in pixels at full zoom */
  translateY?: number;
}

export const ZoomCrop: React.FC<ZoomCropProps> = ({
  children,
  zoomStartFrame,
  scale = 2,
  translateX = 0,
  translateY = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: Math.max(0, frame - zoomStartFrame),
    fps,
    config: { stiffness: 80, damping: 20 },
  });

  const currentScale = interpolate(progress, [0, 1], [1, scale]);
  const currentX = interpolate(progress, [0, 1], [0, translateX]);
  const currentY = interpolate(progress, [0, 1], [0, translateY]);

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <div
        style={{
          width: '100%',
          height: '100%',
          transform: `scale(${currentScale}) translate(${currentX}px, ${currentY}px)`,
          transformOrigin: 'center center',
        }}
      >
        {children}
      </div>
    </div>
  );
};
```

- [ ] **Step 2: Verify in a test composition**

- [ ] **Step 3: Commit**

```bash
git add src/components/ZoomCrop.tsx
git commit -m "feat: add ZoomCrop animated camera component"
```

---

### Task 6: TransitionWipe Component

**Files:**
- Create: `src/components/TransitionWipe.tsx`

- [ ] **Step 1: Create TransitionWipe.tsx**

```tsx
import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

interface TransitionWipeProps {
  children: React.ReactNode;
  /** Total frames for this wipe (including breathing room) */
  durationInFrames: number;
}

export const TransitionWipe: React.FC<TransitionWipeProps> = ({
  children,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();

  // Blur crossfade: 15 frames fade out with blur, 15 frames breathing, rest is next segment
  const fadeOutEnd = 15;
  const breathingEnd = fadeOutEnd + 15;

  const opacity = interpolate(
    frame,
    [0, fadeOutEnd, breathingEnd, durationInFrames],
    [1, 0, 0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const blur = interpolate(
    frame,
    [0, fadeOutEnd, breathingEnd, breathingEnd + 15],
    [0, 6, 6, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        opacity,
        filter: `blur(${blur}px)`,
      }}
    >
      {children}
    </div>
  );
};
```

- [ ] **Step 2: Commit**

```bash
git add src/components/TransitionWipe.tsx
git commit -m "feat: add TransitionWipe blur crossfade component"
```

---

### Task 7: HeroEntrance Composition (Segment 1)

**Files:**
- Create: `src/compositions/HeroEntrance.tsx`
- Modify: `src/Root.tsx` — register composition

- [ ] **Step 1: Create HeroEntrance.tsx**

Build the hero entrance storyboard: profile image fades in + scales 0.94→1, text panel glides up, intro paragraph rises in. Wrap in BrowserFrame. Add Cursor (stationary, then moves to scroll area). Add Label at frame 120 (`40ms → 80ms → 160ms stagger`). Add ZoomCrop starting at frame 120 (zoom into hero area). **Must call `useFontLoader()` at the component root.**

**Key animation values (from spec):**
- Profile: starts at frame 36, scale 0.94→1, opacity 0→1
- Text panel: starts at frame 72, y 12→0, opacity 0→1
- Intro paragraph: starts at frame 108, y 12→0, opacity 0→1
- Each element animates over ~30 frames using `spring()`. These frame offsets are for cinematic pacing — they don't directly map to the original millisecond timings.

Use `spring()` for all movements, `interpolate()` for opacity and blur. Use `Sequence` for staggered timing.

- [ ] **Step 2: Register in Root.tsx**

```tsx
<Composition
  id="HeroEntrance"
  component={HeroEntrance}
  durationInFrames={240}
  fps={VIDEO.fps}
  width={VIDEO.width}
  height={VIDEO.height}
/>
```

- [ ] **Step 3: Verify in Remotion Studio**

Expected: Browser frame with hero content staggering in, zoom at midpoint, label appearing.

- [ ] **Step 4: Render test**

```bash
npx remotion render src/Root.tsx HeroEntrance out/hero-entrance.mp4
```

Expected: 8s MP4 at 1920x1080.

- [ ] **Step 5: Commit**

```bash
git add src/compositions/HeroEntrance.tsx src/Root.tsx
git commit -m "feat: add HeroEntrance composition (segment 1)"
```

---

### Task 8: TextRevealSegment Composition (Segment 2)

**Files:**
- Create: `src/compositions/TextRevealSegment.tsx`
- Modify: `src/Root.tsx`

- [ ] **Step 1: Create TextRevealSegment.tsx**

Word-by-word blur-to-sharp. No browser frame — text against background. **Must call `useFontLoader()`.** Each word: opacity 0→1, filter blur(8px)→blur(0px). Duration per word: 1.0s (30 frames). Stagger: 0.08s (2.4 frames, round to 2). Add Label at frame 90 (`word-by-word · 40ms stagger`).

Use a paragraph of ~15 words (e.g., Hunter's actual intro text). Map each word to a `Sequence` with offset = `index * 2` frames.

- [ ] **Step 2: Register in Root.tsx** (180 frames / 6s)

- [ ] **Step 3: Verify and render**

- [ ] **Step 4: Commit**

```bash
git add src/compositions/TextRevealSegment.tsx src/Root.tsx
git commit -m "feat: add TextRevealSegment composition (segment 2)"
```

---

### Task 9: CoordinateScramble Composition (Segment 3)

**Files:**
- Create: `src/compositions/CoordinateScramble.tsx`
- Modify: `src/Root.tsx`

- [ ] **Step 1: Create CoordinateScramble.tsx**

Tight crop (no BrowserFrame). **Must call `useFontLoader()`.** Three lines of monospace text: coordinates (`40.7608° N, 111.8910° W`), location (`UTAH, USA`), season (current). Cursor enters from right at frame 30, hovers over text at frame 50. At frame 50, text scrambles — replace each character with random alphanumeric for ~20 frames, then resettle to original. Add Label at frame 100 (`randomized on hover`).

Scramble logic: for each character, generate a random replacement per frame between frames 50-70, then snap back to original at frame 70.

- [ ] **Step 2: Register in Root.tsx** (150 frames / 5s)

- [ ] **Step 3: Verify and render**

- [ ] **Step 4: Commit**

```bash
git add src/compositions/CoordinateScramble.tsx src/Root.tsx
git commit -m "feat: add CoordinateScramble composition (segment 3)"
```

---

### Task 10: PlaygroundOrbit Composition (Segment 4)

**Files:**
- Create: `src/compositions/PlaygroundOrbit.tsx`
- Modify: `src/Root.tsx`

- [ ] **Step 1: Create PlaygroundOrbit.tsx**

BrowserFrame wrapping orbital card layout. **Must call `useFontLoader()`.** Center label ("Playground") fades from blur at frame 9. Cards (5-6 rectangles with project thumbnails) stagger in at frame 18 with 3.6-frame intervals (120ms at 30fps), each from blur(6px)+scale(0.8) to clear+scale(1). Cards orbit around center using `interpolate()` on frame to calculate angle: `angle = (frame / fps) * 0.03 * 2 * Math.PI + cardOffset`. ZoomCrop starts at frame 150 (5s) to follow one card. Add Label at frame 60 (`120ms stagger · continuous orbit`).

- [ ] **Step 2: Register in Root.tsx** (240 frames / 8s)

- [ ] **Step 3: Verify and render**

- [ ] **Step 4: Commit**

```bash
git add src/compositions/PlaygroundOrbit.tsx src/Root.tsx
git commit -m "feat: add PlaygroundOrbit composition (segment 4)"
```

---

### Task 11: HoverInteractions Composition (Segment 5)

**Files:**
- Create: `src/compositions/HoverInteractions.tsx`
- Modify: `src/Root.tsx`

- [ ] **Step 1: Create HoverInteractions.tsx**

Split view — no BrowserFrame (clean background). **Must call `useFontLoader()`.** Left side: a card that tilts in 3D using CSS `perspective` + `rotateX`/`rotateY`. Right side: a card with a diagonal glare sweep. Cursor moves to left card at frame 30, moves slowly across it (card tilts following cursor via spring with stiffness 240, damping 30, max 2.8deg). At frame 120, cursor moves to right card — light gradient follows cursor position (angle -45deg, size 250%). Label left at frame 60 (`spring: 240 / 30`). Label right at frame 150 (`glare: -45deg · 250%`).

- [ ] **Step 2: Register in Root.tsx** (240 frames / 8s)

- [ ] **Step 3: Verify and render**

- [ ] **Step 4: Commit**

```bash
git add src/compositions/HoverInteractions.tsx src/Root.tsx
git commit -m "feat: add HoverInteractions composition (segment 5)"
```

---

### Task 12: SharedElement Composition (Segment 6)

**Files:**
- Create: `src/compositions/SharedElement.tsx`
- Modify: `src/Root.tsx`

- [ ] **Step 1: Create SharedElement.tsx**

The showstopper. **Must call `useFontLoader()`.** BrowserFrame wrapping a project grid (3-4 card placeholders). Internal timing (from spec):

- Frames 0-45: Grid view visible, cursor moves to a card
- Frames 45-60: Click ripple + hold phase (card lifts slightly, scale 1.02)
- Frames 60-74: Fly phase — card image animates from grid position to hero position (top of page, full width). Use `spring()` for position and `interpolate()` for size.
- Frames 74-81: Fade phase — card fades out, detail page content fades in
- Frames 81-96: Pause on detail page
- Frames 96-105: Hard cut. Overlay "0.3×" label.
- Frames 105-255: Slow-motion replay of fly phase. Same animation but frames mapped to 1/3 speed. Draw a dotted SVG line showing the motion path (bezier curve from source to target rect).
- Frames 255-300: Hold on final state, label visible (`hold → fly 0.48s → fade 0.22s`)

- [ ] **Step 2: Register in Root.tsx** (300 frames / 10s)

- [ ] **Step 3: Verify and render** — pay special attention to the slow-mo replay and motion path overlay

- [ ] **Step 4: Commit**

```bash
git add src/compositions/SharedElement.tsx src/Root.tsx
git commit -m "feat: add SharedElement composition (segment 6) with slow-mo replay"
```

---

### Task 13: PageTransitions Composition (Segment 7)

**Files:**
- Create: `src/compositions/PageTransitions.tsx`
- Modify: `src/Root.tsx`

- [ ] **Step 1: Create PageTransitions.tsx**

BrowserFrame. **Must call `useFontLoader()`.** Show 3 page transitions. Each transition: current page blurs (0→3px) + drifts up (-8px) + fades out over 15 frames. 10 frame gap. New page slides down from 18px with blur(4px→0px) + fades in over 21 frames. Cursor clicks nav links between transitions.

Create 3 simple "page" layouts (Home with hero text, About with paragraphs, Work with grid). Use `Sequence` to time the 3 transitions across 210 frames. Add Label at frame 60 (`exit: ↑ -8px blur 3px · enter: ↓ 18px blur 4px`).

- [ ] **Step 2: Register in Root.tsx** (210 frames / 7s)

- [ ] **Step 3: Verify and render**

- [ ] **Step 4: Commit**

```bash
git add src/compositions/PageTransitions.tsx src/Root.tsx
git commit -m "feat: add PageTransitions composition (segment 7)"
```

---

### Task 14: ScrollStageSegment Composition (Segment 8)

**Files:**
- Create: `src/compositions/ScrollStageSegment.tsx`
- Modify: `src/Root.tsx`

- [ ] **Step 1: Create ScrollStageSegment.tsx**

BrowserFrame with a scroll indicator (small circular SVG in corner). **Must call `useFontLoader()`.** Create 3 content blocks representing case study stages. Use `interpolate()` to map frame to scroll progress (0→1 over frames 30-150). Each stage crossfades based on scroll progress thresholds. Add a thin scroll indicator bar on the right side that fills as scroll progresses. ZoomCrop at frame 150 into the stage 2→3 transition area. Label at frame 195 (`scroll-driven chapters`).

- [ ] **Step 2: Register in Root.tsx** (240 frames / 8s)

- [ ] **Step 3: Verify and render**

- [ ] **Step 4: Commit**

```bash
git add src/compositions/ScrollStageSegment.tsx src/Root.tsx
git commit -m "feat: add ScrollStageSegment composition (segment 8)"
```

---

### Task 15: SnakeEasterEgg Composition (Segment 9)

**Files:**
- Create: `src/compositions/SnakeEasterEgg.tsx`
- Modify: `src/Root.tsx`

- [ ] **Step 1: Create SnakeEasterEgg.tsx**

**Must call `useFontLoader()`.** Start zoomed into footer area (using ZoomCrop or just a tight frame). Show footer content. Cursor moves to a trigger area at frame 30, clicks at frame 45. Snake game grid (simple pixel grid) appears with a spring scale animation. Run 3-4 automated snake moves (pre-scripted positions) from frames 60-120. At frame 120, begin fade to black over 30 frames. Label at frame 60 (`easter egg 🐍`).

Snake grid: 10x10 grid of small squares. Snake is 3 segments, accent color. Food dot in a random position. Move snake right, right, down, eat food.

- [ ] **Step 2: Register in Root.tsx** (150 frames / 5s)

- [ ] **Step 3: Verify and render**

- [ ] **Step 4: Commit**

```bash
git add src/compositions/SnakeEasterEgg.tsx src/Root.tsx
git commit -m "feat: add SnakeEasterEgg composition (segment 9)"
```

---

### Task 16: MasterReel Sequence

**Files:**
- Create: `src/sequences/MasterReel.tsx`
- Modify: `src/Root.tsx`

- [ ] **Step 1: Create MasterReel.tsx**

Use `<Series>` to compose all 9 segments sequentially. Each segment is followed by a 30-frame `TransitionWipe` sequence (15 frames blur-out + 15 frames breathing). Total: 9 segments (1950 frames) + 8 transitions (240 frames) = **2190 frames / 73s**.

```tsx
import React from 'react';
import { Series } from 'remotion';
import { COLORS } from '../styles/portfolio';
import { useFontLoader } from '../lib/font-loader';
import { TransitionWipe } from '../components/TransitionWipe';
import { HeroEntrance } from '../compositions/HeroEntrance';
import { TextRevealSegment } from '../compositions/TextRevealSegment';
import { CoordinateScramble } from '../compositions/CoordinateScramble';
import { PlaygroundOrbit } from '../compositions/PlaygroundOrbit';
import { HoverInteractions } from '../compositions/HoverInteractions';
import { SharedElement } from '../compositions/SharedElement';
import { PageTransitions } from '../compositions/PageTransitions';
import { ScrollStageSegment } from '../compositions/ScrollStageSegment';
import { SnakeEasterEgg } from '../compositions/SnakeEasterEgg';

const SEGMENTS = [
  { Component: HeroEntrance, frames: 240 },
  { Component: TextRevealSegment, frames: 180 },
  { Component: CoordinateScramble, frames: 150 },
  { Component: PlaygroundOrbit, frames: 240 },
  { Component: HoverInteractions, frames: 240 },
  { Component: SharedElement, frames: 300 },
  { Component: PageTransitions, frames: 210 },
  { Component: ScrollStageSegment, frames: 240 },
  { Component: SnakeEasterEgg, frames: 150 },
] as const;

const TRANSITION_FRAMES = 30;

export const MasterReel: React.FC = () => {
  useFontLoader();

  return (
    <div style={{ width: '100%', height: '100%', background: COLORS.background }}>
      <Series>
        {SEGMENTS.map(({ Component, frames }, i) => (
          <React.Fragment key={i}>
            <Series.Sequence durationInFrames={frames}>
              <Component />
            </Series.Sequence>
            {i < SEGMENTS.length - 1 && (
              <Series.Sequence durationInFrames={TRANSITION_FRAMES}>
                <TransitionWipe durationInFrames={TRANSITION_FRAMES}>
                  <div />
                </TransitionWipe>
              </Series.Sequence>
            )}
          </React.Fragment>
        ))}
      </Series>
    </div>
  );
};
```

**Duration math:** 9 segments = 240+180+150+240+240+300+210+240+150 = 1950 frames. 8 transitions × 30 frames = 240. Total = **2190 frames / 73s**.

- [ ] **Step 2: Register in Root.tsx**

```tsx
<Composition
  id="MasterReel"
  component={MasterReel}
  durationInFrames={2190} // 1950 segment frames + 8 × 30 transition frames
  fps={VIDEO.fps}
  width={VIDEO.width}
  height={VIDEO.height}
/>
```

Also import `fonts.css` at the top of Root.tsx if not already done: `import './styles/fonts.css';`

- [ ] **Step 3: Verify in Remotion Studio**

Scrub through the full timeline. Check that transitions flow smoothly and no segments overlap awkwardly.

- [ ] **Step 4: Render the master reel**

```bash
npx remotion render src/Root.tsx MasterReel out/master-reel.mp4
```

Expected: ~73s MP4 at 1920x1080 showing all 9 segments with transitions.

- [ ] **Step 5: Commit**

```bash
git add src/sequences/MasterReel.tsx src/Root.tsx
git commit -m "feat: add MasterReel sequence composing all 9 segments"
```

---

### Task 17: Final Polish & Cleanup

**Files:**
- Modify: `src/Root.tsx` — remove test compositions
- Create: `CLAUDE.md` — project instructions
- Create: `README.md`

- [ ] **Step 1: Remove test compositions from Root.tsx**

Keep only the 9 segment compositions + MasterReel.

- [ ] **Step 2: Create CLAUDE.md**

```markdown
# Portfolio Reel

Remotion project for rendering portfolio interaction showcase videos.

## Commands
- `npm run studio` — open Remotion Studio for preview
- `npm run render` — render a specific composition
- `npm run render:all` — render the master reel

## Rendering individual segments
npx remotion render src/Root.tsx HeroEntrance out/hero-entrance.mp4
npx remotion render src/Root.tsx SharedElement out/shared-element.mp4

## Structure
- `src/compositions/` — one file per interaction segment
- `src/components/` — shared editorial components (BrowserFrame, Cursor, Label, ZoomCrop, TransitionWipe)
- `src/sequences/MasterReel.tsx` — composes all segments
- `src/styles/` — portfolio design tokens and fonts
```

- [ ] **Step 3: Render all individual segments**

```bash
npx remotion render src/Root.tsx HeroEntrance out/hero-entrance.mp4
npx remotion render src/Root.tsx TextRevealSegment out/text-reveal.mp4
npx remotion render src/Root.tsx CoordinateScramble out/coordinate-scramble.mp4
npx remotion render src/Root.tsx PlaygroundOrbit out/playground-orbit.mp4
npx remotion render src/Root.tsx HoverInteractions out/hover-interactions.mp4
npx remotion render src/Root.tsx SharedElement out/shared-element.mp4
npx remotion render src/Root.tsx PageTransitions out/page-transitions.mp4
npx remotion render src/Root.tsx ScrollStageSegment out/scroll-stage.mp4
npx remotion render src/Root.tsx SnakeEasterEgg out/snake-easter-egg.mp4
npx remotion render src/Root.tsx MasterReel out/master-reel.mp4
```

Expected: 10 MP4 files in `out/`.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: portfolio interaction reel — all 9 segments + master reel complete"
```
