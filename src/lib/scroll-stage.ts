export const SCROLL_STAGE_DURATION_MS = 600
export const SCROLL_STAGE_STAGGER_MS = 120

export const SCROLL_STAGE_RULE_INITIAL_STATE = { opacity: 0, x: -8 } as const
export const SCROLL_STAGE_RULE_VISIBLE_STATE = { opacity: 1, x: 0 } as const
export const SCROLL_STAGE_TITLE_INITIAL_STATE = { opacity: 0, y: 12 } as const
export const SCROLL_STAGE_TITLE_VISIBLE_STATE = { opacity: 1, y: 0 } as const
export const SCROLL_STAGE_CONTENT_INITIAL_STATE = { opacity: 0, y: 16 } as const
export const SCROLL_STAGE_CONTENT_VISIBLE_STATE = { opacity: 1, y: 0 } as const

export function getScrollStageClassName(className?: string): string {
  return ['my-16 first:mt-0', className].filter(Boolean).join(' ')
}

export function getScrollStageRuleAnimationState(isInView: boolean) {
  return isInView ? SCROLL_STAGE_RULE_VISIBLE_STATE : SCROLL_STAGE_RULE_INITIAL_STATE
}

export function getScrollStageTitleAnimationState(isInView: boolean) {
  return isInView ? SCROLL_STAGE_TITLE_VISIBLE_STATE : SCROLL_STAGE_TITLE_INITIAL_STATE
}

export function getScrollStageContentAnimationState(isInView: boolean) {
  return isInView ? SCROLL_STAGE_CONTENT_VISIBLE_STATE : SCROLL_STAGE_CONTENT_INITIAL_STATE
}

export function getScrollStageTitleDelayMs(): number {
  return SCROLL_STAGE_STAGGER_MS
}

export function getScrollStageContentDelayMs(hasTitle: boolean): number {
  return hasTitle ? SCROLL_STAGE_STAGGER_MS * 2 : SCROLL_STAGE_STAGGER_MS
}
