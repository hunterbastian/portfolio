export const LIVE_DEMO_FALLBACK_LINK_LABEL = 'Open in new tab'
export const LIVE_DEMO_LOAD_BUTTON_LABEL = 'Load interactive demo'
export const LIVE_DEMO_DEFAULT_ASPECT_RATIO = '16/9'
export const LIVE_DEMO_PANEL_DURATION_MS = 600

export const LIVE_DEMO_PANEL_ENTER_STATE = { opacity: 1, y: 0 } as const
export const LIVE_DEMO_PANEL_EXIT_STATE = { opacity: 0, y: 16 } as const

export function getLiveDemoLoadAriaLabel(title: string) {
  return `Load ${title} demo`
}

export function getLiveDemoPanelAnimationState(isInView: boolean) {
  return isInView ? LIVE_DEMO_PANEL_ENTER_STATE : LIVE_DEMO_PANEL_EXIT_STATE
}
