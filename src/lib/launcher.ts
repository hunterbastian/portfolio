import { HOME_WORK_FILTER_EVENT } from './home-projects.ts'

export type LauncherSectionId = 'navigate' | 'work' | 'projects' | 'contact'

export const LAUNCHER_OPEN_EVENT = 'hb-open-launcher'
export const LAUNCHER_PRELOAD_EVENT = 'hb-preload-launcher'
export const LAUNCHER_WORK_FILTER_EVENT = HOME_WORK_FILTER_EVENT
export const LAUNCHER_WORK_FILTER_EVENT_DELAY_MS = 80
export const LAUNCHER_EMAIL_ADDRESS = 'hunterbastianux@gmail.com'
export const LAUNCHER_PROJECT_INQUIRY_SUBJECT = 'Project Inquiry'
export const LAUNCHER_EMAIL_COPIED_TOAST = 'Email copied'
export const LAUNCHER_EMAIL_OPEN_TOAST = 'Opening email'
export const LAUNCHER_PAGE_LINK_COPIED_TOAST = 'Page link copied'
export const LAUNCHER_PAGE_LINK_COPY_FAILED_TOAST = 'Could not copy link'
export const LAUNCHER_PROJECT_EMAIL_OPEN_TOAST = 'Opening project email'

export const LAUNCHER_SECTION_ORDER: LauncherSectionId[] = ['navigate', 'work', 'projects', 'contact']

export const LAUNCHER_SECTION_LABELS: Record<LauncherSectionId, string> = {
  navigate: 'Navigate',
  work: 'Work',
  projects: 'Projects',
  contact: 'Contact',
}

export const SUGGESTED_FALLBACK_COMMAND_IDS = ['home', 'projects', 'contact']
export const RECENT_COMMANDS_STORAGE_KEY = 'hb-launcher-recent-command-ids'
export const RECENT_COMMAND_LIMIT = 3
export const LAUNCHER_OPEN_TOAST = 'Launchpad opened'
export const LAUNCHER_TOAST_TIMEOUT_MS = 1800
export const EMPTY_SPACE_RIPPLE_DURATION_MS = 760
export const EMPTY_SPACE_RIPPLE_INTERACTIVE_SELECTOR =
  'a, button, input, textarea, select, summary, [role="button"], [role="link"], [role="dialog"], [data-ignore-empty-ripple]'

export type LauncherWorkFilter = 'all' | 'product' | 'visual' | 'web'

export const LAUNCHER_WORK_FILTERS: Array<{
  id: LauncherWorkFilter
  label: string
  hint: string
  toast: string
  keywords: string[]
}> = [
  {
    id: 'product',
    label: 'Product work',
    hint: 'Filter projects to UX, app, and interface work',
    toast: 'Filtering product work',
    keywords: ['ux', 'ui', 'app', 'mobile', 'interface', 'case study', 'hiring'],
  },
  {
    id: 'visual',
    label: 'Visual work',
    hint: 'Filter projects to graphic and image-led work',
    toast: 'Filtering visual work',
    keywords: ['visual', 'graphic', 'photography', 'studio alpine', 'brand', 'identity'],
  },
  {
    id: 'web',
    label: 'Web work',
    hint: 'Filter projects to websites and interactive pages',
    toast: 'Filtering web work',
    keywords: ['web', 'website', 'next', 'interactive', 'frontend'],
  },
  {
    id: 'all',
    label: 'All work',
    hint: 'Clear project filters',
    toast: 'Showing all work',
    keywords: ['clear', 'reset', 'all', 'everything'],
  },
]

export interface SearchableLauncherCommand {
  id: string
  label: string
  hint: string
  section: LauncherSectionId
  priority?: number
  keys?: string
  kind?: string
  keywords?: string[]
}

export interface LauncherProjectCommandSource {
  slug: string
  description: string
  category: string
  tags: string[]
  date: string
}

export interface LauncherProjectSource extends LauncherProjectCommandSource {
  title: string
}

export interface ProjectLauncherSourceInput {
  slug: string
  frontmatter: {
    title: string
    displayTitle?: string
    description: string
    category: string
    tags: string[]
    date: string
  }
}

export interface EmptySpaceRipple {
  id: number
  x: number
  y: number
}

export interface EmptySpaceRipplePointerInput {
  clientX: number
  clientY: number
}

