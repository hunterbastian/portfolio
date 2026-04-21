import fs from 'fs'
import path from 'path'

interface OgFont {
  name: string
  data: ArrayBuffer
  weight: 400 | 500
}

let cached: OgFont[] | null = null

export async function getOgFonts(): Promise<OgFont[]> {
  if (cached) return cached

  const fontsDir = path.join(process.cwd(), 'node_modules/geist/dist/fonts/geist-mono')

  const [medium, regular] = await Promise.all([
    fs.promises.readFile(path.join(fontsDir, 'GeistMono-Medium.ttf')),
    fs.promises.readFile(path.join(fontsDir, 'GeistMono-Regular.ttf')),
  ])

  cached = [
    { name: 'GeistMono', data: medium.buffer as ArrayBuffer, weight: 500 },
    { name: 'GeistMono', data: regular.buffer as ArrayBuffer, weight: 400 },
  ]

  return cached
}
