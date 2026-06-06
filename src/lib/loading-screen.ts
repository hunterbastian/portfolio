export const LOADING_SCREEN_DEFAULT_DURATION_MS = 1000
export const LOADING_SCREEN_LOADER_TRANSITION = { duration: 0.5 } as const
export const LOADING_SCREEN_CONTENT_TRANSITION = { duration: 0.8, delay: 0.1 } as const

export interface LoadingScreenRevealInput<TTimer> {
  durationMs: number
  scheduleReveal: (delayMs: number) => TTimer
  setIsMounted: (isMounted: boolean) => void
}

export function scheduleLoadingScreenReveal<TTimer>({
  durationMs,
  scheduleReveal,
  setIsMounted,
}: LoadingScreenRevealInput<TTimer>): TTimer {
  setIsMounted(true)
  return scheduleReveal(durationMs)
}