export interface EmptySpaceRippleCreation {
  nextId: number
  ripple: EmptySpaceRipple
}

export interface EmptySpaceRippleTimerRegistry<TTimer> {
  current: Set<TTimer>
}

export interface EmptySpaceRippleRemovalScheduleInput<TTimer> {
  durationMs?: number
  rippleId: number
  scheduleTimer: (callback: () => void, delayMs: number) => TTimer
  setRipples: (updater: (currentRipples: EmptySpaceRipple[]) => EmptySpaceRipple[]) => void
  timerRegistry: EmptySpaceRippleTimerRegistry<TTimer>
}

export interface EmptySpaceRippleTimerCleanupInput<TTimer> {
  clearTimer: (timer: TTimer) => void
  timerRegistry: EmptySpaceRippleTimerRegistry<TTimer>
}

export interface LauncherToast {
  id: number
  message: string
}

export interface LauncherToastDetailSource {
  message?: string
}

export interface LauncherToastStateResult {
  nextId: number
  toast: LauncherToast | null
}

export interface LauncherTimerRef<TTimer> {
  current: TTimer | null
}

export interface LauncherToastDismissCancelInput<TTimer> {
  clearTimer: (timer: TTimer) => void
  timerRef: LauncherTimerRef<TTimer>
}

export interface LauncherToastDismissScheduleInput<TTimer> extends LauncherToastDismissCancelInput<TTimer> {
  scheduleTimer: (callback: () => void, delayMs: number) => TTimer
  setToast: (toast: LauncherToast | null) => void
  timeoutMs?: number
}

export interface LauncherRecentCommandStorage {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
}

export interface LauncherCommandSection<TCommand extends SearchableLauncherCommand> {
  id: LauncherSectionId | 'suggested'
  label: string
  commands: TCommand[]
}

export type GlobalLauncherKeyboardAction = 'toggle' | 'open'
export type LauncherActiveIndexDirection = 'next' | 'previous'
export type LauncherPaletteKeyboardAction =
  | {
      type: 'close' | 'run'
    }
  | {
      type: 'move'
      direction: LauncherActiveIndexDirection
    }
  | {
      type: 'prevent-default'
    }

interface LauncherTypingElement {
  tagName: string
  isContentEditable: boolean
}

type LauncherTypingElementConstructor = {
  new (): LauncherTypingElement
}

interface LauncherInteractiveElement {
  closest(selector: string): unknown
}

type LauncherInteractiveElementConstructor = {
  new (): LauncherInteractiveElement
}

export type LauncherAnalyticsTarget =
  | {
      type: 'external'
      href: string
      label: string
    }
  | {
      type: 'navigation'
      label: string
    }
  | {
      type: 'project'
      label: string
      slug: string
    }

export interface LauncherWorkFilterActivationInput<TTimer = unknown> {
  dispatchWorkFilterEvent: (filter: LauncherWorkFilter) => void
  filter: LauncherWorkFilter
  pushRoute: (target: string) => void
  schedule: (callback: () => void, delayMs: number) => TTimer
  showToast: (message: string) => void
  toastMessage: string
}

export interface LauncherCopyEmailActivationInput {
  copyText: (value: string) => Promise<void>
  emailAddress?: string
  navigateToHref: (href: string) => void
  showToast: (message: string) => void
}

export interface LauncherCopyPageLinkActivationInput {
  copyText: (value: string) => Promise<void>
  currentHref: string
  showToast: (message: string) => void
}

export interface LauncherDraftProjectEmailActivationInput {
  emailAddress?: string
  navigateToHref: (href: string) => void
  showToast: (message: string) => void
  subject?: string
}

export interface LauncherClosePaletteActivationInput {
  setPaletteOpen: (open: boolean) => void
  triggerHaptic: (style: 'light') => void
}

export interface LauncherOpenPaletteActivationInput {
  setPaletteOpen: (open: boolean) => void
  triggerHaptic: (style: 'light') => void
}

export interface LauncherGlobalKeyboardActionActivationInput {
  action: GlobalLauncherKeyboardAction
  setPaletteOpen: (open: boolean) => void
  togglePaletteOpen: () => void
  triggerHaptic: (style: 'light') => void
}

export interface LauncherOpenSignalActivationInput {
  openSignal: number
  setActiveIndex: (index: number) => void
  setPaletteOpen: (open: boolean) => void
  setQuery: (query: string) => void
  showToast: (message: string) => void
}

