import fs from 'fs'
import path from 'path'

interface OgFont {
  name: string
  data: ArrayBuffer
  weight: 400 | 500
}

let cached: OgFont[] | null = null

function toArrayBuffer(buffer: Buffer): ArrayBuffer {
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer
}

export async function getOgFonts(): Promise<OgFont[]> {
  if (cached) return cached

  const geistDir = path.join(process.cwd(), 'node_modules/geist/dist/fonts')
  const monoDir = path.join(geistDir, 'geist-mono')
  const publicFontsDir = path.join(process.cwd(), 'public/fonts')

  const [medium, regular, pixelSquare] = await Promise.all([
    fs.promises.readFile(path.join(monoDir, 'GeistMono-Medium.ttf')),
    fs.promises.readFile(path.join(monoDir, 'GeistMono-Regular.ttf')),
    fs.promises.readFile(path.join(publicFontsDir, 'geist-pixel-square.ttf')),
  ])

  cached = [
    { name: 'GeistMono', data: toArrayBuffer(medium), weight: 500 },
    { name: 'GeistMono', data: toArrayBuffer(regular), weight: 400 },
    { name: 'GeistPixelSquare', data: toArrayBuffer(pixelSquare), weight: 500 },
  ]

  return cached
}
