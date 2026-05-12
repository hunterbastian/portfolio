'use client'

import { useCallback, useEffect, useRef, useState, type ComponentType } from 'react'
import { useWebHaptics } from 'web-haptics/react'

const LAUNCHER_OPEN_EVENT = 'hb-open-launcher'
const LAUNCHER_PRELOAD_EVENT = 'hb-preload-launcher'

interface LauncherProject {
  slug: string
  title: string
  description: string
  category: string
  tags: string[]
  date: string
}

interface JoyfulLayerProps {
  projects?: LauncherProject[]
}

interface JoyfulLayerPanelProps {
  projects?: LauncherProject[]
  openSignal: number
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  const tagName = target.tagName.toLowerCase()

  return tagName === 'input' || tagName === 'textarea' || target.isContentEditable
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
      const key = event.key.toLowerCase()
      const modifierKey = event.metaKey || event.ctrlKey

      if (modifierKey && key === 'k') {
        event.preventDefault()
        haptic.trigger('light')
        openPanel()
        return
      }

      if (event.key === '/' && !isTypingTarget(event.target)) {
        event.preventDefault()
        haptic.trigger('light')
        openPanel()
      }
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
