let audioContext: AudioContext | null = null

/**
 * Returns the shared AudioContext, creating it lazily.
 * Returns null when Web Audio API is unavailable (SSR, unsupported browser).
 */
export function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!window.AudioContext) return null

  if (!audioContext) {
    audioContext = new AudioContext()
  }

  // Resume if suspended (browsers suspend until user gesture)
  if (audioContext.state === 'suspended') {
    audioContext.resume().catch(() => {})
  }

  return audioContext
}

/**
 * Decode a base64 data URI into an AudioBuffer.
 * Retained for backward compatibility with any existing SoundAsset usage.
 */
const bufferCache = new Map<string, AudioBuffer>()

export async function decodeAudioData(dataUri: string): Promise<AudioBuffer> {
  const cached = bufferCache.get(dataUri)
  if (cached) return cached

  const ctx = getAudioContext()
  if (!ctx) throw new Error('AudioContext unavailable')

  const base64 = dataUri.split(',')[1]
  const binaryString = atob(base64)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }

  const audioBuffer = await ctx.decodeAudioData(bytes.buffer.slice(0))
  bufferCache.set(dataUri, audioBuffer)
  return audioBuffer
}
