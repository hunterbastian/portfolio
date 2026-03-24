# LCP Optimization — SSR-Visible Hero

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduce LCP from 4.4s to under 2.5s by making hero content visible from SSR HTML without waiting for JS hydration.

**Architecture:** Framer Motion's `initial={{ opacity: 0 }}` renders inline `style="opacity:0"` in the server HTML, hiding all content until JS hydrates. The fix: a shared `useIsInitialLoad` hook returns `true` during SSR + first hydration, `false` on subsequent navigations. Components skip entrance animations on initial load (using `initial={false}` so FM renders with `animate` values instead). All animations remain intact for client-side route transitions.

**Tech Stack:** Next.js 15, Framer Motion, React 19

---

## File Structure

| Action | File | Responsibility |
|--------|------|---------------|
| Create | `src/lib/initial-load.ts` | Shared hook: `useIsInitialLoad()` |
| Modify | `src/components/PageTransition.tsx` | Skip page-level entrance on initial load |
| Modify | `src/components/AnimatedHomePage.tsx` | Skip hero staging on initial load |
| Modify | `src/components/TextReveal.tsx` | Skip word-level animation on initial load |

---

### Task 1: Create `useIsInitialLoad` hook

**Files:**
- Create: `src/lib/initial-load.ts`

- [ ] **Step 1: Create the hook**

```ts
'use client'

import { useEffect, useState } from 'react'

/**
 * Returns true on initial page load (SSR + hydration), false on
 * subsequent client-side navigations. Used to skip Framer Motion
 * entrance animations so SSR content paints immediately.
 *
 * Hydration safety:
 *   SSR render:      _initialLoadComplete = false → isInitial = true
 *   Client hydration: _initialLoadComplete = false → isInitial = true (matches SSR)
 *   After effect:     _initialLoadComplete = true
 *   Next mount:       isInitial = false → animations play normally
 */
let _initialLoadComplete = false

export function useIsInitialLoad(): boolean {
  const [isInitial] = useState(() => !_initialLoadComplete)

  useEffect(() => {
    _initialLoadComplete = true
  }, [])

  return isInitial
}
```

- [ ] **Step 2: Verify no build errors**

Run: `cd ~/Desktop/code/web/portfolio && npx tsc --noEmit`

---

### Task 2: Fix PageTransition — skip entrance on initial load

**Files:**
- Modify: `src/components/PageTransition.tsx`

This is the **biggest single win** — PageTransition wraps ALL page content in `opacity: 0` on SSR.

- [ ] **Step 1: Import hook and pass to RouteScene**

Add `useIsInitialLoad` import. In `PageTransition`, call the hook and pass `isInitialLoad` as a prop to `RouteScene`.

```tsx
import { useIsInitialLoad } from '@/lib/initial-load'

// In RouteSceneProps interface, add:
isInitialLoad: boolean

// In PageTransition component:
const isInitialLoad = useIsInitialLoad()

// Pass to RouteScene:
<RouteScene isInitialLoad={isInitialLoad} ...>
```

- [ ] **Step 2: Update RouteScene to skip animation on initial load**

Three changes inside `RouteScene`:

1. Initialize stage at 2 (fully visible) when `isInitialLoad`:
```tsx
const [stage, setStage] = useState(isInitialLoad ? 2 : 0)
```

2. Skip timer logic when `isInitialLoad`:
```tsx
useEffect(() => {
  if (isInitialLoad) return  // Content already visible
  if (prefersReducedMotion) { setStage(2); return }
  // ... existing timer logic unchanged
}, [isInitialLoad, prefersReducedMotion, ...])
```

3. Use `initial={false}` on both m.div elements when `isInitialLoad`:
```tsx
// Page wrapper:
initial={isInitialLoad ? false : {
  opacity: PAGE.initialOpacity,
  y: offsets.pageY,
  filter: PAGE.initialBlur,
}}

// Child wrapper (inside .map):
initial={isInitialLoad ? false : {
  opacity: CHILD.initialOpacity,
  y: offsets.childY,
}}
```

- [ ] **Step 3: Verify no build errors**

Run: `cd ~/Desktop/code/web/portfolio && npx tsc --noEmit`

- [ ] **Step 4: Commit**

