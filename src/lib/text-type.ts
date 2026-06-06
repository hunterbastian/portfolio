export interface TextTypeCompletionState {
  currentTextIndex: number
  displayText: string
  isDeleting: boolean
  loop: boolean
  texts: string[]
}

export interface TextTypeSpeedOptions {
  baseSpeed: number
  cinematic: boolean
  currentText: string
  currentTextIndex: number
  displayTextLength: number
  isDeleting: boolean
  nextLength: number
  random?: () => number
}

export interface TextTypeEffectActionOptions {
  cinematic: boolean
  currentTextIndex: number
  deletingSpeed: number
  displayText: string
  isDeleting: boolean
  loop: boolean
  pauseDuration: number
  random?: () => number
  reduceMotion: boolean
  texts: string[]
  typingSpeed: number
}

export type TextTypeEffectAction =
  | { kind: 'none' }
  | { kind: 'set-display'; text: string }
  | { kind: 'start-deleting-after-pause'; delay: number }
  | { kind: 'advance-index'; nextIndex: number }
  | { kind: 'set-display-after-step'; delay: number; text: string }

export interface TextTypeEffectActionActivationInput<TTimer> {
  action: TextTypeEffectAction
  schedule: (delay: number, callback: () => void) => TTimer
  setCurrentTextIndex: (index: number) => void
  setDisplayText: (text: string) => void
  setIsDeleting: (isDeleting: boolean) => void
}

export interface TextTypeCursorEffectActionOptions {
  completionBlinks: number
  hasStarted: boolean
  isComplete: boolean
  reduceMotion: boolean
  showCursor: boolean
}

export type TextTypeCursorEffectAction =
  | { kind: 'hide' }
  | { kind: 'show' }
  | { kind: 'idle-blink'; intervalMs: number }
  | { kind: 'completion-blink'; intervalMs: number; maxSteps: number }

export interface TextTypeCursorTimerRef<TTimer> {
  current: TTimer | null
}

export type TextTypeCursorVisibilitySetter = (value: boolean | ((previous: boolean) => boolean)) => void

export interface TextTypeCursorEffectActionActivationInput<TTimer> {
  action: TextTypeCursorEffectAction
  clearTimer: (timer: TTimer) => void
  scheduleInterval: (callback: () => void, intervalMs: number) => TTimer
  setCursorVisible: TextTypeCursorVisibilitySetter
  timerRef: TextTypeCursorTimerRef<TTimer>
}

export const TEXT_TYPE_DEFAULT_TYPING_SPEED = 65
export const TEXT_TYPE_DEFAULT_DELETING_SPEED = 40
export const TEXT_TYPE_DEFAULT_PAUSE_DURATION = 1500
export const TEXT_TYPE_DEFAULT_CURSOR_CHARACTER = '|'
export const TEXT_TYPE_DEFAULT_COMPLETION_BLINKS = 2
export const TEXT_TYPE_CURSOR_COMPLETION_BLINK_INTERVAL_MS = 220
export const TEXT_TYPE_CURSOR_IDLE_BLINK_INTERVAL_MS = 530

export function normalizeTextTypeEntries(text: string | string[]): string[] {
  return Array.isArray(text) ? text : [text]
}

export function isTextTypeComplete({
  currentTextIndex,
  displayText,
  isDeleting,
  loop,
  texts,
}: TextTypeCompletionState): boolean {
  return !loop && !isDeleting && currentTextIndex === texts.length - 1 && displayText === (texts.at(-1) ?? '')
}

export function getNextTextTypeIndex(currentTextIndex: number, textCount: number): number {
  return textCount > 0 ? (currentTextIndex + 1) % textCount : 0
}

export function getNextTextTypeSlice(currentText: string, displayTextLength: number, isDeleting: boolean): string {
  const nextLength = isDeleting ? displayTextLength - 1 : displayTextLength + 1

  return currentText.slice(0, nextLength)
}

export function getTextTypeStepSpeed({
  baseSpeed,
  cinematic,
  currentText,
  currentTextIndex,
  displayTextLength,
  isDeleting,
  nextLength,
  random = Math.random,
}: TextTypeSpeedOptions): number {
  if (!cinematic || isDeleting) {
    return baseSpeed
  }

  const nextChar = currentText[nextLength - 1] ?? ''
  const progress = currentText.length ? nextLength / currentText.length : 1
  const progressMultiplier = 1.08 - Math.min(progress, 0.9) * 0.24
  let speed = Math.max(22, Math.round(baseSpeed * progressMultiplier))

  if (/[,.!?;:]/.test(nextChar)) {
    speed += 90
  }

  if (nextChar === '\n') {
    speed += 240
  }

  if (displayTextLength === 0 && currentTextIndex === 0) {
    speed += 180
  }

  return speed + Math.floor(random() * 18) - 9
}

