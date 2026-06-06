'use client'

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { playClick, playHoverClick, playTone, playChime, playWhoosh } from './synth'
import type { SoundName } from './types'
import {
  getNextSoundEnabled,
  readStoredSoundEnabled,
  writeStoredSoundEnabled,
} from './preferences'

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

const synthMap: Record<SoundName, () => void> = {
  click: playClick,
  hoverClick: playHoverClick,
  tone: playTone,
  chime: playChime,
  whoosh: playWhoosh,
}

export function SoundProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false)

  // Read persisted preference on mount
  useEffect(() => {
    if (readStoredSoundEnabled(localStorage)) setEnabled(true)
  }, [])

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = getNextSoundEnabled(prev)
      writeStoredSoundEnabled(localStorage, next)
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
