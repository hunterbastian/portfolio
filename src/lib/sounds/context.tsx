'use client'

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { playClick, playTone, playChime, playWhoosh } from './synth'
import type { SoundName } from './types'

interface SoundContextValue {
  /** Whether sound is enabled (opt-in, default false) */
  enabled: boolean
  /** Toggle sound on/off and persist preference */
  toggle: () => void
  /** Play a named synthesized sound */
  play: (sound: SoundName) => void
}

const SoundContext = createContext<SoundContextValue>({
  enabled: false,
  toggle: () => {},
  play: () => {},
})

const STORAGE_KEY = 'hb-sound-enabled'

const synthMap: Record<SoundName, () => void> = {
  click: playClick,
  tone: playTone,
  chime: playChime,
  whoosh: playWhoosh,
}

export function SoundProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false)

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
    (sound: SoundName) => {
      if (!enabled) return
      const fn = synthMap[sound]
      if (fn) fn()
    },
    [enabled],
  )

  return (
    <SoundContext.Provider value={{ enabled, toggle, play }}>
      {children}
    </SoundContext.Provider>
  )
}

export function useSound() {
  return useContext(SoundContext)
}
