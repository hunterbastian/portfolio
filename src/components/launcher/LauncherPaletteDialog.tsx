'use client'

import { AnimatePresence, m } from 'framer-motion'
import type { KeyboardEvent, RefObject } from 'react'
import { LauncherCommandList } from '@/components/launcher/LauncherCommandList'
import { LauncherSearchHeader } from '@/components/launcher/LauncherSearchHeader'
import type { LauncherCommand } from '@/components/launcher/types'
import {
  LAUNCHER_CLOSE_ARIA_LABEL,
  LAUNCHER_DIALOG_ARIA_LABEL,
  type LauncherCommandSection,
} from '@/lib/launcher'
import { MOTION_EASE_SOFT, motionDurationMs } from '@/lib/motion'

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
            aria-label={LAUNCHER_CLOSE_ARIA_LABEL}
            className="absolute inset-0 cursor-default"
            onClick={onClose}
            style={{
              backgroundColor: 'color-mix(in srgb, #191919 70%, transparent)',
            }}
            initial={{
              opacity: 0,
              backdropFilter: 'blur(0px)',
              WebkitBackdropFilter: 'blur(0px)',
            }}
            animate={{
              opacity: 1,
              backdropFilter: prefersReducedMotion ? 'blur(0px)' : 'blur(6px)',
              WebkitBackdropFilter: prefersReducedMotion ? 'blur(0px)' : 'blur(6px)',
            }}
            exit={{
              opacity: 0,
              backdropFilter: 'blur(0px)',
              WebkitBackdropFilter: 'blur(0px)',
            }}
            transition={{ duration: motionDurationMs(150, prefersReducedMotion), ease: MOTION_EASE_SOFT }}
          />
          <m.div
            role="dialog"
            aria-modal="true"
            aria-label={LAUNCHER_DIALOG_ARIA_LABEL}
            className="relative flex max-h-[78dvh] w-full max-w-[30rem] flex-col overflow-hidden rounded-t-[10px] border border-[#373737] border-b-0 bg-[#252525] pb-[env(safe-area-inset-bottom)] shadow-[0_24px_56px_-40px_rgba(0,0,0,0.72),0_2px_8px_rgba(0,0,0,0.3)] sm:max-h-[min(34rem,72vh)] sm:rounded-[8px] sm:border-b sm:pb-0"
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
