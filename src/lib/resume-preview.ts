export const RESUME_PREVIEW_WIDTH = 170
export const RESUME_PREVIEW_HEIGHT = 220
export const RESUME_PREVIEW_VIEWPORT_PADDING = 12
export const RESUME_PREVIEW_ANCHOR_OFFSET_Y = 8
export const RESUME_PREVIEW_FOOTER_TEXT = 'Click to view full resume'

export const RESUME_PREVIEW_HEADER = {
  name: 'Hunter Bastian',
  subtitle: 'Resume Preview',
} as const

export interface ResumePreviewSkillChip {
  className: string
  label: string
}

export interface ResumePreviewPlaceholderSection {
  headingClassName: string
  lineClassNames?: string[]
  skillChips?: ResumePreviewSkillChip[]
}

export const RESUME_PREVIEW_PLACEHOLDER_SECTIONS: ResumePreviewPlaceholderSection[] = [
  {
    headingClassName: 'h-1 w-3/4 bg-gray-800',
    lineClassNames: ['h-0.5 w-full bg-gray-400', 'h-0.5 w-5/6 bg-gray-400'],
  },
  {
    headingClassName: 'h-0.5 w-1/2 bg-gray-600',
    lineClassNames: ['h-0.5 w-full bg-gray-300', 'h-0.5 w-4/5 bg-gray-300', 'h-0.5 w-3/4 bg-gray-300'],
  },
  {
    headingClassName: 'h-0.5 w-1/3 bg-gray-600',
    skillChips: [
      { className: 'flex h-3 w-6 items-center justify-center bg-blue-200 text-[4px]', label: 'JS' },
      { className: 'flex h-3 w-8 items-center justify-center bg-green-200 text-[4px]', label: 'React' },
      { className: 'flex h-3 w-6 items-center justify-center bg-purple-200 text-[4px]', label: 'TS' },
    ],
  },
  {
    headingClassName: 'h-0.5 w-2/5 bg-gray-600',
    lineClassNames: ['h-0.5 w-4/5 bg-gray-300', 'h-0.5 w-3/5 bg-gray-300'],
  },
  {
    headingClassName: 'h-0.5 w-1/4 bg-gray-600',
    lineClassNames: ['h-0.5 w-2/3 bg-gray-300'],
  },
]

export interface ResumePreviewAnchorRect {
  bottom: number
  left: number
  width: number
}

export interface ResumePreviewPosition {
  left: number
  top: number
}

export interface ResumePreviewRenderModeInput {
  hasAnchor: boolean
  mounted: boolean
}

export interface ResumePreviewPositionUpdateInput {
  getAnchorRect: () => ResumePreviewAnchorRect | null | undefined
  setPosition: (position: ResumePreviewPosition) => void
  viewportWidth: number
}

export type ResumePreviewPositionEventType = 'resize' | 'scroll'
export type ResumePreviewPositionEventListener = () => void

export interface ResumePreviewEventListenerSource {
  addEventListener: (
    type: ResumePreviewPositionEventType,
    listener: ResumePreviewPositionEventListener,
    options?: AddEventListenerOptions,
  ) => void
  removeEventListener: (
    type: ResumePreviewPositionEventType,
    listener: ResumePreviewPositionEventListener,
    options?: EventListenerOptions,
  ) => void
}

export interface ResumePreviewPositionTrackingInput extends ResumePreviewEventListenerSource {
  getAnchorRect: () => ResumePreviewAnchorRect | null | undefined
  getViewportWidth: () => number
  isVisible: boolean
  setPosition: (position: ResumePreviewPosition) => void
}

export type ResumePreviewRenderMode = 'portal' | 'inline'

export const RESUME_PREVIEW_RESIZE_EVENT = 'resize'
export const RESUME_PREVIEW_SCROLL_EVENT = 'scroll'
export const RESUME_PREVIEW_SCROLL_LISTENER_OPTIONS = { capture: true, passive: true } as const
export const RESUME_PREVIEW_SCROLL_REMOVE_OPTIONS = { capture: true } as const

export const RESUME_PREVIEW_MOTION = {
  initial: {
    opacity: 0,
    y: -7,
    scale: 0.96,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  exit: {
    opacity: 0,
    y: -5,
    scale: 0.98,
  },
} as const

export const RESUME_PREVIEW_TRANSITION = {
  y: { type: 'spring', stiffness: 320, damping: 28, mass: 0.9 },
  scale: { type: 'spring', stiffness: 360, damping: 30, mass: 0.9 },
  opacity: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
} as const

export function getResumePreviewPosition({
  anchorRect,
  previewWidth = RESUME_PREVIEW_WIDTH,
  viewportPadding = RESUME_PREVIEW_VIEWPORT_PADDING,
  viewportWidth,
}: {
  anchorRect: ResumePreviewAnchorRect
  previewWidth?: number
  viewportPadding?: number
  viewportWidth: number
}): ResumePreviewPosition {
  const centeredLeft = anchorRect.left + anchorRect.width / 2
  const minLeft = viewportPadding + previewWidth / 2
  const maxLeft = viewportWidth - viewportPadding - previewWidth / 2

  return {
    left: Math.min(maxLeft, Math.max(minLeft, centeredLeft)),
    top: anchorRect.bottom + RESUME_PREVIEW_ANCHOR_OFFSET_Y,
  }
}

export function getResumePreviewActivePosition({
  anchorRect,
  fallbackPosition,
  viewportWidth,
}: {
  anchorRect?: ResumePreviewAnchorRect | null
  fallbackPosition: ResumePreviewPosition
  viewportWidth: number
}) {
  return anchorRect
    ? getResumePreviewPosition({ anchorRect, viewportWidth })
    : fallbackPosition
}

export function updateResumePreviewPosition({
  getAnchorRect,
  setPosition,
  viewportWidth,
}: ResumePreviewPositionUpdateInput): boolean {
  const anchorRect = getAnchorRect()
  if (!anchorRect) {
    return false
  }

  setPosition(getResumePreviewPosition({ anchorRect, viewportWidth }))
  return true
}

export function activateResumePreviewPositionTracking({
  addEventListener,
  getAnchorRect,
  getViewportWidth,
  isVisible,
  removeEventListener,
  setPosition,
}: ResumePreviewPositionTrackingInput): (() => void) | undefined {
  if (!isVisible) {
    return undefined
  }

  const updatePosition = () =>
    updateResumePreviewPosition({
      getAnchorRect,
      setPosition,
      viewportWidth: getViewportWidth(),
    })

  if (!updatePosition()) {
    return undefined
  }

  addEventListener(RESUME_PREVIEW_RESIZE_EVENT, updatePosition)
  addEventListener(RESUME_PREVIEW_SCROLL_EVENT, updatePosition, RESUME_PREVIEW_SCROLL_LISTENER_OPTIONS)

  return () => {
    removeEventListener(RESUME_PREVIEW_RESIZE_EVENT, updatePosition)
    removeEventListener(RESUME_PREVIEW_SCROLL_EVENT, updatePosition, RESUME_PREVIEW_SCROLL_REMOVE_OPTIONS)
  }
}

export function getResumePreviewRenderMode({
  hasAnchor,
  mounted,
}: ResumePreviewRenderModeInput): ResumePreviewRenderMode {
  return mounted && hasAnchor ? 'portal' : 'inline'
}
