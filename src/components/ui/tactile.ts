import { cn } from '@/lib/utils'

type ChromePillSize = 'launchpad' | 'contact-primary' | 'contact-social'

const chromePillSizes: Record<ChromePillSize, string> = {
  launchpad: 'min-w-[8rem] gap-3 px-4 py-[0.48rem] text-[0.83rem]',
  'contact-primary': 'min-h-[44px] min-w-[7rem] gap-1.5 px-3.5 text-[0.76rem] sm:min-h-[38px] sm:px-4 sm:text-[0.8rem]',
  'contact-social': 'min-h-[44px] w-[5.85rem] gap-1 px-2 text-[0.68rem] sm:min-h-[36px] sm:text-[0.72rem]',
}

export function chromePillClassName({
  size = 'contact-primary',
  className,
}: {
  size?: ChromePillSize
  className?: string
} = {}) {
  return cn(
    'chrome-pill group/chrome relative isolate inline-flex origin-center touch-manipulation items-center justify-center overflow-hidden rounded-full leading-none text-[#403d38] transition-[filter,transform] duration-200 active:translate-y-0 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary',
    chromePillSizes[size],
    className,
  )
}

export const chromePillLabelClassName =
  'chrome-pill-label relative z-10 min-w-0 truncate translate-y-[0.01rem] font-header tracking-[-0.025em] text-[#403d38] [text-shadow:0_1px_0_rgba(255,255,255,0.72)]'

export const chromePillIconClassName =
  'chrome-pill-icon relative z-10 shrink-0 text-[#403d38] drop-shadow-[0_1px_0_rgba(255,255,255,0.7)] transition-transform duration-200 group-hover/chrome:translate-x-0.5 group-hover/chrome:-translate-y-[0.14rem]'

export const chromePillContactAccentClassName = 'chrome-pill-contact-accent'

export const editorialImageFrameClassName =
  'relative mt-0.5 h-[44px] w-[44px] shrink-0 overflow-visible rounded-[7px] bg-transparent transition-[transform,filter] duration-300 ease-soft group-hover:-translate-y-[2px] group-hover:scale-[1.018] group-active:translate-y-0 group-active:scale-[0.96] group-active:brightness-[0.98] sm:h-[62px] sm:w-[62px] sm:rounded-[8px]'

export const editorialImageClassName =
  'object-contain drop-shadow-[0_10px_14px_rgba(15,23,42,0.055)] transition-[filter,transform] duration-500 ease-soft group-hover:scale-[1.035] group-hover:drop-shadow-[0_14px_18px_var(--editorial-accent-shadow)] group-hover:saturate-[1.05] group-hover:contrast-[1.02] group-active:scale-[1.01]'

export const logoFrameClassName =
  'relative inline-flex h-[1.25rem] w-[1.25rem] shrink-0 overflow-hidden rounded-[5px] bg-[#2e3440] shadow-[0_6px_18px_-12px_rgba(15,23,42,0.5),inset_0_0_0_1px_rgba(255,255,255,0.08)] ring-1 ring-border/45 transition-[transform,box-shadow,filter] duration-300 ease-soft group-hover:scale-[1.04] group-hover:shadow-[0_9px_24px_-14px_var(--editorial-accent-shadow),inset_0_0_0_1px_rgba(255,255,255,0.12)] group-active:scale-[0.98]'
