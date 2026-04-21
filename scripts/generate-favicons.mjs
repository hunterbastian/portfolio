import sharp from 'sharp'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const faviconDir = path.join(root, 'public/favicon')
const source = path.join(faviconDir, 'favicon-source.svg')

const targets = [
  { size: 16,  file: 'favicon-16x16.png' },
  { size: 32,  file: 'favicon-32x32.png' },
  { size: 48,  file: null }, // temp, used only to build the .ico
  { size: 180, file: 'apple-touch-icon.png' },
  { size: 192, file: 'favicon-192x192.png' },
  { size: 512, file: 'favicon-512x512.png' },
]

const svg = fs.readFileSync(source)

for (const { size, file } of targets) {
  const out = file
    ? path.join(faviconDir, file)
    : path.join(faviconDir, `_tmp-${size}.png`)
  await sharp(svg, { density: Math.max(72, size * 2) })
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toFile(out)
}

const icoInputs = [16, 32, 48].map((s) => {
  const named = targets.find((t) => t.size === s)?.file
  return named
    ? path.join(faviconDir, named)
    : path.join(faviconDir, `_tmp-${s}.png`)
})
execFileSync('magick', [...icoInputs, path.join(faviconDir, 'favicon.ico')], {
  stdio: 'inherit',
})

fs.unlinkSync(path.join(faviconDir, '_tmp-48.png'))

console.log('generated favicons from', path.relative(root, source))
