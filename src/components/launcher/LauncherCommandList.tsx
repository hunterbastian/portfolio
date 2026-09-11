'use client'

import type { MutableRefObject } from 'react'
import type { LauncherCommand } from '@/components/launcher/types'
import { LAUNCHER_COMMAND_LIST_ARIA_LABEL, type LauncherCommandSection } from '@/lib/launcher'

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
    <div className="flex items-center justify-between border-t border-[#373737] bg-[#252525] px-3 py-2.5 font-mono text-[0.56rem] text-muted-foreground/58">
      <span className="inline-flex items-center gap-1.5">
        <kbd className="rounded-[4px] border border-[#373737] bg-[#202020] px-1 py-0.5 text-[0.54rem] leading-none text-muted-foreground/64">↑↓</kbd>
        <span>move</span>
      </span>
      <span className="inline-flex items-center gap-1.5">
        <kbd className="rounded-[4px] border border-[#373737] bg-[#202020] px-1 py-0.5 text-[0.54rem] leading-none text-muted-foreground/64">return</kbd>
        <span>open</span>
      </span>
      <span className="inline-flex items-center gap-1.5">
        <kbd className="rounded-[4px] border border-[#373737] bg-[#202020] px-1 py-0.5 text-[0.54rem] leading-none text-muted-foreground/64">esc</kbd>
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
        aria-label={LAUNCHER_COMMAND_LIST_ARIA_LABEL}
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
                        className={`group/launcher-command relative flex min-h-[48px] w-full origin-center touch-manipulation items-center justify-between gap-3 overflow-hidden rounded-[7px] border border-transparent px-3 py-2 text-left transition-[background-color,border-color,color,transform,filter] duration-150 active:translate-y-0 active:scale-[0.97] ${
                          active
                            ? 'border-[#373737] bg-[#2f2f2f] text-foreground'
                            : 'text-foreground hover:border-[#373737] hover:bg-[#2f2f2f]'
                        }`}
                        onMouseEnter={() => onActivate(rowIndex)}
                        onClick={() => onRunCommand(command)}
                      >
                        <span
                          aria-hidden="true"
                          className={`absolute bottom-2 left-1 top-2 w-[3px] rounded-full transition-[opacity,background-color,transform] duration-150 ${
                            active
                              ? 'scale-y-100 bg-foreground/88 opacity-70'
                              : 'scale-y-50 bg-transparent opacity-0'
                          }`}
                        />
                        <span className="flex min-w-0 items-center gap-2.5">
                          <span
                            aria-hidden="true"
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] border border-[#373737] text-muted-foreground transition-[color,background-color,transform] duration-150 group-hover/launcher-command:-translate-y-[1px] ${
                              active
                                ? 'bg-[#202020] text-foreground'
                                : 'bg-[#252525]'
                            }`}
                          >
                            <Icon size={11} />
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate font-header text-[0.875rem] leading-tight tracking-[-0.02em] text-foreground">
                              {command.label}
                            </span>
                            <span className="block truncate font-mono text-[0.66rem] leading-snug text-muted-foreground/82">
                              {command.hint}
                            </span>
                          </span>
                        </span>
                        <span className="shrink-0 rounded-[999px] border border-[#373737] bg-[#202020] px-2 py-1 font-mono text-[0.56rem] leading-none text-muted-foreground/68">
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
