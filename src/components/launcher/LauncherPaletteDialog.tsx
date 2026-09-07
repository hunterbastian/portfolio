'use client'

import { AnimatePresence, m } from 'framer-motion'
import type { KeyboardEvent, RefObject } from 'react'
import { LauncherCommandList } from '@/components/launcher/LauncherCommandList'
import { LauncherSearchHeader } from '@/components/launcher/LauncherSearchHeader'
import type { LauncherCommand } from '@/components/launcher/types'
import { MOTION_EASE_SOFT, motionDurationMs } from '@/lib/motion'
import type { LauncherCommandSection } from '@/lib/launcher'

interface LauncherPaletteDialogProps {
  activeIndex: number
  commandButtonRefs: RefObject<Array<HTMLButtonElement | null>>
  commandCount: number
  commandSections: Array<LauncherCommandSection<LauncherCommand>>
  currentPageLabel: string
  inputRef: RefObject<HTMLInputElement | null>
  onActivate: (index: number) => void
  onClose: () => void
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void
  onQueryChange: (query: string) => void
  onRunCommand: (command: LauncherCommand) => void
  open: boolean
  prefersReducedMotion: boolean
  query: string
}

export function LauncherPaletteDialog({
  activeIndex,
  commandButtonRefs,
  commandCount,
  commandSections,
  currentPageLabel,
  inputRef,
  onActivate,
  onClose,
  onKeyDown,
  onQueryChange,
  onRunCommand,
  open,
  prefersReducedMotion,
  query,
}: LauncherPaletteDialogProps) {
  return (
    <AnimatePresence initial={false}>
      {open ? (
        <m.div
          className="fixed inset-0 z-[2147483000] flex items-end justify-center overflow-hidden px-3 pt-16 sm:items-start sm:px-5 sm:pt-[16vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: motionDurationMs(120, prefersReducedMotion), ease: MOTION_EASE_SOFT }}
        >
          <m.button
            type="button"
            aria-label="Close Launchpad"
            className="absolute inset-0 cursor-default"
            onClick={onClose}
            style={{
              backgroundColor: 'color-mix(in srgb, var(--background) 34%, transparent)',
            }}
            initial={{
              opacity: 0,
              backdropFilter: 'blur(0px) saturate(1)',
              WebkitBackdropFilter: 'blur(0px) saturate(1)',
            }}
            animate={{
              opacity: 1,
              backdropFilter: prefersReducedMotion ? 'blur(0px) saturate(1)' : 'blur(10px) saturate(1.04)',
              WebkitBackdropFilter: prefersReducedMotion ? 'blur(0px) saturate(1)' : 'blur(10px) saturate(1.04)',
            }}
            exit={{
              opacity: 0,
              backdropFilter: 'blur(0px) saturate(1)',
              WebkitBackdropFilter: 'blur(0px) saturate(1)',
            }}
            transition={{ duration: motionDurationMs(150, prefersReducedMotion), ease: MOTION_EASE_SOFT }}
          />
          <m.div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 left-1/2 h-[16rem] w-[34rem] max-w-[104vw] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,75,0,0.1)_0%,color-mix(in_srgb,var(--background)_34%,transparent)_46%,transparent_74%)] blur-3xl sm:bottom-auto sm:top-[15vh] sm:w-[38rem] sm:max-w-[92vw]"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: prefersReducedMotion ? 0.12 : 0.3, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: motionDurationMs(160, prefersReducedMotion), ease: MOTION_EASE_SOFT }}
          />
          <m.div
            role="dialog"
            aria-modal="true"
            aria-label="Portfolio Launchpad"
            className="relative flex max-h-[78dvh] w-full max-w-[30rem] flex-col overflow-hidden rounded-t-[10px] border border-foreground/[0.08] border-b-0 bg-background/[0.88] pb-[env(safe-area-inset-bottom)] shadow-[inset_0_1px_0_rgba(255,255,255,0.78),inset_0_0_0_1px_rgba(255,255,255,0.34),0_26px_80px_-48px_rgba(43,39,34,0.72),0_1px_3px_rgba(43,39,34,0.08)] backdrop-blur-2xl sm:max-h-[min(34rem,72vh)] sm:rounded-[8px] sm:border-b sm:pb-0"
            style={{
              background:
                'linear-gradient(180deg, var(--secondary), var(--background))',
            }}
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 18, scale: 0.97, filter: 'blur(3px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: prefersReducedMotion ? 0 : 12, scale: 0.985, filter: 'blur(2px)' }}
            transition={{ duration: motionDurationMs(170, prefersReducedMotion), ease: MOTION_EASE_SOFT }}
          >
            <LauncherSearchHeader
              commandCount={commandCount}
              commandSections={commandSections}
              currentPageLabel={currentPageLabel}
              inputRef={inputRef}
              onClose={onClose}
              onKeyDown={onKeyDown}
              onQueryChange={onQueryChange}
              query={query}
            />
            <LauncherCommandList
              activeIndex={activeIndex}
              commandButtonRefs={commandButtonRefs}
              commandSections={commandSections}
              commandCount={commandCount}
              onActivate={onActivate}
              onRunCommand={onRunCommand}
            />
          </m.div>
        </m.div>
      ) : null}
    </AnimatePresence>
  )
}
