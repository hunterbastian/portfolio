import type Lenis from 'lenis'

let lenisInstance: Lenis | null = null

export function setLenisInstance(instance: Lenis | null): void {
  lenisInstance = instance
}

export function getLenisInstance(): Lenis | null {
  return lenisInstance
}
