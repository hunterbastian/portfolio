export interface UnicodeLoaderFrameLoopActivationInput<TTimer> {
  clearInterval: (timer: TTimer) => void
  frameCount: number
  intervalMs: number
  scheduleInterval: (callback: () => void, intervalMs: number) => TTimer
  setFrameIndex: (updater: (currentFrameIndex: number) => number) => void
}

export function getNextUnicodeLoaderFrameIndex(currentFrameIndex: number, frameCount: number): number {
  return frameCount > 0 ? (currentFrameIndex + 1) % frameCount : 0
}

export function getUnicodeLoaderClassName(className = ''): string {
  return `fixed inset-0 z-50 flex items-center justify-center ${className}`
}

export function activateUnicodeLoaderFrameLoop<TTimer>({
  clearInterval,
  frameCount,
  intervalMs,
  scheduleInterval,
  setFrameIndex,
}: UnicodeLoaderFrameLoopActivationInput<TTimer>): () => void {
  const timer = scheduleInterval(() => {
    setFrameIndex((currentFrameIndex) => getNextUnicodeLoaderFrameIndex(currentFrameIndex, frameCount))
  }, intervalMs)

  return () => clearInterval(timer)
}
