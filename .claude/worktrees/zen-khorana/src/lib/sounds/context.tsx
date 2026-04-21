'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { getAudioContext, decodeAudioData } from './engine'
import type { SoundAsset } from './types'

interface SoundContextValue {
  enabled: boolean
  toggle: () => void
  play: (sound: SoundAsset, volume?: number) => void
}

const SoundContext = createContext<SoundContextValue>({
  enabled: false,
  toggle: () => {},
  play: () => {},
})

const STORAGE_KEY = 'hb-sound-enabled'

export function SoundProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false)
  const bufferCache = useRef(new Map<string, AudioBuffer>())

  // Read persisted preference on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored === 'true') setEnabled(true)
    } catch {
      // localStorage unavailable
    }
  }, [])

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev
      try {
        localStorage.setItem(STORAGE_KEY, String(next))
      } catch {
        // localStorage unavailable
      }
      return next
    })
  }, [])

  const play = useCallback(
    (sound: SoundAsset, volume = 0.4) => {
      if (!enabled) return

      const doPlay = async () => {
        let buffer = bufferCache.current.get(sound.dataUri)
        if (!buffer) {
          buffer = await decodeAudioData(sound.dataUri)
          bufferCache.current.set(sound.dataUri, buffer)
        }

        const ctx = getAudioContext()
        if (ctx.state === 'suspended') {
          await ctx.resume()
        }

        const source = ctx.createBufferSource()
        const gain = ctx.createGain()
        source.buffer = buffer
        gain.gain.value = volume
        source.connect(gain)
        gain.connect(ctx.destination)
        source.start(0)
      }

      doPlay().catch(() => {})
    },
    [enabled],
  )

  return (
    <SoundContext.Provider value={{ enabled, toggle, play }}>
      {children}
    </SoundContext.Provider>
  )
}

export function useUISound() {
  return useContext(SoundContext)
}
