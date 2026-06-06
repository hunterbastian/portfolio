export interface HeroGlowPoint {
  x: number
  y: number
}

export interface HeroGlowRect {
  height: number
  left: number
  top: number
  width: number
}

export interface HeroGlowPointerInput {
  clientX: number
  clientY: number
}

export interface HeroGlowOffsets {
  glowX: number
  glowY: number
  grainX: number
  grainY: number
}

export interface HeroGlowCssVariables {
  '--hero-glow-cursor-x': string
  '--hero-glow-cursor-y': string
  '--hero-grain-cursor-x': string
  '--hero-grain-cursor-y': string
}

export interface HeroGlowStyleTarget {
  style: {
    setProperty: (propertyName: string, value: string) => void
  }
}

export interface HeroGlowAnimationStep {
  point: HeroGlowPoint
  shouldContinue: boolean
  settledPoint: HeroGlowPoint
}

export interface HeroGlowFrameRef<TFrame> {
  current: TFrame | null
}

export interface HeroGlowFrameRequestInput<TFrame> {
  callback: () => void
  frameRef: HeroGlowFrameRef<TFrame>
  requestFrame: (callback: () => void) => TFrame
}

export interface HeroGlowFrameCancelInput<TFrame> {
  cancelFrame: (frame: TFrame) => void
  frameRef: HeroGlowFrameRef<TFrame>
}

export const HERO_GLOW_LERP_FACTOR = 0.09
export const HERO_GLOW_MAX_X = 16
export const HERO_GLOW_MAX_Y = 8
export const HERO_GRAIN_PARALLAX_RATIO = 0.55
export const HERO_GLOW_SETTLE_THRESHOLD = 0.002
export const HERO_GLOW_ORIGIN: HeroGlowPoint = { x: 0, y: 0 }

export function clampHeroGlowValue(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function getHeroGlowPointerRatio(
  pointer: HeroGlowPointerInput,
  rect: HeroGlowRect,
): HeroGlowPoint {
  return {
    x: (pointer.clientX - (rect.left + rect.width / 2)) / (rect.width / 2),
    y: (pointer.clientY - (rect.top + rect.height / 2)) / (rect.height / 2),
  }
}

export function getNextHeroGlowPoint(
  current: HeroGlowPoint,
  target: HeroGlowPoint,
  lerpFactor = HERO_GLOW_LERP_FACTOR,
): HeroGlowPoint {
  return {
    x: current.x + (target.x - current.x) * lerpFactor,
    y: current.y + (target.y - current.y) * lerpFactor,
  }
}

export function getHeroGlowOffsets(point: HeroGlowPoint): HeroGlowOffsets {
  const glowX = clampHeroGlowValue(point.x * HERO_GLOW_MAX_X, -HERO_GLOW_MAX_X, HERO_GLOW_MAX_X)
  const glowY = clampHeroGlowValue(point.y * HERO_GLOW_MAX_Y, -HERO_GLOW_MAX_Y, HERO_GLOW_MAX_Y)

  return {
    glowX,
    glowY,
    grainX: glowX * HERO_GRAIN_PARALLAX_RATIO,
    grainY: glowY * HERO_GRAIN_PARALLAX_RATIO,
  }
}

export function getHeroGlowCssVariables(point: HeroGlowPoint): HeroGlowCssVariables {
  const offsets = getHeroGlowOffsets(point)

  return {
    '--hero-glow-cursor-x': `${offsets.glowX}px`,
    '--hero-glow-cursor-y': `${offsets.glowY}px`,
    '--hero-grain-cursor-x': `${offsets.grainX}px`,
    '--hero-grain-cursor-y': `${offsets.grainY}px`,
  }
}

export function applyHeroGlowCssVariables({
  glow,
  grain,
  point,
}: {
  glow: HeroGlowStyleTarget | null
  grain: HeroGlowStyleTarget | null
  point: HeroGlowPoint
}): HeroGlowCssVariables {
  const cssVariables = getHeroGlowCssVariables(point)

  if (glow) {
    glow.style.setProperty('--hero-glow-cursor-x', cssVariables['--hero-glow-cursor-x'])
    glow.style.setProperty('--hero-glow-cursor-y', cssVariables['--hero-glow-cursor-y'])
  }

  if (grain) {
    grain.style.setProperty('--hero-grain-cursor-x', cssVariables['--hero-grain-cursor-x'])
    grain.style.setProperty('--hero-grain-cursor-y', cssVariables['--hero-grain-cursor-y'])
  }

  return cssVariables
}

export function getHeroGlowAnimationStep(
  current: HeroGlowPoint,
  target: HeroGlowPoint,
  lerpFactor = HERO_GLOW_LERP_FACTOR,
  settleThreshold = HERO_GLOW_SETTLE_THRESHOLD,
): HeroGlowAnimationStep {
  const point = getNextHeroGlowPoint(current, target, lerpFactor)
  const shouldContinue = shouldContinueHeroGlowAnimation(point, target, settleThreshold)

  return {
    point,
    shouldContinue,
    settledPoint: shouldContinue ? point : { ...target },
  }
}

export function shouldContinueHeroGlowAnimation(
  current: HeroGlowPoint,
  target: HeroGlowPoint,
  settleThreshold = HERO_GLOW_SETTLE_THRESHOLD,
): boolean {
  return (
    Math.abs(target.x - current.x) > settleThreshold ||
    Math.abs(target.y - current.y) > settleThreshold
  )
}

export function requestHeroGlowFrame<TFrame>({
  callback,
  frameRef,
  requestFrame,
}: HeroGlowFrameRequestInput<TFrame>): TFrame {
  frameRef.current = requestFrame(callback)
  return frameRef.current
}

export function scheduleHeroGlowFrameIfIdle<TFrame>(
  input: HeroGlowFrameRequestInput<TFrame>,
): TFrame | null {
  if (input.frameRef.current !== null) return input.frameRef.current

  return requestHeroGlowFrame(input)
}

export function cancelHeroGlowFrame<TFrame>({
  cancelFrame,
  frameRef,
}: HeroGlowFrameCancelInput<TFrame>): boolean {
  if (frameRef.current === null) return false

  cancelFrame(frameRef.current)
  frameRef.current = null

  return true
}
