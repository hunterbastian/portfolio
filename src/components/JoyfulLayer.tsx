'use client'

import { useCallback, useEffect, useRef, useState, type ComponentType } from 'react'
import { useWebHaptics } from 'web-haptics/react'
import type { LauncherProject } from '@/components/launcher/types'
import {
  LAUNCHER_OPEN_EVENT,
  LAUNCHER_PRELOAD_EVENT,
  getGlobalLauncherKeyboardAction,
  isLauncherTypingTarget,
} from '@/lib/launcher'

interface JoyfulLayerProps {
  projects?: LauncherProject[]
}

interface JoyfulLayerPanelProps {
  projects?: LauncherProject[]
  openSignal: number
}

export default function JoyfulLayer({ projects = [] }: JoyfulLayerProps) {
  const haptic = useWebHaptics()
  const [PanelComponent, setPanelComponent] = useState<ComponentType<JoyfulLayerPanelProps> | null>(null)
  const [openSignal, setOpenSignal] = useState(0)
  const panelImportRef = useRef<Promise<{ default: ComponentType<JoyfulLayerPanelProps> }> | null>(null)

  const loadPanel = useCallback(() => {
    if (!panelImportRef.current) {
      panelImportRef.current = import('@/components/JoyfulLayerPanel')
    }

    void panelImportRef.current.then((module) => {
      setPanelComponent(() => module.default)
    })
  }, [])

  const openPanel = useCallback(() => {
    loadPanel()
    setOpenSignal((value) => value + 1)
  }, [loadPanel])

  useEffect(() => {
    if (PanelComponent) return

    const handleOpenLauncher = () => {
      openPanel()
    }

    const handlePreloadLauncher = () => {
      loadPanel()
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const action = getGlobalLauncherKeyboardAction({
        ctrlKey: event.ctrlKey,
        isTypingTarget: isLauncherTypingTarget(event.target),
        key: event.key,
        metaKey: event.metaKey,
      })
      if (!action) return

      event.preventDefault()
      haptic.trigger('light')
      openPanel()
    }

    window.addEventListener(LAUNCHER_OPEN_EVENT, handleOpenLauncher)
    window.addEventListener(LAUNCHER_PRELOAD_EVENT, handlePreloadLauncher)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener(LAUNCHER_OPEN_EVENT, handleOpenLauncher)
      window.removeEventListener(LAUNCHER_PRELOAD_EVENT, handlePreloadLauncher)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [PanelComponent, haptic, loadPanel, openPanel])

  if (!PanelComponent) {
    return null
  }

  return <PanelComponent projects={projects} openSignal={openSignal} />
}
