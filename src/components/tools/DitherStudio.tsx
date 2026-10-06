'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft, Download, RotateCcw, Upload } from 'lucide-react'
import { DEFAULT_DITHER_SETTINGS, DITHER_PALETTES, ditherPixels, fitDitherImage, type DitherPalette, type DitherSettings } from '@/lib/dither'
import styles from './DitherStudio.module.css'

type Source = { image: HTMLImageElement; width: number; height: number; name: string }
const SAMPLE = '/images/optimized/ai-bg-088-ocean-dune.webp'

function renderCanvas(canvas: HTMLCanvasElement, source: Source, settings: DitherSettings, original = false) {
  canvas.width = source.width
  canvas.height = source.height
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas is unavailable in this browser.')
  if (original) {
    context.drawImage(source.image, 0, 0, source.width, source.height)
    return
  }
  const small = document.createElement('canvas')
  small.width = Math.max(1, Math.ceil(source.width / settings.pixelSize))
  small.height = Math.max(1, Math.ceil(source.height / settings.pixelSize))
  const smallContext = small.getContext('2d', { willReadFrequently: true })
  if (!smallContext) throw new Error('Canvas is unavailable in this browser.')
  smallContext.drawImage(source.image, 0, 0, small.width, small.height)
  const input = smallContext.getImageData(0, 0, small.width, small.height)
  input.data.set(ditherPixels(input.data, small.width, small.height, settings))
  smallContext.putImageData(input, 0, 0)
  context.imageSmoothingEnabled = false
  context.drawImage(small, 0, 0, source.width, source.height)
}

