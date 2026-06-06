export const LIQUID_TABS = ['Overview', 'Features', 'Pricing', 'About'] as const
export const LIQUID_TAB_VARIANTS = ['pill', 'underline'] as const

export type LiquidTab = (typeof LIQUID_TABS)[number]
export type LiquidTabVariant = (typeof LIQUID_TAB_VARIANTS)[number]

export interface LiquidTabIndicatorGeometry {
  left: number
  width: number
}

export interface LiquidTabRect {
  left: number
  width: number
}

export interface LiquidTabElementLike {
  getBoundingClientRect: () => LiquidTabRect
}

export interface LiquidTabContainerLike extends LiquidTabElementLike {
  children: ArrayLike<LiquidTabElementLike | undefined>
}

export interface LiquidTabIndicatorUpdateInput {
  activeIndex: number
  getContainer: () => LiquidTabContainerLike | null
  setIndicator: (geometry: LiquidTabIndicatorGeometry) => void
}

export const LIQUID_TAB_PANEL_CONTENT: Record<LiquidTab, string> = {
  Overview: 'A high-level look at what this product does and why it exists. Built for people who care about craft.',
  Features: 'Spring-based animations, positional DOM math, zero dependencies. Pure CSS transitions with a few lines of JS.',
  Pricing: 'Free and open source. No subscriptions, no paywalls, no analytics. Just the code.',
  About: 'A 15-minute challenge exploring liquid tab navigation — elastic springs, stretching pills, and smooth panel swaps.',
}

export const LIQUID_TAB_VARIANT_LABELS: Record<LiquidTabVariant, string> = {
  pill: 'Pill variant',
  underline: 'Underline variant',
}

const BASE_BUTTON_CLASS =
  'relative z-10 font-mono text-[12px] tracking-[0.04em] transition-colors duration-200'

const BUTTON_VARIANT_CLASSES: Record<LiquidTabVariant, string> = {
  pill: 'px-4 py-2',
  underline: 'px-4 py-2.5',
}

const INDICATOR_VARIANT_CLASSES: Record<LiquidTabVariant, string> = {
  pill: 'absolute bottom-1 top-1 bg-foreground/10 shadow-sm',
  underline: 'absolute bottom-0 h-[2px] bg-foreground',
}

const TRACK_VARIANT_CLASSES: Record<LiquidTabVariant, string> = {
  pill: 'relative flex gap-1 bg-muted/50 p-1',
  underline: 'relative flex gap-1 border-b border-border',
}

export const LIQUID_TAB_INDICATOR_TRANSITION =
  'transform 500ms var(--resize-ease), width var(--resize-dur) var(--resize-ease)'

export function getLiquidTabContent(tab: LiquidTab): string {
  return LIQUID_TAB_PANEL_CONTENT[tab]
}

export function getLiquidTabVariantLabel(variant: LiquidTabVariant): string {
  return LIQUID_TAB_VARIANT_LABELS[variant]
}

export function getLiquidTabButtonClassName(variant: LiquidTabVariant, isActive: boolean): string {
  return `${BASE_BUTTON_CLASS} ${BUTTON_VARIANT_CLASSES[variant]} ${
    isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground/70'
  }`
}

export function getLiquidTabIndicatorClassName(variant: LiquidTabVariant): string {
  return INDICATOR_VARIANT_CLASSES[variant]
}

export function getLiquidTabTrackClassName(variant: LiquidTabVariant): string {
  return TRACK_VARIANT_CLASSES[variant]
}

export function getLiquidTabPanelClassName(isActive: boolean): string {
  return `overflow-hidden transition-opacity duration-300 ${
    isActive ? 'relative h-auto opacity-100 visible' : 'absolute h-0 opacity-0 invisible'
  }`
}

export function getLiquidTabIndicatorStyle({ left, width }: LiquidTabIndicatorGeometry) {
  return {
    width,
    transform: `translateX(${left}px)`,
    transition: LIQUID_TAB_INDICATOR_TRANSITION,
  }
}

export function getLiquidTabIndicatorGeometry({
  buttonRect,
  containerRect,
}: {
  buttonRect: LiquidTabRect
  containerRect: LiquidTabRect
}): LiquidTabIndicatorGeometry {
  return {
    left: buttonRect.left - containerRect.left,
    width: buttonRect.width,
  }
}

export function updateLiquidTabIndicator({
  activeIndex,
  getContainer,
  setIndicator,
}: LiquidTabIndicatorUpdateInput): boolean {
  const container = getContainer()
  if (!container) {
    return false
  }

  const button = container.children[activeIndex]
  if (!button) {
    return false
  }

  setIndicator(getLiquidTabIndicatorGeometry({
    buttonRect: button.getBoundingClientRect(),
    containerRect: container.getBoundingClientRect(),
  }))

  return true
}
