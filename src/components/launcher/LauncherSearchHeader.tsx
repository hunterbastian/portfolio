'use client'

import { Command, Search, X } from 'lucide-react'
import type { KeyboardEvent, RefObject } from 'react'
import type { LauncherCommandSection } from '@/lib/launcher'
import type { LauncherCommand } from '@/components/launcher/types'

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
    <div className="sticky top-0 z-10 border-b border-border/45 bg-background/[0.76] p-2.5 shadow-[0_10px_26px_-24px_rgba(43,39,34,0.42)] backdrop-blur-xl">
      <div className="mb-2.5 flex items-center justify-between gap-3 px-1">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] bg-[color-mix(in_srgb,var(--contact-email-accent-soft)_74%,var(--background))] text-[color-mix(in_srgb,var(--contact-email-accent)_76%,var(--foreground))] shadow-[inset_0_1px_0_rgba(255,255,255,0.76),0_10px_22px_-20px_rgba(25,90,94,0.55)]">
            <Command aria-hidden="true" size={12} strokeWidth={1.8} />
          </span>
          <span className="min-w-0">
            <span className="block truncate font-header text-[0.95rem] leading-tight tracking-[-0.02em] text-foreground">
              Launchpad
            </span>
            <span className="block truncate font-mono text-[0.6rem] text-muted-foreground/66">
              {currentPageLabel}
            </span>
          </span>
        </div>
        <button
          type="button"
          aria-label="Close Launchpad"
          className="group/launcher-close flex h-10 w-10 shrink-0 touch-manipulation items-center justify-center rounded-full text-muted-foreground transition-[background-color,color,box-shadow,transform] duration-150 hover:bg-foreground/[0.045] hover:text-foreground hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.58)] active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
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
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/48"
        />
        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded-[5px] bg-background/72 px-1.5 py-1 font-mono text-[0.56rem] leading-none text-muted-foreground/58 shadow-[inset_0_0_0_1px_rgba(80,72,61,0.08),inset_0_1px_0_rgba(255,255,255,0.72)]">
          ⌘K
        </span>
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Search or open..."
          className="h-12 w-full rounded-[7px] border border-transparent bg-foreground/[0.032] pl-9 pr-16 font-mono text-[0.92rem] text-foreground outline-none placeholder:text-muted-foreground/52 shadow-[inset_0_1px_0_rgba(255,255,255,0.48)] transition-[background-color,border-color,box-shadow] duration-150 focus:border-[color-mix(in_srgb,var(--contact-email-accent)_18%,transparent)] focus:bg-background/58 focus:shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_0_0_3px_color-mix(in_srgb,var(--contact-email-accent-soft)_56%,transparent)]"
          aria-label="Search Launchpad commands"
        />
      </div>
      <div className="mt-2 flex gap-1 overflow-x-auto px-0.5 pb-0.5 [scrollbar-width:none]">
        <span className="shrink-0 rounded-full bg-foreground/[0.045] px-2.5 py-1 font-mono text-[0.58rem] leading-none text-muted-foreground/68">
          {commandCount} commands
        </span>
        {commandSections.map((section) => (
          <span
            key={`chip-${section.id}`}
            className="shrink-0 rounded-full bg-background/58 px-2.5 py-1 font-mono text-[0.58rem] leading-none text-muted-foreground/62 shadow-[inset_0_0_0_1px_rgba(80,72,61,0.06),inset_0_1px_0_rgba(255,255,255,0.62)]"
          >
            {section.label}
            <span className="ml-1 text-muted-foreground/42">{section.commands.length}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
