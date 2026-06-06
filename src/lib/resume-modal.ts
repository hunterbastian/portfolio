export const RESUME_MODAL_COPY = {
  dialogLabel: 'Resume',
  closeToast: 'Resume closed',
  downloadToast: 'Downloading resume',
  breadcrumbParent: 'Home',
  breadcrumbCurrent: 'Resume',
  title: 'Resume',
  downloadLabel: 'Download PDF',
  iframeTitle: 'Hunter Bastian Resume',
  keyboardShortcut: 'Esc',
  keyboardHintPrefix: 'Press',
  keyboardHintSuffix: 'to close',
} as const

export const RESUME_MODAL_FILE_HREF = '/api/resume/file'
export const RESUME_MODAL_DOWNLOAD_HREF = `${RESUME_MODAL_FILE_HREF}?download=1`

export const RESUME_MODAL_VIEW_ACTION = 'view'
export const RESUME_MODAL_DOWNLOAD_ACTION = 'download'
export const RESUME_MODAL_HAPTIC_STYLE = 'light'

export const RESUME_MODAL_OVERLAY_MOTION = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
} as const

export const RESUME_MODAL_OVERLAY_TRANSITION = {
  duration: 0.18,
  ease: 'easeOut',
} as const

export const RESUME_MODAL_CONTENT_MOTION = {
  initial: { opacity: 0, y: 8, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 8, scale: 0.98 },
} as const

export const RESUME_MODAL_CONTENT_TRANSITION = {
  duration: 0.22,
  ease: [0.16, 1, 0.3, 1],
} as const

export const RESUME_MODAL_META_ITEMS = [
  { label: 'File', value: 'PDF available' },
  { label: 'Access', value: 'Public' },
  { label: 'Close', value: 'Esc anytime' },
  { label: 'Download', value: 'You choose' },
] as const

export interface ResumeModalCloseActivationInput {
  closeModal: () => void
  showToast: (message: string) => void
  triggerHaptic: (style: typeof RESUME_MODAL_HAPTIC_STYLE) => void
}

export interface ResumeModalDownloadActivationInput {
  showToast: (message: string) => void
  trackResumeAction: (action: typeof RESUME_MODAL_DOWNLOAD_ACTION) => void
  triggerHaptic: (style: typeof RESUME_MODAL_HAPTIC_STYLE) => void
}

export interface ResumeModalViewActivationInput {
  isOpen: boolean
  trackResumeAction: (action: typeof RESUME_MODAL_VIEW_ACTION) => void
}

export function activateResumeModalClose({
  closeModal,
  showToast,
  triggerHaptic,
}: ResumeModalCloseActivationInput) {
  triggerHaptic(RESUME_MODAL_HAPTIC_STYLE)
  showToast(RESUME_MODAL_COPY.closeToast)
  closeModal()
}

export function activateResumeModalDownload({
  showToast,
  trackResumeAction,
  triggerHaptic,
}: ResumeModalDownloadActivationInput) {
  triggerHaptic(RESUME_MODAL_HAPTIC_STYLE)
  trackResumeAction(RESUME_MODAL_DOWNLOAD_ACTION)
  showToast(RESUME_MODAL_COPY.downloadToast)
}

export function activateResumeModalView({
  isOpen,
  trackResumeAction,
}: ResumeModalViewActivationInput): boolean {
  if (!isOpen) {
    return false
  }

  trackResumeAction(RESUME_MODAL_VIEW_ACTION)

  return true
}

export function isResumeModalCloseKey(key: string) {
  return key === 'Escape'
}
