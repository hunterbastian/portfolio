'use client'

import { Command, Search, X } from 'lucide-react'
import type { KeyboardEvent, RefObject } from 'react'
import type { LauncherCommand } from '@/components/launcher/types'
import {
  LAUNCHER_CLOSE_ARIA_LABEL,
  LAUNCHER_SEARCH_ARIA_LABEL,
  LAUNCHER_TITLE,
  type LauncherCommandSection,
} from '@/lib/launcher'

interface LauncherSearchHeaderProps {
  commandCount: number
  commandSections: Array<LauncherCommandSection<LauncherCommand>>
  currentPageLabel: string
  inputRef: RefObject<HTMLInputElement | null>
  onClose: () => void
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void
  onQueryChange: (query: string) => void
  query: string
}

export function LauncherSearchHeader({
  commandCount,
  commandSections,
  currentPageLabel,
  inputRef,
  onClose,
  onKeyDown,
  onQueryChange,
  query,
}: LauncherSearchHeaderProps) {
  return (
    <div className="sticky top-0 z-10 border-b border-[#373737] bg-[#252525] p-2.5 shadow-[0_8px_20px_-18px_rgba(0,0,0,0.55)]">
      <div className="mb-2.5 flex items-center justify-between gap-3 px-1">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] border border-[#373737] bg-[#202020] text-foreground/82">
            <Command aria-hidden="true" size={12} strokeWidth={1.8} />
          </span>
          <span className="min-w-0">
            <span className="block truncate font-header text-[0.875rem] leading-tight tracking-[-0.02em] text-foreground">
              {LAUNCHER_TITLE}
            </span>
            <span className="block truncate font-mono text-[0.6rem] text-muted-foreground/66">
              {currentPageLabel}
            </span>
          </span>
        </div>
        <button
          type="button"
          aria-label={LAUNCHER_CLOSE_ARIA_LABEL}
          className="group/launcher-close flex h-10 w-10 shrink-0 touch-manipulation items-center justify-center rounded-[7px] border border-transparent text-muted-foreground transition-[background-color,color,border-color,transform] duration-150 hover:border-[#373737] hover:bg-[#2f2f2f] hover:text-foreground active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          onClick={onClose}
        >
          <X
            aria-hidden="true"
            size={13}
            className="transition-transform duration-150 group-hover/launcher-close:rotate-6"
          />
        </button>
      </div>
      <div className="relative">
        <Search
          aria-hidden="true"
          size={13}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/68"
        />
        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded-[5px] border border-[#373737] bg-[#202020] px-1.5 py-1 font-mono text-[0.56rem] leading-none text-muted-foreground/62">
          ⌘K
        </span>
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Search or open..."
          className="h-10 w-full rounded-[7px] border border-[#373737] bg-[#202020] pl-9 pr-16 font-mono text-[0.875rem] text-foreground outline-none placeholder:text-muted-foreground/62 transition-[background-color,border-color,box-shadow] duration-150 focus:border-ring focus:bg-[#252525] focus:shadow-[0_0_0_2px_color-mix(in_srgb,var(--ring)_26%,transparent)]"
          aria-label={LAUNCHER_SEARCH_ARIA_LABEL}
        />
      </div>
      <div className="mt-2 flex gap-1 overflow-x-auto px-0.5 pb-0.5 [scrollbar-width:none]">
        <span className="shrink-0 rounded-[999px] border border-[#373737] bg-[#202020] px-2.5 py-1 font-mono text-[0.58rem] leading-none text-muted-foreground/68">
          {commandCount} commands
        </span>
        {commandSections.map((section) => (
          <span
            key={`chip-${section.id}`}
            className="shrink-0 rounded-[999px] border border-[#373737] bg-[#202020] px-2.5 py-1 font-mono text-[0.58rem] leading-none text-muted-foreground/62"
          >
            {section.label}
            <span className="ml-1 text-muted-foreground/42">{section.commands.length}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
