export const DITHER_PALETTES = {
  silver: { label: 'Silver', dark: [42, 44, 45], light: [226, 227, 224] },
  charcoal: { label: 'Charcoal', dark: [20, 20, 19], light: [189, 185, 177] },
  paper: { label: 'Warm paper', dark: [64, 53, 43], light: [236, 225, 203] },
} as const

export type DitherPalette = keyof typeof DITHER_PALETTES
export type DitherMethod = 'ordered' | 'diffusion'
export interface DitherSettings {
  palette: DitherPalette
  method: DitherMethod
  contrast: number
  grain: number
  pixelSize: number
}
export const DEFAULT_DITHER_SETTINGS: DitherSettings = {
  palette: 'silver', method: 'ordered', contrast: 15, grain: 8, pixelSize: 3,
}
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5]

export function fitDitherImage(width: number, height: number, maxEdge = 2400) {
  const scale = Math.min(1, maxEdge / Math.max(width, height))
  return { width: Math.max(1, Math.round(width * scale)), height: Math.max(1, Math.round(height * scale)) }
}

/** Deterministic two-ink conversion. Input RGBA is never mutated. */
export function ditherPixels(rgba: Uint8ClampedArray, width: number, height: number, settings: DitherSettings) {
  const tones = new Float32Array(width * height)
  const output = new Uint8ClampedArray(rgba.length)
  const { dark, light } = DITHER_PALETTES[settings.palette]
  const contrast = 1 + settings.contrast / 60
  for (let i = 0; i < tones.length; i++) {
    const alpha = rgba[i * 4 + 3] / 255
    const luminance = (rgba[i * 4] * 0.2126 + rgba[i * 4 + 1] * 0.7152 + rgba[i * 4 + 2] * 0.0722) / 255
    const noise = (((Math.imul(i + 1, 0x45d9f3b) >>> 0) % 65536) / 65535 - 0.5) * settings.grain / 100
    tones[i] = Math.max(0, Math.min(1, ((luminance * alpha + 1 - alpha) - 0.5) * contrast + 0.5 + noise))
  }
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x
      const threshold = settings.method === 'ordered' ? (BAYER[(y % 4) * 4 + x % 4] + 0.5) / 16 : 0.5
      const value = tones[i] >= threshold ? 1 : 0
      const color = value ? light : dark
      output[i * 4] = color[0]
      output[i * 4 + 1] = color[1]
      output[i * 4 + 2] = color[2]
      output[i * 4 + 3] = 255
      if (settings.method === 'diffusion') {
        const error = tones[i] - value
        if (x + 1 < width) tones[i + 1] += error * 7 / 16
        if (y + 1 < height) {
          if (x > 0) tones[i + width - 1] += error * 3 / 16
          tones[i + width] += error * 5 / 16
          if (x + 1 < width) tones[i + width + 1] += error / 16
        }
      }
    }
  }
  return output
}