export interface LauncherRunnableCommand {
  id: string
  run: () => Promise<void> | void
}

export interface LauncherCommandRunActivationInput<TCommand extends LauncherRunnableCommand> {
  closePalette: () => void
  command: TCommand
  rememberCommand: (commandId: string) => void
  trackCommand: (command: TCommand) => void
  triggerHaptic: (style: 'light') => void
}

export interface LauncherPaletteFocusScheduleInput<TFrame = number> {
  cancelFrame: (frame: TFrame) => void
  focusInput: () => void
  requestFrame: (callback: () => void) => TFrame
}

export type LauncherCopyEmailActivationResult = 'copied' | 'opened-email'
export type LauncherCopyPageLinkActivationResult = 'copied' | 'copy-failed'

export function normalizeRecentCommandIds(value: unknown, limit = RECENT_COMMAND_LIMIT): string[] {
  if (!Array.isArray(value)) return []

  return value.filter((id): id is string => typeof id === 'string').slice(0, limit)
}

export function parseStoredRecentCommandIds(storedValue: string | null, limit = RECENT_COMMAND_LIMIT): string[] {
  if (!storedValue) return []

  try {
    return normalizeRecentCommandIds(JSON.parse(storedValue), limit)
  } catch {
    return []
  }
}

export function stringifyStoredRecentCommandIds(commandIds: string[], limit = RECENT_COMMAND_LIMIT): string {
  return JSON.stringify(normalizeRecentCommandIds(commandIds, limit))
}

export function getNextRecentCommandIds(commandId: string, currentCommandIds: string[], limit = RECENT_COMMAND_LIMIT) {
  return [commandId, ...currentCommandIds.filter((id) => id !== commandId)].slice(0, limit)
}

export function readStoredRecentCommandIds(
  storage: LauncherRecentCommandStorage,
  key = RECENT_COMMANDS_STORAGE_KEY,
): string[] {
  try {
    return parseStoredRecentCommandIds(storage.getItem(key))
  } catch {
    return []
  }
}

export function writeStoredRecentCommandIds(
  storage: LauncherRecentCommandStorage,
  commandIds: string[],
  key = RECENT_COMMANDS_STORAGE_KEY,
): void {
  try {
    storage.setItem(key, stringifyStoredRecentCommandIds(commandIds))
  } catch {
    // Storage can be unavailable in privacy modes or during quota failures.
  }
}

export function getNextLauncherToastState(
  currentId: number,
  detail: LauncherToastDetailSource | null | undefined,
): LauncherToastStateResult {
  if (!detail?.message) {
    return {
      nextId: currentId,
      toast: null,
    }
  }

  const nextId = currentId + 1

  return {
    nextId,
    toast: {
      id: nextId,
      message: detail.message,
    },
  }
}

export function cancelLauncherToastDismiss<TTimer>({
  clearTimer,
  timerRef,
}: LauncherToastDismissCancelInput<TTimer>): boolean {
  if (timerRef.current === null) return false

  clearTimer(timerRef.current)
  timerRef.current = null

  return true
}

export function scheduleLauncherToastDismiss<TTimer>({
  clearTimer,
  scheduleTimer,
  setToast,
  timerRef,
  timeoutMs = LAUNCHER_TOAST_TIMEOUT_MS,
}: LauncherToastDismissScheduleInput<TTimer>): TTimer {
  cancelLauncherToastDismiss({ clearTimer, timerRef })

  timerRef.current = scheduleTimer(() => {
    setToast(null)
    timerRef.current = null
  }, timeoutMs)

  return timerRef.current
}

