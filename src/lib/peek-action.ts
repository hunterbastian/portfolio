import { cn } from './utils.ts'

export type PeekActionKind = 'button' | 'external-link' | 'internal-link'

export const PEEK_ACTION_BASE_CLASS =
  'group/peek relative inline-flex min-h-[40px] min-w-[40px] origin-center touch-manipulation items-center leading-none font-header transition-[color,transform] duration-150 hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary'

export const PEEK_TOOLTIP_BASE_CLASS =
  'pointer-events-none absolute bottom-full left-1/2 z-50 mb-1.5 hidden -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-[5px] border border-border/70 bg-background/92 px-2 py-1 font-mono text-[0.62rem] leading-none text-muted-foreground opacity-0 shadow-[0_8px_24px_-20px_rgba(15,23,42,0.35)] blur-[4px] transition-[opacity,transform,filter] duration-200 group-hover/peek:translate-y-0 group-hover/peek:opacity-100 group-hover/peek:blur-0 group-focus-visible/peek:translate-y-0 group-focus-visible/peek:opacity-100 group-focus-visible/peek:blur-0 sm:block'

export function getPeekActionKind(href: string | undefined, external: boolean): PeekActionKind {
  if (!href) return 'button'

  return external ? 'external-link' : 'internal-link'
}

export function getPeekActionClassName(className?: string): string {
  return cn(PEEK_ACTION_BASE_CLASS, className)
}

export function getPeekTooltipClassName(className?: string): string {
  return cn(PEEK_TOOLTIP_BASE_CLASS, className)
}

export function shouldRenderPeekTooltip(peek: unknown): boolean {
  return Boolean(peek)
}
