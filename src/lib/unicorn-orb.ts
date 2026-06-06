import type { CSSProperties } from 'react'

export const UNICORN_ORB_DEFAULT_WIDTH = '100%'
export const UNICORN_ORB_DEFAULT_HEIGHT = 420
export const UNICORN_STUDIO_SCRIPT_SRC =
  'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.29/dist/unicornStudio.umd.js'
export const UNICORN_STUDIO_LOADING_FLAG = '__usScriptLoading'
export const UNICORN_STUDIO_WATERMARK_LINK_SELECTOR = 'a[href*="unicornstudio"]'
export const UNICORN_STUDIO_WATERMARK_TEXT = 'unicorn studio'
export const UNICORN_STUDIO_WATERMARK_RETRY_DELAYS_MS = [50, 300, 1000] as const

export interface UnicornOrbStyleInput {
  height: string | number
  width: string | number
}

export interface UnicornStudioGlobal {
  init: () => void
  isInitialized?: boolean
}

export interface UnicornStudioWindow {
  UnicornStudio?: UnicornStudioGlobal
  __usScriptLoading?: boolean
}

export function getUnicornOrbStyle({ height, width }: UnicornOrbStyleInput): CSSProperties {
  return { width, height }
}

export function normalizeUnicornStudioText(text: string): string {
  return text.trim().toLowerCase()
}

export function isUnicornStudioWatermarkText(text: string): boolean {
  return normalizeUnicornStudioText(text).includes(UNICORN_STUDIO_WATERMARK_TEXT)
}
