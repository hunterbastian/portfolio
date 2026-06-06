export const METRIC_CARD_DEFAULT_DURATION_MS = 1200
export const METRIC_CARD_PANEL_DURATION_MS = 400
export const METRIC_CARD_PANEL_INITIAL_STATE = { opacity: 0, y: 12 } as const
export const METRIC_CARD_PANEL_VISIBLE_STATE = { opacity: 1, y: 0 } as const

export interface MetricCardCountUpFrameInput {
  durationMs: number
  elapsedMs: number
  target: number
}

export interface MetricCardCountUpFrame {
  complete: boolean
  displayValue: number
}

export interface MetricCardCountUpActivationInput<TFrame = number> {
  cancelFrame: (frame: TFrame) => void
  durationMs: number
  isActive: boolean
  now: () => number
  requestFrame: (callback: (now: number) => void) => TFrame
  setDisplay: (displayValue: number) => void
  target: number
}

export function isMetricCardNumericValue(value: number | string) {
  return !Number.isNaN(Number(value))
}

export function getMetricCardNumericValue(value: number | string) {
  return Number(value)
}

export function getMetricCardAnimationProgress(elapsedMs: number, durationMs: number) {
  if (durationMs <= 0) return 1

  return Math.min(elapsedMs / durationMs, 1)
}

export function easeMetricCardProgress(progress: number) {
  const clampedProgress = Math.min(Math.max(progress, 0), 1)

  return 1 - (1 - clampedProgress) * (1 - clampedProgress)
}

export function getMetricCardDisplayValue(target: number, elapsedMs: number, durationMs: number) {
  const progress = getMetricCardAnimationProgress(elapsedMs, durationMs)
  const eased = easeMetricCardProgress(progress)

  return Math.round(eased * target)
}

export function getMetricCardCountUpFrame({
  durationMs,
  elapsedMs,
  target,
}: MetricCardCountUpFrameInput): MetricCardCountUpFrame {
  return {
    complete: durationMs <= 0 || elapsedMs >= durationMs,
    displayValue: getMetricCardDisplayValue(target, elapsedMs, durationMs),
  }
}

export function activateMetricCardCountUp<TFrame = number>({
  cancelFrame,
  durationMs,
  isActive,
  now,
  requestFrame,
  setDisplay,
  target,
}: MetricCardCountUpActivationInput<TFrame>) {
  if (!isActive) {
    setDisplay(0)
    return () => {}
  }

  const start = now()
  let currentFrame: TFrame | null = null

  const tick = (frameNow: number) => {
    const frame = getMetricCardCountUpFrame({
      durationMs,
      elapsedMs: frameNow - start,
      target,
    })

    setDisplay(frame.displayValue)

    if (!frame.complete) {
      currentFrame = requestFrame(tick)
    }
  }

  currentFrame = requestFrame(tick)

  return () => {
    if (currentFrame != null) {
      cancelFrame(currentFrame)
    }
  }
}

export function getMetricCardPanelAnimationState(isInView: boolean) {
  return isInView ? METRIC_CARD_PANEL_VISIBLE_STATE : METRIC_CARD_PANEL_INITIAL_STATE
}

export function getMetricCardVisibleValue({
  animatedValue,
  isNumeric,
  prefersReducedMotion,
  value,
}: {
  animatedValue: number
  isNumeric: boolean
  prefersReducedMotion: boolean
  value: number | string
}) {
  return prefersReducedMotion || !isNumeric ? value : animatedValue
}
