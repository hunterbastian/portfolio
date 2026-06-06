export const ERROR_BOUNDARY_TITLE = 'Something went wrong'
export const ERROR_BOUNDARY_DESCRIPTION = 'Please try again. If the issue persists, contact me.'
export const ERROR_BOUNDARY_RETRY_LABEL = 'Try again'
export const ERROR_BOUNDARY_HOME_LABEL = 'Go Home'
export const ERROR_BOUNDARY_HOME_HREF = '/'

export const ERROR_BOUNDARY_RETRY_CLASS =
  'min-h-[40px] origin-center touch-manipulation rounded bg-primary px-4 py-2 text-primary-foreground transition-transform duration-150 active:translate-y-0 active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'

export const ERROR_BOUNDARY_HOME_CLASS =
  'inline-flex min-h-[40px] origin-center touch-manipulation items-center rounded border px-4 py-2 transition-transform duration-150 active:translate-y-0 active:scale-[0.96]'

export const ERROR_BOUNDARY_LOG_LABEL = 'ErrorBoundary caught an error:'

export function getErrorBoundaryHomeAction() {
  return {
    href: ERROR_BOUNDARY_HOME_HREF,
    label: ERROR_BOUNDARY_HOME_LABEL,
  }
}

export function logErrorBoundaryError(
  error: unknown,
  logError: (label: string, error: unknown) => void = console.error,
) {
  logError(ERROR_BOUNDARY_LOG_LABEL, error)
}