```bash
git add src/lib/initial-load.ts src/components/PageTransition.tsx
git commit -m "perf: skip PageTransition entrance on initial load for SSR-visible content"
```

---

### Task 3: Fix AnimatedHomePage — SSR-visible hero

**Files:**
- Modify: `src/components/AnimatedHomePage.tsx`

The hero profile image and text are double-hidden behind their own `initial={{ opacity: 0 }}`.

- [ ] **Step 1: Import hook and update hero staging**

```tsx
import { useIsInitialLoad } from '@/lib/initial-load'

// Inside AnimatedHomePage:
const isInitialLoad = useIsInitialLoad()
const [heroTextStage, setHeroTextStage] = useState(isInitialLoad ? 2 : 0)
```

- [ ] **Step 2: Skip hero entrance effect on initial load**

Add guard to the heroTextStage effect:
```tsx
useEffect(() => {
  if (isInitialLoad) return
  if (prefersReducedMotion) { setHeroTextStage(2); return }
  // ... existing timer logic unchanged
}, [isInitialLoad, prefersReducedMotion])
```

- [ ] **Step 3: Use `initial={false}` on hero motion elements**

Profile image m.div (~line 354):
```tsx
initial={isInitialLoad ? false : {
  opacity: STAGGER_ITEM.initialOpacity,
  y: STAGGER_ITEM.initialY,
  scale: 0.94,
  filter: 'blur(6px)',
}}
```

Text panel m.div (~line 387):
```tsx
initial={isInitialLoad ? false : {
  opacity: STAGGER_PANEL.initialOpacity,
  y: STAGGER_PANEL.initialY,
  filter: 'blur(6px)',
}}
```

- [ ] **Step 4: Verify no build errors**

Run: `cd ~/Desktop/code/web/portfolio && npx tsc --noEmit`

- [ ] **Step 5: Commit**

```bash
git add src/components/AnimatedHomePage.tsx
git commit -m "perf: skip hero entrance animation on initial load for faster LCP"
```

---

### Task 4: Fix TextReveal — SSR-visible text

**Files:**
- Modify: `src/components/TextReveal.tsx`

Each word renders as `<m.span initial={{ opacity: 0 }}>` — the hero text is invisible in SSR HTML.

- [ ] **Step 1: Import hook and use `initial={false}` on initial load**

```tsx
import { useIsInitialLoad } from '@/lib/initial-load'

export default function TextReveal({ ... }) {
  const isInitialLoad = useIsInitialLoad()
  const prefersReducedMotion = useReducedMotion()
  // ...

  // In the m.span for each word:
  initial={isInitialLoad ? false : {
    opacity: 0,
    y: 8,
    filter: filter ? 'blur(4px)' : 'none',
  }}
```

- [ ] **Step 2: Verify no build errors**

Run: `cd ~/Desktop/code/web/portfolio && npx tsc --noEmit`

- [ ] **Step 3: Commit**

```bash
git add src/components/TextReveal.tsx
git commit -m "perf: skip TextReveal word animation on initial load for SSR-visible text"
```

---

### Task 5: Build + Lighthouse verification

- [ ] **Step 1: Production build**

Run: `cd ~/Desktop/code/web/portfolio && npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 2: Lighthouse audit**

Run: `cd ~/Desktop/code/web/portfolio && npm run start &` then `npm run lighthouse`
Expected: LCP under 2.5s (target: green score). Performance score should improve from 85.

- [ ] **Step 3: Visual check**

Run: `npm run dev` and open in Dia.
Verify:
- Initial page load: hero content appears instantly (no fade-in)
- Navigate to /about, then back to /: hero entrance animation plays
- All section animations (experience, education, contact) still work
- TextReveal on about page still animates normally

---

## How It Works (Hydration Safety)

```
SSR:        _initialLoadComplete = false → isInitial = true  → initial={false} → content visible
Hydration:  _initialLoadComplete = false → isInitial = true  → matches SSR ✅
Effect:     _initialLoadComplete = true
Route nav:  _initialLoadComplete = true  → isInitial = false → initial={...}   → animation plays
```

The module-level `_initialLoadComplete` variable:
- Server: always `false` (effects don't run on server) → content always SSR-visible
- Client: `false` until first effect → `true` forever after → subsequent navigations animate

No hydration mismatch because SSR and first client render both see `isInitial = true`.
