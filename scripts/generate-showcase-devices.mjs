/**
 * Builds the homepage device-screen stills and seamless loops.
 * The glossy frame itself lives in CSS (home-showcase.css) so every
 * current and future project shares one device. This script only fills
 * the screen: a 16:10 cover still, plus a 6s muted zoom that starts and
 * ends on that same crop.
 *
 * None of the seven carousel projects publish a reachable demo URL, so
 * the sources are the sharpest stills already in the repo.
 */
import { spawn } from 'node:child_process'
import { stat, unlink } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const root = process.cwd()
const outDir = path.join(root, 'public/showcase')
const POSTER_W = 1920
const POSTER_H = 1200
const VIDEO_W = 1280
const VIDEO_H = 800
const FRAMES = 180
const FPS = 30
const ZOOM = 0.08
const MAX_BYTES = 1.5 * 1024 * 1024

const sources = {
  'mentalhealth-minisite': 'public/images/projects/mentalhealth-minisite.jpg',
  lumo: 'public/images/optimized/projects/lumo.webp',
  'middle-earth-journey': 'public/images/projects/middle-earth/ajourneythroughmiddleearth.webp',
  'wander-utah': 'public/images/projects/wanderutah.webp',
  'porsche-app': 'public/images/optimized/projects/porscheapp.webp',
  'aol-redesign': 'public/images/projects/aol-app-case-study.webp',
  nutricost: 'public/images/projects/nutricost-case-study.webp',
}

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: ['ignore', 'ignore', 'pipe'] })
    let error = ''
    child.stderr.on('data', (chunk) => {
      error += chunk.toString()
    })
    child.on('close', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`${command} ${args.join(' ')} failed (${code})\n${error.slice(-2000)}`))
    })
  })
}

function zoomFilter() {
  const z = `(1+${ZOOM}*sin(PI*n/${FRAMES - 1}))`
  const width = `trunc(${VIDEO_W}*${z}/2)*2`
  const height = `trunc(${VIDEO_H}*${z}/2)*2`
  const y = `max(0,min(in_h-${VIDEO_H},(in_h-${VIDEO_H})/2-(in_h-${VIDEO_H})*0.55*sin(PI*n/${FRAMES - 1})))`
  return [
    `scale=w='${width}':h='${height}':eval=frame`,
    `crop=${VIDEO_W}:${VIDEO_H}:(in_w-${VIDEO_W})/2:'${y}'`,
  ].join(',')
}

async function encode(input, output, args) {
  await run('ffmpeg', [
    '-y',
    '-loop', '1',
    '-framerate', String(FPS),
    '-i', input,
    '-vf', zoomFilter(),
    '-frames:v', String(FRAMES),
    '-r', String(FPS),
    '-an',
    ...args,
    output,
  ])
}

async function encodeMp4(input, output) {
  const attempts = [
    ['-c:v', 'libx264', '-preset', 'slow', '-crf', '28', '-pix_fmt', 'yuv420p', '-movflags', '+faststart'],
    ['-c:v', 'libx264', '-preset', 'slow', '-crf', '32', '-pix_fmt', 'yuv420p', '-movflags', '+faststart'],
    ['-c:v', 'libx264', '-preset', 'slow', '-crf', '35', '-pix_fmt', 'yuv420p', '-movflags', '+faststart'],
  ]

  for (const args of attempts) {
    await encode(input, output, args)
    const { size } = await stat(output)
    if (size <= MAX_BYTES) return size
  }

  const { size } = await stat(output)
  throw new Error(`${output} is ${size} bytes, above ${MAX_BYTES}`)
}

async function encodeWebm(input, output) {
  await encode(input, output, [
    '-c:v', 'libvpx-vp9',
    '-pix_fmt', 'yuv420p',
    '-crf', '38',
    '-b:v', '0',
    '-deadline', 'good',
    '-cpu-used', '4',
    '-row-mt', '1',
  ])
  const { size } = await stat(output)
  if (size > MAX_BYTES) {
    await unlink(output)
    return null
  }
  return size
}

async function buildPoster(source, posterPath, platePath) {
  const plate = sharp(path.join(root, source)).rotate().resize(POSTER_W, POSTER_H, {
    fit: 'cover',
    position: 'centre',
  })
  await plate.clone().webp({ quality: 82, effort: 5 }).toFile(posterPath)
  await plate.clone().png({ compressionLevel: 9 }).toFile(platePath)
}

async function buildOg(posterPath) {
  const width = 1120
  const height = 700
  const bezel = 22
  const screenW = width - bezel * 2
  const screenH = height - bezel * 2
  const padX = 64
  const padY = 48
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bezel" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#3c3c3a"/>
      <stop offset="0.42" stop-color="#1a1a19"/>
      <stop offset="1" stop-color="#2a2a28"/>
    </linearGradient>
  </defs>
  <rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="36" fill="url(#bezel)" stroke="#0a0a0a" stroke-opacity="0.35"/>
  <rect x="18" y="2" width="${width - 36}" height="2" rx="1" fill="#ffffff" fill-opacity="0.42"/>
</svg>`
  const screen = await sharp(posterPath).resize(screenW, screenH, { fit: 'cover' }).png().toBuffer()
  const glass = Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${screenW}" height="${screenH}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.34"/>
      <stop offset="0.2" stop-color="#ffffff" stop-opacity="0.06"/>
      <stop offset="0.42" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="${screenW}" height="${screenH}" rx="18" fill="url(#g)"/>
</svg>`)
  const framed = await sharp(Buffer.from(svg))
    .composite([
      { input: screen, left: bezel, top: bezel },
      { input: glass, left: bezel, top: bezel },
    ])
    .png()
    .toBuffer()
  const shadow = await sharp(Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <rect width="${width}" height="${height}" rx="36" fill="#0a0a0a"/>
</svg>`))
    .blur(16)
    .ensureAlpha()
    .png()
    .toBuffer()

  await sharp({
    create: {
      width: width + padX * 2,
      height: height + padY * 2,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      { input: shadow, left: padX, top: padY + 18 },
      { input: framed, left: padX, top: padY },
    ])
    .png()
    .toFile(path.join(outDir, 'og-lumo-device.png'))
}

const sizes = {}

for (const [slug, source] of Object.entries(sources)) {
  const posterPath = path.join(outDir, `${slug}.webp`)
  const platePath = path.join(outDir, `${slug}-plate.png`)
  const mp4Path = path.join(outDir, `${slug}-loop.mp4`)
  const webmPath = path.join(outDir, `${slug}-loop.webm`)

  await buildPoster(source, posterPath, platePath)
  const mp4 = await encodeMp4(platePath, mp4Path)
  const webm = await encodeWebm(platePath, webmPath)
  await unlink(platePath)

  const poster = await stat(posterPath)
  sizes[slug] = {
    poster: poster.size,
    mp4,
    webm,
  }
  console.log(`${slug} poster=${poster.size} mp4=${mp4} webm=${webm ?? 'skipped'}`)
}

await buildOg(path.join(outDir, 'lumo.webp'))

for (const slug of Object.keys(sources)) {
  const transparent = path.join(outDir, `${slug}-transparent.webp`)
  try {
    await unlink(transparent)
  } catch {
    // Already removed.
  }
}

console.log(JSON.stringify(sizes, null, 2))