export default function DitherStudio() {
  const [source, setSource] = useState<Source | null>(null)
  const [settings, setSettings] = useState<DitherSettings>({ ...DEFAULT_DITHER_SETTINGS })
  const [original, setOriginal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')
  const [dragging, setDragging] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const requestRef = useRef(0)

  const loadImage = useCallback(async (url: string, name: string) => {
    const request = ++requestRef.current
    setLoading(true)
    setError('')
    setStatus('')
    try {
      const image = new Image()
      image.src = url
      await image.decode()
      if (request !== requestRef.current) return
      if (!image.naturalWidth || !image.naturalHeight) throw new Error('Empty image')
      setSource({ image, ...fitDitherImage(image.naturalWidth, image.naturalHeight), name })
      setOriginal(false)
      setStatus('Image ready.')
    } catch {
      if (request === requestRef.current) setError('This image could not be opened. Try a JPG, PNG, WebP, or AVIF file.')
    } finally {
      if (url.startsWith('blob:')) URL.revokeObjectURL(url)
      if (request === requestRef.current) setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Defer to avoid updating state synchronously during effect setup.
    const timer = window.setTimeout(() => { void loadImage(SAMPLE, 'coastal-study') }, 0)
    return () => { window.clearTimeout(timer); requestRef.current++ }
  }, [loadImage])

  useEffect(() => {
    if (!source) return
    const frame = window.requestAnimationFrame(() => {
      try {
        if (canvasRef.current) renderCanvas(canvasRef.current, source, settings, original)
      } catch {
        setError('The preview could not be rendered. Try a smaller image.')
      }
    })
    return () => window.cancelAnimationFrame(frame)
  }, [source, settings, original])

  function openFile(file?: File) {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Choose an image file: JPG, PNG, WebP, or AVIF.')
      return
    }
    if (file.size > 30 * 1024 * 1024) {
      setError('Please choose an image smaller than 30 MB.')
      return
    }
    void loadImage(URL.createObjectURL(file), file.name.replace(/\.[^.]+$/, ''))
  }

  function update<K extends keyof DitherSettings>(key: K, value: DitherSettings[K]) {
    setSettings(current => ({ ...current, [key]: value }))
    setStatus('')
  }

  async function download() {
    if (!source || loading || exporting) return
    setExporting(true)
    setError('')
    try {
      const output = document.createElement('canvas')
      renderCanvas(output, source, settings)
      const blob = await new Promise<Blob | null>(resolve => output.toBlob(resolve, 'image/png'))
      if (!blob) throw new Error('PNG encoding failed')
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${source.name.replace(/[^a-zA-Z0-9_-]+/g, '-').slice(0, 80) || 'image'}-${settings.palette}-dither.png`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.setTimeout(() => URL.revokeObjectURL(url), 30_000)
      setStatus('Your PNG is ready. Check your downloads.')
    } catch {
      setError('The PNG could not be saved. Try again with a smaller image.')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className={styles.studio}>
      <Link href="/archive" className={styles.back}><ArrowLeft size={15} aria-hidden="true" /> Playground</Link>
      <header className={styles.heading}>
        <p className={styles.eyebrow}>An image-making tool / 01</p>
        <h1>Dither Studio</h1>
        <p>Small pixels. A different kind of photograph.</p>
      </header>
      <div className={styles.workspace}>
        <section className={styles.previewSection} aria-label="Image preview">
          <div className={styles.previewBar}>
            <span className={styles.filename}>{source?.name || 'Your image'}</span>
            <div className={styles.compare} aria-label="Preview mode">
              <button type="button" aria-pressed={!original} onClick={() => setOriginal(false)}>Dither</button>
              <button type="button" aria-pressed={original} onClick={() => setOriginal(true)}>Original</button>
            </div>
          </div>
          <div
            className={`${styles.canvasStage} ${dragging ? styles.dragging : ''}`}
            aria-busy={loading}
            onDragOver={event => { event.preventDefault(); setDragging(true) }}
            onDragLeave={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDragging(false) }}
            onDrop={event => { event.preventDefault(); setDragging(false); openFile(event.dataTransfer.files[0]) }}
          >
            <canvas ref={canvasRef} role="img" aria-label={`${original ? 'Original' : 'Dithered'} preview of ${source?.name || 'your image'}`} hidden={!source} />
            {!source && !loading ? <p>Upload a photo to begin.</p> : null}
            {loading ? <div className={styles.loading}>Opening image…</div> : null}
            {dragging ? <div className={styles.dropMessage}>Drop your photo here</div> : null}
          </div>
          <div className={styles.imageInfo}>
            <span>{source ? `${source.width} × ${source.height} px` : 'JPG · PNG · WebP · AVIF'}</span>
            <button type="button" onClick={() => { void loadImage(SAMPLE, 'coastal-study') }}>Use sample</button>
          </div>
        </section>
        <aside className={styles.controls} aria-label="Dither controls">
          <input ref={fileRef} className={styles.fileInput} type="file" tabIndex={-1} accept="image/*" aria-label="Upload photo" onChange={event => { openFile(event.currentTarget.files?.[0]); event.currentTarget.value = '' }} />
          <button type="button" className={`${styles.button} ${styles.silver}`} onClick={() => fileRef.current?.click()}><Upload size={16} aria-hidden="true" /> Upload photo</button>
          <p className={styles.privacy}>Your photos stay on your device.</p>
          <fieldset className={styles.group}>
            <legend>01 / Palette</legend>
            <div className={styles.palettes}>
              {(Object.keys(DITHER_PALETTES) as DitherPalette[]).map(key => (
                <button key={key} type="button" aria-pressed={settings.palette === key} onClick={() => update('palette', key)}>
                  <span className={styles.swatch} aria-hidden="true" style={{ background: `linear-gradient(90deg, rgb(${DITHER_PALETTES[key].dark.join(',')}) 50%, rgb(${DITHER_PALETTES[key].light.join(',')}) 50%)` }} />
                  {DITHER_PALETTES[key].label}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className={styles.group}>
            <legend>02 / Texture</legend>
            <label className={styles.selectLabel} htmlFor="dither-method">Pattern</label>
            <select id="dither-method" value={settings.method} onChange={event => update('method', event.target.value as DitherSettings['method'])}>
              <option value="ordered">Ordered / grid</option>
              <option value="diffusion">Diffusion / organic</option>
            </select>
            <label className={styles.slider} htmlFor="dither-pixels"><span>Pixel size <output>{settings.pixelSize} px</output></span><input id="dither-pixels" type="range" min="1" max="12" step="1" value={settings.pixelSize} onChange={event => update('pixelSize', Number(event.target.value))} /></label>
            <label className={styles.slider} htmlFor="dither-contrast"><span>Contrast <output>{settings.contrast}</output></span><input id="dither-contrast" type="range" min="-40" max="80" step="1" value={settings.contrast} onChange={event => update('contrast', Number(event.target.value))} /></label>
            <label className={styles.slider} htmlFor="dither-grain"><span>Grain <output>{settings.grain}%</output></span><input id="dither-grain" type="range" min="0" max="60" step="1" value={settings.grain} onChange={event => update('grain', Number(event.target.value))} /></label>
          </fieldset>
          <button type="button" className={styles.reset} onClick={() => { setSettings({ ...DEFAULT_DITHER_SETTINGS }); setOriginal(false); setStatus('Settings reset.') }}><RotateCcw size={14} aria-hidden="true" /> Reset settings</button>
          <div className={styles.export}>
            <button type="button" className={`${styles.button} ${styles.silver}`} disabled={!source || loading || exporting} onClick={() => { void download() }}><Download size={16} aria-hidden="true" /> {exporting ? 'Saving…' : 'Download PNG'}</button>
            <p>Full image · up to 2400 px</p>
          </div>
          <p className={styles.error} role="alert">{error}</p>
          <p className={styles.status} role="status">{status}</p>
        </aside>
      </div>
      <p className={styles.note}>A photograph, reduced to two inks. Try a portrait, a landscape, or a little light through a window.</p>
      <Link href="/archive" className={styles.back}><ArrowLeft size={15} aria-hidden="true" /> Back to Playground</Link>
    </div>
  )
}
