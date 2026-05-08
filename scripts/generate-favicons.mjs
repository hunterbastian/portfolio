import sharp from 'sharp'
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const faviconDir = path.join(root, 'public/favicon')
const source = path.join(faviconDir, 'favicon-source.svg')
const browserSvg = path.join(faviconDir, 'favicon.svg')
const sourcePixelSize = 64

const targets = [
  { size: 16,  file: 'favicon-16x16.png' },
  { size: 32,  file: 'favicon-32x32.png' },
  { size: 48,  file: null }, // temp, used only to build the .ico
  { size: 180, file: 'apple-touch-icon.png' },
  { size: 192, file: 'favicon-192x192.png' },
  { size: 512, file: 'favicon-512x512.png' },
]

const svg = fs.readFileSync(source)
fs.copyFileSync(source, browserSvg)

function buildIco(images) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(images.length, 4)

  const entries = Buffer.alloc(images.length * 16)
  let offset = header.length + entries.length

  images.forEach(({ size, data }, index) => {
    const entryOffset = index * 16
    entries.writeUInt8(size >= 256 ? 0 : size, entryOffset)
    entries.writeUInt8(size >= 256 ? 0 : size, entryOffset + 1)
    entries.writeUInt8(0, entryOffset + 2)
    entries.writeUInt8(0, entryOffset + 3)
    entries.writeUInt16LE(1, entryOffset + 4)
    entries.writeUInt16LE(32, entryOffset + 6)
    entries.writeUInt32LE(data.length, entryOffset + 8)
    entries.writeUInt32LE(offset, entryOffset + 12)
    offset += data.length
  })

  return Buffer.concat([header, entries, ...images.map(({ data }) => data)])
}

const pixelSource = await sharp(svg)
  .resize(sourcePixelSize, sourcePixelSize, { kernel: sharp.kernel.nearest })
  .png()
  .toBuffer()

for (const { size, file } of targets) {
  const out = file
    ? path.join(faviconDir, file)
    : path.join(faviconDir, `_tmp-${size}.png`)

  await sharp(pixelSource)
    .resize(size, size, { kernel: sharp.kernel.nearest })
    .png({ compressionLevel: 9 })
    .toFile(out)
}

const icoInputs = [16, 32, 48].map((s) => {
  const named = targets.find((t) => t.size === s)?.file
  return named
    ? path.join(faviconDir, named)
    : path.join(faviconDir, `_tmp-${s}.png`)
})
const ico = buildIco(icoInputs.map((file, index) => ({
  size: [16, 32, 48][index],
  data: fs.readFileSync(file),
})))
fs.writeFileSync(path.join(faviconDir, 'favicon.ico'), ico)

fs.copyFileSync(path.join(faviconDir, 'favicon.ico'), path.join(root, 'public/favicon.ico'))
if (fs.existsSync(path.join(faviconDir, '_tmp-48.png'))) {
  fs.unlinkSync(path.join(faviconDir, '_tmp-48.png'))
}

console.log('generated favicons and root fallback from', path.relative(root, source))
