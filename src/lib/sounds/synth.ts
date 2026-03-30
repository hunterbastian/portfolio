/**
 * Web Audio API synthesized sounds.
 * No audio files — all sounds are generated from oscillators and noise.
 * Volumes are intentionally very low (0.05–0.15 range).
 */

import { getAudioContext } from './engine'

// ---------------------------------------------------------------------------
// Click — short noise burst through a bandpass filter, wooden/tactile feel
// ---------------------------------------------------------------------------
export function playClick() {
  const ctx = getAudioContext()
  if (!ctx) return
  const now = ctx.currentTime

  // White noise via buffer
  const bufferSize = ctx.sampleRate * 0.05 // 50ms
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = noiseBuffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1
  }

  const noise = ctx.createBufferSource()
  noise.buffer = noiseBuffer

  // Bandpass filter for wooden character
  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = 2000
  filter.Q.value = 1.5

  // Quick amplitude envelope
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.1, now)
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04)

  noise.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)
  noise.start(now)
  noise.stop(now + 0.05)
}

// ---------------------------------------------------------------------------
// Tone — sine wave sweep 400Hz→600Hz, warm and ascending
// ---------------------------------------------------------------------------
export function playTone() {
  const ctx = getAudioContext()
  if (!ctx) return
  const now = ctx.currentTime

  const osc = ctx.createOscillator()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(400, now)
  osc.frequency.exponentialRampToValueAtTime(600, now + 0.1)

  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.07, now)
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1)

  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(now)
  osc.stop(now + 0.1)
}

// ---------------------------------------------------------------------------
// Chime — two sine tones (C5 + E5) with quick decay, playful/rewarding
// ---------------------------------------------------------------------------
export function playChime() {
  const ctx = getAudioContext()
  if (!ctx) return
  const now = ctx.currentTime

  const frequencies = [523.25, 659.25] // C5, E5

  for (const freq of frequencies) {
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = freq

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.08, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.2)
  }
}

// ---------------------------------------------------------------------------
// Whoosh — white noise with sweeping bandpass, airy/directional
// ---------------------------------------------------------------------------
export function playWhoosh() {
  const ctx = getAudioContext()
  if (!ctx) return
  const now = ctx.currentTime

  const bufferSize = ctx.sampleRate * 0.15 // 150ms
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = noiseBuffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1
  }

  const noise = ctx.createBufferSource()
  noise.buffer = noiseBuffer

  // Sweeping bandpass for directional feel
  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.setValueAtTime(800, now)
  filter.frequency.exponentialRampToValueAtTime(2400, now + 0.15)
  filter.Q.value = 0.8

  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.0001, now)
  gain.gain.exponentialRampToValueAtTime(0.06, now + 0.04)
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15)

  noise.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)
  noise.start(now)
  noise.stop(now + 0.15)
}
