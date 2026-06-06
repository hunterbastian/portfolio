'use client'

import type { MutableRefObject } from 'react'
import type { LauncherCommandSection } from '@/lib/launcher'
import type { LauncherCommand } from '@/components/launcher/types'

interface LauncherCommandListProps {
  activeIndex: number
  commandButtonRefs: MutableRefObject<Array<HTMLButtonElement | null>>
  commandSections: Array<LauncherCommandSection<LauncherCommand>>
  commandCount: number
  onActivate: (index: number) => void
  onRunCommand: (command: LauncherCommand) => void
}

function LauncherCommandFooter() {
  return (
    <div className="flex items-center justify-between border-t border-border/45 bg-background/40 px-3 py-2.5 font-mono text-[0.56rem] text-muted-foreground/48 backdrop-blur-xl">
      <span className="inline-flex items-center gap-1.5">
        <kbd className="rounded-[4px] bg-background/62 px-1 py-0.5 text-[0.54rem] leading-none text-muted-foreground/58 shadow-[inset_0_0_0_1px_rgba(80,72,61,0.08)]">↑↓</kbd>
        <span>move</span>
      </span>
      <span className="inline-flex items-center gap-1.5">
        <kbd className="rounded-[4px] bg-background/62 px-1 py-0.5 text-[0.54rem] leading-none text-muted-foreground/58 shadow-[inset_0_0_0_1px_rgba(80,72,61,0.08)]">return</kbd>
        <span>open</span>
      </span>
      <span className="inline-flex items-center gap-1.5">
        <kbd className="rounded-[4px] bg-background/62 px-1 py-0.5 text-[0.54rem] leading-none text-muted-foreground/58 shadow-[inset_0_0_0_1px_rgba(80,72,61,0.08)]">esc</kbd>
        <span>close</span>
      </span>
    </div>
  )
}

export function LauncherCommandList({
  activeIndex,
  commandButtonRefs,
  commandSections,
  commandCount,
  onActivate,
  onRunCommand,
}: LauncherCommandListProps) {
  let renderedCommandIndex = 0

  return (
    <>
      <div
        className="min-h-0 flex-1 overflow-y-auto px-2 py-2.5 sm:max-h-[26rem]"
        role="listbox"
        aria-label="Launchpad commands"
      >
        {commandCount > 0 ? (
          <div className="space-y-3">
            {commandSections.map((section) => (
              <section key={section.id} aria-label={section.label} className="space-y-1.5">
                <div className="flex items-center justify-between px-2 pt-1 font-mono text-[0.56rem] uppercase leading-none tracking-[0.12em] text-muted-foreground/46">
                  <span>{section.label}</span>
                  <span className="tracking-normal text-muted-foreground/34">{section.commands.length}</span>
                </div>
                <div className="space-y-0.5">
                  {section.commands.map((command) => {
                    const rowIndex = renderedCommandIndex
                    renderedCommandIndex += 1
                    const active = rowIndex === activeIndex
                    const Icon = command.icon

                    return (
                      <button
                        key={`${section.id}-${command.id}`}
                        ref={(element) => {
                          commandButtonRefs.current[rowIndex] = element
                        }}
                        type="button"
                        role="option"
                        aria-selected={active}
                        className={`group/launcher-command relative flex min-h-[52px] w-full origin-center touch-manipulation items-center justify-between gap-3 overflow-hidden rounded-[8px] px-3 py-2.5 text-left transition-[background-color,box-shadow,color,transform,filter] duration-150 active:translate-y-0 active:scale-[0.97] ${
                          active
                            ? 'bg-[color-mix(in_srgb,var(--background)_76%,#fff8ed)] text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.82),inset_0_0_0_1px_rgba(80,72,61,0.07),0_12px_26px_-24px_rgba(43,39,34,0.58)]'
                            : 'text-foreground hover:bg-foreground/[0.032] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.46)]'
                        }`}
                        onMouseEnter={() => onActivate(rowIndex)}
                        onClick={() => onRunCommand(command)}
                      >
                        <span
                          aria-hidden="true"
                          className={`absolute bottom-2 left-1 top-2 w-[3px] rounded-full transition-[opacity,background-color,transform] duration-150 ${
                            active
                              ? 'scale-y-100 bg-[color-mix(in_srgb,var(--contact-email-accent)_70%,var(--foreground))] opacity-70'
                              : 'scale-y-50 bg-transparent opacity-0'
                          }`}
                        />
                        <span className="flex min-w-0 items-center gap-2.5">
                          <span
                            aria-hidden="true"
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[7px] text-muted-foreground transition-[color,background-color,box-shadow,transform] duration-150 group-hover/launcher-command:-translate-y-[1px] ${
                              active
                                ? 'bg-[color-mix(in_srgb,var(--contact-email-accent-soft)_64%,var(--background))] text-[color-mix(in_srgb,var(--contact-email-accent)_70%,var(--foreground))] shadow-[inset_0_1px_0_rgba(255,255,255,0.74),inset_0_0_0_1px_rgba(80,72,61,0.06)]'
                                : 'bg-background/48 shadow-[inset_0_0_0_1px_rgba(80,72,61,0.06)]'
                            }`}
                          >
                            <Icon size={12} />
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate font-header text-[0.94rem] leading-tight tracking-[-0.02em] text-foreground">
                              {command.label}
                            </span>
                            <span className="block truncate font-mono text-[0.7rem] leading-snug text-muted-foreground/82">
                              {command.hint}
                            </span>
                          </span>
                        </span>
                        <span className="shrink-0 rounded-full bg-background/60 px-2 py-1 font-mono text-[0.56rem] leading-none text-muted-foreground/60 shadow-[inset_0_0_0_1px_rgba(80,72,61,0.06)]">
                          {command.keys ?? command.kind}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <p className="px-3 py-5 text-center font-mono text-[0.78rem] text-muted-foreground">
            Nothing here yet.
          </p>
        )}
      </div>

      <LauncherCommandFooter />
    </>
  )
}
