import { cn } from '@/lib/utils'

type ChromePillSize = 'launchpad' | 'contact-primary' | 'contact-social'

const chromePillSizes: Record<ChromePillSize, string> = {
  launchpad: 'min-w-[8rem] gap-3 px-4 py-[0.48rem] text-[0.83rem]',
  'contact-primary': 'min-h-[36px] min-w-[7rem] gap-1.5 px-3.5 text-[0.76rem] sm:min-h-[38px] sm:px-4 sm:text-[0.8rem]',
  'contact-social': 'min-h-[36px] w-[5.85rem] gap-1 px-2 text-[0.68rem] sm:text-[0.72rem]',
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
  'relative z-10 min-w-0 truncate translate-y-[0.01rem] font-header tracking-[-0.025em] text-[#403d38] [text-shadow:0_1px_0_rgba(255,255,255,0.72)]'

export const chromePillIconClassName =
  'relative z-10 shrink-0 text-[#403d38] drop-shadow-[0_1px_0_rgba(255,255,255,0.7)] transition-transform duration-200 group-hover/chrome:translate-x-0.5 group-hover/chrome:-translate-y-[0.14rem]'

export const editorialImageFrameClassName =
  'relative mt-0.5 h-[60px] w-[60px] shrink-0 overflow-hidden rounded-[6px] bg-card/55 shadow-[0_2px_10px_rgba(15,23,42,0.04)] ring-1 ring-border/75 transition-[transform,box-shadow,filter,ring-color] duration-300 ease-soft group-hover:-translate-y-[1px] group-hover:ring-[var(--editorial-accent-border)] group-hover:shadow-[0_12px_28px_-18px_var(--editorial-accent-shadow)] group-active:translate-y-0 group-active:scale-[0.96] group-active:brightness-[0.98] sm:h-[84px] sm:w-[84px]'

export const editorialImageClassName =
  'object-cover transition-transform duration-500 ease-soft group-hover:scale-[1.018] group-active:scale-[1.01]'

export const logoFrameClassName =
  'relative inline-flex h-[1.35rem] w-[1.35rem] shrink-0 overflow-hidden rounded-[5px] bg-[#2e3440] shadow-[0_6px_18px_-12px_rgba(15,23,42,0.5),inset_0_0_0_1px_rgba(255,255,255,0.08)] ring-1 ring-border/45 transition-[transform,box-shadow,filter] duration-300 ease-soft group-hover:scale-[1.04] group-hover:shadow-[0_9px_24px_-14px_var(--editorial-accent-shadow),inset_0_0_0_1px_rgba(255,255,255,0.12)] group-active:scale-[0.98]'
