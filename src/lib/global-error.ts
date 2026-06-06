export const GLOBAL_ERROR_EYEBROW = 'Error'
export const GLOBAL_ERROR_TITLE = 'Something went wrong.'
export const GLOBAL_ERROR_DESCRIPTION = 'We hit an unexpected error. You can try again or return home.'
export const GLOBAL_ERROR_RETRY_LABEL = 'Try again'
export const GLOBAL_ERROR_HOME_LABEL = 'Go Home'
export const GLOBAL_ERROR_HOME_HREF = '/'

export const GLOBAL_ERROR_RETRY_CLASS =
  'inline-flex min-h-[40px] origin-center touch-manipulation items-center font-mono text-[12px] tracking-[0.06em] text-foreground transition-[color,transform] duration-150 hover:text-muted-foreground active:translate-y-0 active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'

export const GLOBAL_ERROR_HOME_CLASS =
  'inline-flex min-h-[40px] origin-center touch-manipulation items-center text-xs tracking-[0.08em] uppercase text-muted-foreground transition-[color,transform] duration-150 hover:text-foreground active:translate-y-0 active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'

export const GLOBAL_ERROR_FONT_STYLE = { fontFamily: 'inherit' } as const

export const GLOBAL_ERROR_LOG_LABEL = 'Global error:'

export function getGlobalErrorHomeAction() {
  return {
    href: GLOBAL_ERROR_HOME_HREF,
    label: GLOBAL_ERROR_HOME_LABEL,
  }
}

export function logGlobalError(error: Error, logError: (label: string, error: Error) => void = console.error) {
  logError(GLOBAL_ERROR_LOG_LABEL, error)
}