export function commandMatchesQuery(command: SearchableLauncherCommand, query: string) {
  const searchable = [
    command.label,
    command.hint,
    command.kind,
    command.keys,
    ...(command.keywords ?? []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  return searchable.includes(query)
}

export function getMatchingLauncherCommands<TCommand extends SearchableLauncherCommand>(
  commands: TCommand[],
  query: string,
): TCommand[] {
  const normalizedQuery = query.trim().toLowerCase()

  return normalizedQuery
    ? commands.filter((command) => commandMatchesQuery(command, normalizedQuery))
    : commands
}

export function getVisibleCommandEntries<TCommand extends SearchableLauncherCommand>(
  commandSections: Array<LauncherCommandSection<TCommand>>,
) {
  return commandSections.flatMap((section) => section.commands.map((command) => ({ sectionId: section.id, command })))
}

export function getLauncherProjectCommandHint(project: Pick<LauncherProjectCommandSource, 'category' | 'tags'>) {
  return `${project.category} · ${project.tags.slice(0, 3).join(', ')}`
}

export function getLauncherProjectCommandKeywords(project: LauncherProjectCommandSource) {
  return [
    project.slug,
    project.category,
    project.description,
    new Date(project.date).getFullYear().toString(),
    ...project.tags,
  ]
}

export function getLauncherProjectSource(project: ProjectLauncherSourceInput): LauncherProjectSource {
  return {
    slug: project.slug,
    title: project.frontmatter.displayTitle || project.frontmatter.title,
    description: project.frontmatter.description,
    category: project.frontmatter.category,
    tags: project.frontmatter.tags,
    date: project.frontmatter.date,
  }
}

export function getLauncherProjectSources(projects: ProjectLauncherSourceInput[]): LauncherProjectSource[] {
  return projects.map(getLauncherProjectSource)
}

export function getLauncherWorkFilterTarget(filter: LauncherWorkFilter): string {
  return filter === 'all' ? '/#projects' : `/?work=${filter}#projects`
}

export function activateLauncherWorkFilter<TTimer = unknown>({
  dispatchWorkFilterEvent,
  filter,
  pushRoute,
  schedule,
  showToast,
  toastMessage,
}: LauncherWorkFilterActivationInput<TTimer>): TTimer {
  pushRoute(getLauncherWorkFilterTarget(filter))
  const timer = schedule(() => dispatchWorkFilterEvent(filter), LAUNCHER_WORK_FILTER_EVENT_DELAY_MS)
  showToast(toastMessage)

  return timer
}

export function getLauncherEmailHref(emailAddress = LAUNCHER_EMAIL_ADDRESS): string {
  return `mailto:${emailAddress}`
}

export function getLauncherProjectEmailHref(
  emailAddress = LAUNCHER_EMAIL_ADDRESS,
  subject = LAUNCHER_PROJECT_INQUIRY_SUBJECT,
): string {
  return `${getLauncherEmailHref(emailAddress)}?subject=${encodeURIComponent(subject)}`
}

export async function activateLauncherEmailCopy({
  copyText,
  emailAddress = LAUNCHER_EMAIL_ADDRESS,
  navigateToHref,
  showToast,
}: LauncherCopyEmailActivationInput): Promise<LauncherCopyEmailActivationResult> {
  try {
    await copyText(emailAddress)
    showToast(LAUNCHER_EMAIL_COPIED_TOAST)

    return 'copied'
  } catch {
    navigateToHref(getLauncherEmailHref(emailAddress))
    showToast(LAUNCHER_EMAIL_OPEN_TOAST)

    return 'opened-email'
  }
}

export async function activateLauncherPageLinkCopy({
  copyText,
  currentHref,
  showToast,
}: LauncherCopyPageLinkActivationInput): Promise<LauncherCopyPageLinkActivationResult> {
  try {
    await copyText(currentHref)
    showToast(LAUNCHER_PAGE_LINK_COPIED_TOAST)

    return 'copied'
  } catch {
    showToast(LAUNCHER_PAGE_LINK_COPY_FAILED_TOAST)

    return 'copy-failed'
  }
}

export function activateLauncherDraftProjectEmail({
  emailAddress = LAUNCHER_EMAIL_ADDRESS,
  navigateToHref,
  showToast,
  subject = LAUNCHER_PROJECT_INQUIRY_SUBJECT,
}: LauncherDraftProjectEmailActivationInput) {
  navigateToHref(getLauncherProjectEmailHref(emailAddress, subject))
  showToast(LAUNCHER_PROJECT_EMAIL_OPEN_TOAST)
}

export function activateLauncherClosePalette({
  setPaletteOpen,
  triggerHaptic,
}: LauncherClosePaletteActivationInput) {
  triggerHaptic('light')
  setPaletteOpen(false)
}

export function activateLauncherOpenPalette({
  setPaletteOpen,
  triggerHaptic,
}: LauncherOpenPaletteActivationInput) {
  triggerHaptic('light')
  setPaletteOpen(true)
}

export function activateLauncherGlobalKeyboardAction({
  action,
  setPaletteOpen,
  togglePaletteOpen,
  triggerHaptic,
}: LauncherGlobalKeyboardActionActivationInput) {
  triggerHaptic('light')

  if (action === 'toggle') {
    togglePaletteOpen()
    return
  }

  setPaletteOpen(true)
}

export function activateLauncherOpenSignal({
  openSignal,
  setActiveIndex,
  setPaletteOpen,
  setQuery,
  showToast,
}: LauncherOpenSignalActivationInput): boolean {
  if (openSignal <= 0) {
    return false
  }

  setPaletteOpen(true)
  setQuery('')
  setActiveIndex(0)
  showToast(LAUNCHER_OPEN_TOAST)

  return true
}

export async function activateLauncherCommandRun<TCommand extends LauncherRunnableCommand>({
  closePalette,
  command,
  rememberCommand,
  trackCommand,
  triggerHaptic,
}: LauncherCommandRunActivationInput<TCommand>) {
  triggerHaptic('light')
  rememberCommand(command.id)
  trackCommand(command)
  await command.run()
  closePalette()
}

export function scheduleLauncherPaletteFocus<TFrame = number>({
  cancelFrame,
  focusInput,
  requestFrame,
}: LauncherPaletteFocusScheduleInput<TFrame>) {
  let secondFrame: TFrame | null = null
  const firstFrame = requestFrame(() => {
    secondFrame = requestFrame(focusInput)
  })

  return () => {
    cancelFrame(firstFrame)
    if (secondFrame !== null) {
      cancelFrame(secondFrame)
    }
  }
}

export function getLauncherPageLabel(pathname: string) {
  if (pathname.startsWith('/projects/')) return 'Project Space'
  if (pathname.startsWith('/archive')) return 'Playground Space'
  if (pathname.startsWith('/cv')) return 'Resume Space'
  if (pathname.startsWith('/about')) return 'About Space'

  return 'Home Space'
}

export function canCreateEmptySpaceRipple({
  interactiveTarget,
  paletteOpen,
  prefersReducedMotion,
}: {
  interactiveTarget: boolean
  paletteOpen: boolean
  prefersReducedMotion: boolean
}) {
  return !prefersReducedMotion && !paletteOpen && !interactiveTarget
}

export function getNextEmptySpaceRipples(
  currentRipples: EmptySpaceRipple[],
  nextRipple: EmptySpaceRipple,
  limit = 6,
) {
  return [...currentRipples.slice(-(limit - 1)), nextRipple]
}

export function getNextEmptySpaceRipple(
  currentId: number,
  pointer: EmptySpaceRipplePointerInput,
): EmptySpaceRippleCreation {
  const nextId = currentId + 1

  return {
    nextId,
    ripple: {
      id: nextId,
      x: pointer.clientX,
      y: pointer.clientY,
    },
  }
}

export function removeEmptySpaceRipple(currentRipples: EmptySpaceRipple[], rippleId: number) {
  return currentRipples.filter((ripple) => ripple.id !== rippleId)
}

export function scheduleEmptySpaceRippleRemoval<TTimer>({
  durationMs = EMPTY_SPACE_RIPPLE_DURATION_MS,
  rippleId,
  scheduleTimer,
  setRipples,
  timerRegistry,
}: EmptySpaceRippleRemovalScheduleInput<TTimer>): TTimer {
  const timer = scheduleTimer(() => {
    timerRegistry.current.delete(timer)
    setRipples((current) => removeEmptySpaceRipple(current, rippleId))
  }, durationMs)
  timerRegistry.current.add(timer)

  return timer
}

export function cancelEmptySpaceRippleTimers<TTimer>({
  clearTimer,
  timerRegistry,
}: EmptySpaceRippleTimerCleanupInput<TTimer>): number {
  const timers = [...timerRegistry.current]

  timers.forEach(clearTimer)
  timerRegistry.current.clear()

  return timers.length
}

export function getGlobalLauncherKeyboardAction({
  ctrlKey,
  isTypingTarget,
  key,
  metaKey,
}: {
  ctrlKey: boolean
  isTypingTarget: boolean
  key: string
  metaKey: boolean
}): GlobalLauncherKeyboardAction | null {
  if ((metaKey || ctrlKey) && key.toLowerCase() === 'k') return 'toggle'
  if (isTypingTarget) return null

  return key === '/' ? 'open' : null
}

export function isLauncherTypingTarget(
  target: unknown,
  HTMLElementConstructor: LauncherTypingElementConstructor | undefined =
    typeof HTMLElement === 'undefined' ? undefined : HTMLElement,
): boolean {
  if (!HTMLElementConstructor || !(target instanceof HTMLElementConstructor)) return false

  const tagName = target.tagName.toLowerCase()

  return tagName === 'input' || tagName === 'textarea' || target.isContentEditable
}

export function isEmptySpaceRippleInteractiveTarget(
  target: unknown,
  HTMLElementConstructor: LauncherInteractiveElementConstructor | undefined =
    typeof HTMLElement === 'undefined' ? undefined : HTMLElement,
): boolean {
  if (!HTMLElementConstructor || !(target instanceof HTMLElementConstructor)) return false

  return Boolean(target.closest(EMPTY_SPACE_RIPPLE_INTERACTIVE_SELECTOR))
}

export function getNextLauncherActiveIndex(
  currentIndex: number,
  direction: LauncherActiveIndexDirection,
  commandCount: number,
) {
  if (commandCount <= 0) return 0

  return direction === 'next'
    ? Math.min(currentIndex + 1, commandCount - 1)
    : Math.max(currentIndex - 1, 0)
}

export function getClampedLauncherActiveIndex(currentIndex: number, commandCount: number) {
  return Math.min(currentIndex, Math.max(commandCount - 1, 0))
}

export function getLauncherPaletteKeyboardAction({
  commandCount,
  key,
}: {
  commandCount: number
  key: string
}): LauncherPaletteKeyboardAction | null {
  if (key === 'Escape') return { type: 'close' }
  if (key === 'Enter') return { type: 'run' }
  if (key === 'ArrowDown') {
    return commandCount > 0 ? { type: 'move', direction: 'next' } : { type: 'prevent-default' }
  }
  if (key === 'ArrowUp') {
    return commandCount > 0 ? { type: 'move', direction: 'previous' } : { type: 'prevent-default' }
  }

  return null
}

export function getLauncherAnalyticsTarget(
  command: SearchableLauncherCommand,
  emailAddress: string,
): LauncherAnalyticsTarget {
  if (command.id.startsWith('project-')) {
    return {
      type: 'project',
      label: command.label,
      slug: command.id.replace(/^project-/, ''),
    }
  }

  if (command.id === 'email' || command.id === 'draft-project-email') {
    return {
      type: 'external',
      href: `mailto:${emailAddress}`,
      label: 'email',
    }
  }

  return {
    type: 'navigation',
    label: `launchpad_${command.id}`,
  }
}

export function buildLauncherCommandSections<TCommand extends SearchableLauncherCommand>({
  commands,
  matchingCommands,
  query,
  recentCommandIds,
}: {
  commands: TCommand[]
  matchingCommands: TCommand[]
  query: string
  recentCommandIds: string[]
}): Array<LauncherCommandSection<TCommand>> {
  const commandById = new Map(commands.map((command) => [command.id, command]))
  const normalizedQuery = query.trim().toLowerCase()
  const sections: Array<LauncherCommandSection<TCommand>> = []
  const suggestedCommandIds = new Set<string>()

  if (!normalizedQuery) {
    const recentCommands = recentCommandIds
      .map((id) => commandById.get(id))
      .filter((command): command is TCommand => Boolean(command))
    const suggestedCommands = recentCommands.length > 0
      ? recentCommands
      : SUGGESTED_FALLBACK_COMMAND_IDS
        .map((id) => commandById.get(id))
        .filter((command): command is TCommand => Boolean(command))

    if (suggestedCommands.length > 0) {
      suggestedCommands.forEach((command) => suggestedCommandIds.add(command.id))
      sections.push({
        id: 'suggested',
        label: 'Suggested',
        commands: suggestedCommands,
      })
    }
  }

  for (const sectionId of LAUNCHER_SECTION_ORDER) {
    const sectionCommands = matchingCommands
      .filter((command) => command.section === sectionId && !suggestedCommandIds.has(command.id))
      .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0))

    if (sectionCommands.length > 0) {
      sections.push({
        id: sectionId,
        label: LAUNCHER_SECTION_LABELS[sectionId],
        commands: sectionCommands,
      })
    }
  }

  return sections
}
