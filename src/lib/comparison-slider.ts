export const COMPARISON_SLIDER_MIN = 10
export const COMPARISON_SLIDER_MAX = 90
export const COMPARISON_SLIDER_INITIAL_POSITION = 52
export const COMPARISON_SLIDER_BEFORE_LABEL = 'Before'
export const COMPARISON_SLIDER_AFTER_LABEL = 'After'
export const COMPARISON_SLIDER_ARIA_LABEL = 'Compare before and after designs'
export const COMPARISON_SLIDER_MOTION_DURATION_MS = 260

export function clampComparisonSliderPosition(value: number): number {
  return Math.min(COMPARISON_SLIDER_MAX, Math.max(COMPARISON_SLIDER_MIN, value))
}

export function getComparisonSliderInputPosition(value: string | number): number {
  return clampComparisonSliderPosition(Number(value))
}

export function getComparisonSliderPercent(position: number): string {
  return `${clampComparisonSliderPosition(position)}%`
}