export function getTextTypeEffectAction({
  cinematic,
  currentTextIndex,
  deletingSpeed,
  displayText,
  isDeleting,
  loop,
  pauseDuration,
  random,
  reduceMotion,
  texts,
  typingSpeed,
}: TextTypeEffectActionOptions): TextTypeEffectAction {
  if (!texts.length) {
    return { kind: 'none' }
  }

  if (reduceMotion) {
    return { kind: 'set-display', text: texts[0] ?? '' }
  }

  const currentText = texts[currentTextIndex] ?? ''

  if (displayText === currentText && !isDeleting) {
    if (!loop && currentTextIndex === texts.length - 1) {
      return { kind: 'none' }
    }

    return { kind: 'start-deleting-after-pause', delay: pauseDuration }
  }

  if (displayText.length === 0 && isDeleting) {
    return { kind: 'advance-index', nextIndex: getNextTextTypeIndex(currentTextIndex, texts.length) }
  }

  const nextLength = isDeleting ? displayText.length - 1 : displayText.length + 1

  return {
    kind: 'set-display-after-step',
    delay: getTextTypeStepSpeed({
      baseSpeed: isDeleting ? deletingSpeed : typingSpeed,
      cinematic,
      currentText,
      currentTextIndex,
      displayTextLength: displayText.length,
      isDeleting,
      nextLength,
      random,
    }),
    text: getNextTextTypeSlice(currentText, displayText.length, isDeleting),
  }
}

export function activateTextTypeEffectAction<TTimer>({
  action,
  schedule,
  setCurrentTextIndex,
  setDisplayText,
  setIsDeleting,
}: TextTypeEffectActionActivationInput<TTimer>): TTimer[] {
  if (action.kind === 'set-display') {
    setDisplayText(action.text)
    return []
  }

  if (action.kind === 'start-deleting-after-pause') {
    return [schedule(action.delay, () => setIsDeleting(true))]
  }

  if (action.kind === 'advance-index') {
    setIsDeleting(false)
    setCurrentTextIndex(action.nextIndex)
    return []
  }

  if (action.kind === 'set-display-after-step') {
    return [schedule(action.delay, () => setDisplayText(action.text))]
  }

  return []
}

export function getTextTypeCursorEffectAction({
  completionBlinks,
  hasStarted,
  isComplete,
  reduceMotion,
  showCursor,
}: TextTypeCursorEffectActionOptions): TextTypeCursorEffectAction {
  if (!showCursor || !hasStarted) {
    return { kind: 'hide' }
  }

  if (isComplete) {
    if (reduceMotion || completionBlinks <= 0) {
      return { kind: 'hide' }
    }

    return {
      kind: 'completion-blink',
      intervalMs: TEXT_TYPE_CURSOR_COMPLETION_BLINK_INTERVAL_MS,
      maxSteps: completionBlinks * 2,
    }
  }

  if (reduceMotion) {
    return { kind: 'show' }
  }

  return {
    kind: 'idle-blink',
    intervalMs: TEXT_TYPE_CURSOR_IDLE_BLINK_INTERVAL_MS,
  }
}

export function clearTextTypeCursorTimer<TTimer>({
  clearTimer,
  timerRef,
}: Pick<TextTypeCursorEffectActionActivationInput<TTimer>, 'clearTimer' | 'timerRef'>): boolean {
  if (timerRef.current === null) {
    return false
  }

  clearTimer(timerRef.current)
  timerRef.current = null

  return true
}

export function activateTextTypeCursorEffectAction<TTimer>({
  action,
  clearTimer,
  scheduleInterval,
  setCursorVisible,
  timerRef,
}: TextTypeCursorEffectActionActivationInput<TTimer>): () => void {
  const clearActiveTimer = () => {
    clearTextTypeCursorTimer({ clearTimer, timerRef })
  }

  clearActiveTimer()

  if (action.kind === 'hide') {
    setCursorVisible(false)
    return clearActiveTimer
  }

  if (action.kind === 'show') {
    setCursorVisible(true)
    return clearActiveTimer
  }

  if (action.kind === 'completion-blink') {
    let stepCount = 0
    setCursorVisible(true)

    timerRef.current = scheduleInterval(() => {
      stepCount += 1

      if (stepCount >= action.maxSteps) {
        clearActiveTimer()
        setCursorVisible(false)
        return
      }

      setCursorVisible((previous) => !previous)
    }, action.intervalMs)

    return clearActiveTimer
  }

  timerRef.current = scheduleInterval(() => {
    setCursorVisible((previous) => !previous)
  }, action.intervalMs)

  return clearActiveTimer
}

export function getTextTypeClassName(className: string | undefined, cinematic: boolean): string {
  return `${className ?? ''}${cinematic ? ' text-type-cinematic' : ''}`
}

export function getTextTypeCursorClassName(cinematic: boolean): string {
  return `inline-block ml-1${cinematic ? ' text-type-cinematic-cursor' : ''}`
}

export function getTextTypeCursorStyle(cursorVisible: boolean) {
  return { opacity: cursorVisible ? 1 : 0 }
}

export function shouldRenderTextTypeCursor(showCursor: boolean, hasStarted: boolean): boolean {
  return showCursor && hasStarted
}
