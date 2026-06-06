export interface DesignDecisionOption {
  label: string
  description: string
}

export const DESIGN_DECISION_PANEL_DURATION_MS = 500
export const DESIGN_DECISION_DESCRIPTION_DURATION_MS = 250
export const DESIGN_DECISION_PANEL_INITIAL_STATE = { opacity: 0, y: 12 } as const
export const DESIGN_DECISION_PANEL_VISIBLE_STATE = { opacity: 1, y: 0 } as const
export const DESIGN_DECISION_DESCRIPTION_INITIAL_STATE = { opacity: 0, y: 4 } as const
export const DESIGN_DECISION_DESCRIPTION_VISIBLE_STATE = { opacity: 1, y: 0 } as const
export const DESIGN_DECISION_DESCRIPTION_EXIT_STATE = { opacity: 0, y: -4 } as const

export const DESIGN_DECISION_OPTION_BUTTON_BASE_CLASS =
  'relative flex items-center gap-1.5 px-3 py-2 font-mono text-[12px] tracking-[0.04em] transition-[color,background-color,border-color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50'
export const DESIGN_DECISION_OPTION_BUTTON_ACTIVE_CLASS =
  'bg-foreground/10 text-foreground border border-foreground/20'
export const DESIGN_DECISION_OPTION_BUTTON_INACTIVE_CLASS =
  'bg-transparent text-muted-foreground border border-border hover:text-foreground/70 hover:border-foreground/10'

export function parseDesignDecisionOptions(
  input: DesignDecisionOption[] | string,
): DesignDecisionOption[] {
  if (Array.isArray(input)) return input

  try {
    return JSON.parse(input) as DesignDecisionOption[]
  } catch {
    return []
  }
}

export function getDesignDecisionPanelAnimationState(isInView: boolean) {
  return isInView ? DESIGN_DECISION_PANEL_VISIBLE_STATE : DESIGN_DECISION_PANEL_INITIAL_STATE
}

export function getDesignDecisionOptionButtonClassName(isActive: boolean): string {
  const stateClass = isActive
    ? DESIGN_DECISION_OPTION_BUTTON_ACTIVE_CLASS
    : DESIGN_DECISION_OPTION_BUTTON_INACTIVE_CLASS

  return `${DESIGN_DECISION_OPTION_BUTTON_BASE_CLASS} ${stateClass}`
}

export function shouldShowDesignDecisionChosenIndicator(activeIndex: number, chosen: number): boolean {
  return activeIndex === chosen
}
