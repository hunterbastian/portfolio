'use client'

import { useReducedMotion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { useWebHaptics } from 'web-haptics/react'
import { LauncherPaletteDialog } from '@/components/launcher/LauncherPaletteDialog'
import { LauncherRippleLayer } from '@/components/launcher/LauncherRippleLayer'
import { LauncherToastLayer } from '@/components/launcher/LauncherToastLayer'
import type { LauncherCommand, LauncherProject } from '@/components/launcher/types'
import { useEmptySpaceRipples } from '@/components/launcher/useEmptySpaceRipples'
import { useJoyToastState } from '@/components/launcher/useJoyToastState'
import { useLauncherCommands } from '@/components/launcher/useLauncherCommands'
import { showJoyToast } from '@/lib/joy'
import { analytics } from '@/lib/analytics'
import {
  LAUNCHER_EMAIL_ADDRESS,
  LAUNCHER_OPEN_EVENT,
  activateLauncherClosePalette,
  activateLauncherCommandRun,
  activateLauncherGlobalKeyboardAction,
  activateLauncherOpenPalette,
  activateLauncherOpenSignal,
  buildLauncherCommandSections,
  getLauncherPageLabel,
  getClampedLauncherActiveIndex,
  getGlobalLauncherKeyboardAction,
  getLauncherAnalyticsTarget,
  getMatchingLauncherCommands,
  getNextLauncherActiveIndex,
  getLauncherPaletteKeyboardAction,
  getNextRecentCommandIds,
  getVisibleCommandEntries,
  isLauncherTypingTarget,
  readStoredRecentCommandIds,
  scheduleLauncherPaletteFocus,
  writeStoredRecentCommandIds,
} from '@/lib/launcher'

interface JoyfulLayerPanelProps {
  projects?: LauncherProject[]
  openSignal?: number
}

export default function JoyfulLayerPanel({ projects = [], openSignal = 0 }: JoyfulLayerPanelProps) {
  const pathname = usePathname()
  const prefersReducedMotion = useReducedMotion() ?? false
  const haptic = useWebHaptics()
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const [recentCommandIds, setRecentCommandIds] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement | null>(null)
  const commandButtonRefs = useRef<Array<HTMLButtonElement | null>>([])
  const currentPageLabel = getLauncherPageLabel(pathname)
  const ripples = useEmptySpaceRipples({ paletteOpen, prefersReducedMotion })
  const toast = useJoyToastState()

  const commands = useLauncherCommands(projects)

  const matchingCommands = useMemo(() => getMatchingLauncherCommands(commands, query), [commands, query])

  const commandSections = useMemo(
    () => buildLauncherCommandSections({ commands, matchingCommands, query, recentCommandIds }),
    [commands, matchingCommands, query, recentCommandIds],
  )

  const visibleCommandEntries = useMemo(
    () => getVisibleCommandEntries(commandSections),
    [commandSections],
  )

  useEffect(() => {
    setRecentCommandIds(readStoredRecentCommandIds(window.localStorage))
  }, [])

  const rememberCommand = useCallback((commandId: string) => {
    setRecentCommandIds((current) => {
      const next = getNextRecentCommandIds(commandId, current)

      writeStoredRecentCommandIds(window.localStorage, next)

      return next
    })
  }, [])

  useEffect(() => {
    const handleOpenLauncher = () => {
      activateLauncherOpenPalette({
        setPaletteOpen,
        triggerHaptic: (style) => haptic.trigger(style),
      })
    }

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      const action = getGlobalLauncherKeyboardAction({
        ctrlKey: event.ctrlKey,
        isTypingTarget: isLauncherTypingTarget(event.target),
        key: event.key,
        metaKey: event.metaKey,
      })
      if (!action) return

      event.preventDefault()
      activateLauncherGlobalKeyboardAction({
        action,
        setPaletteOpen,
        togglePaletteOpen: () => setPaletteOpen((open) => !open),
        triggerHaptic: (style) => haptic.trigger(style),
      })
    }

    window.addEventListener(LAUNCHER_OPEN_EVENT, handleOpenLauncher)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener(LAUNCHER_OPEN_EVENT, handleOpenLauncher)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [haptic])

  useEffect(() => {
    setPaletteOpen(false)
  }, [pathname])

  useEffect(() => {
    activateLauncherOpenSignal({
      openSignal,
      setActiveIndex,
      setPaletteOpen,
      setQuery,
      showToast: showJoyToast,
    })
  }, [openSignal])

  useEffect(() => {
    if (!paletteOpen) {
      setQuery('')
      setActiveIndex(0)
      return
    }

    return scheduleLauncherPaletteFocus({
      cancelFrame: (frame) => window.cancelAnimationFrame(frame),
      focusInput: () => {
        inputRef.current?.focus({ preventScroll: true })
      },
      requestFrame: (callback) => window.requestAnimationFrame(callback),
    })
  }, [paletteOpen])

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  useEffect(() => {
    setActiveIndex((index) => getClampedLauncherActiveIndex(index, visibleCommandEntries.length))
    commandButtonRefs.current.length = visibleCommandEntries.length
  }, [visibleCommandEntries.length])

  useEffect(() => {
    if (!paletteOpen) return

    commandButtonRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex, paletteOpen])

  const closePalette = () => {
    activateLauncherClosePalette({
      setPaletteOpen,
      triggerHaptic: (style) => haptic.trigger(style),
    })
  }

  const trackCommand = (command: LauncherCommand) => {
    const target = getLauncherAnalyticsTarget(command, LAUNCHER_EMAIL_ADDRESS)

    if (target.type === 'project') {
      analytics.projectClick(target.slug, target.label)
    } else if (target.type === 'external') {
      analytics.externalLink(target.href, target.label)
    } else {
      analytics.navigationClick(target.label)
    }
  }

  const runCommand = async (command: LauncherCommand) => {
    await activateLauncherCommandRun({
      closePalette: () => setPaletteOpen(false),
      command,
      rememberCommand,
      trackCommand,
      triggerHaptic: (style) => haptic.trigger(style),
    })
  }

  const handlePaletteKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const action = getLauncherPaletteKeyboardAction({
      commandCount: visibleCommandEntries.length,
      key: event.key,
    })
    if (!action) return

    event.preventDefault()

    if (action.type === 'close') {
      closePalette()
    } else if (action.type === 'move') {
      setActiveIndex((index) => getNextLauncherActiveIndex(index, action.direction, visibleCommandEntries.length))
    } else if (action.type === 'run') {
      const activeCommand = visibleCommandEntries[activeIndex]?.command
      if (activeCommand) void runCommand(activeCommand)
    }
  }

  return (
    <>
      <LauncherRippleLayer ripples={ripples} />

      <LauncherPaletteDialog
        activeIndex={activeIndex}
        commandButtonRefs={commandButtonRefs}
        commandCount={visibleCommandEntries.length}
        commandSections={commandSections}
        currentPageLabel={currentPageLabel}
        inputRef={inputRef}
        onActivate={setActiveIndex}
        onClose={closePalette}
        onKeyDown={handlePaletteKeyDown}
        onQueryChange={setQuery}
        onRunCommand={(command) => void runCommand(command)}
        open={paletteOpen}
        prefersReducedMotion={prefersReducedMotion}
        query={query}
      />

      <LauncherToastLayer prefersReducedMotion={prefersReducedMotion} toast={toast} />
    </>
  )
}
