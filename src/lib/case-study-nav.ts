export interface CaseStudyChapter {
  id: string
  title: string
}

export interface CaseStudyChapterIndicatorState {
  [key: string]: string | number
  backgroundColor: string
  height: number
  opacity: number
  width: number
}

interface CaseStudyChapterElement {
  dataset: {
    chapter?: string
    chapterTitle?: string
  }
}

interface CaseStudyChapterObserverEntry {
  isIntersecting: boolean
  target: unknown
}

interface CaseStudyChapterObserverLike<TElement> {
  disconnect: () => void
  observe: (element: TElement) => void
}

interface CaseStudyChapterScrollableElement {
  scrollIntoView: (options: typeof CASE_STUDY_CHAPTER_SCROLL_OPTIONS) => void
}

export interface CaseStudyChapterActivationInput {
  chapterId: string
  findChapterElement: (selector: string) => CaseStudyChapterScrollableElement | null
  trackNavigationClick: (target: string) => void
  triggerHaptic: (style: typeof CASE_STUDY_CHAPTER_HAPTIC_STYLE) => void
}

export interface CaseStudyChapterObserverActivationInput<TElement> {
  chapters: readonly CaseStudyChapter[]
  createObserver: (
    onEntries: (entries: Iterable<CaseStudyChapterObserverEntry>) => void,
    options: typeof CASE_STUDY_CHAPTER_OBSERVER_OPTIONS,
  ) => CaseStudyChapterObserverLike<TElement>
  getChapterElements: () => Iterable<TElement>
  setActiveChapter: (chapterId: string) => void
}

export const CASE_STUDY_NAV_ARIA_LABEL = 'Case study chapters'
export const CASE_STUDY_NAV_ROOT_CLASS_NAME = 'absolute -left-20 top-0 bottom-0 hidden xl:block w-14'
export const CASE_STUDY_NAV_LIST_CLASS_NAME = 'sticky top-[33vh] flex flex-col gap-3'
export const CASE_STUDY_CHAPTER_BUTTON_CLASS_NAME =
  'group flex min-h-[40px] origin-center touch-manipulation items-center gap-2 text-left transition-transform duration-150 active:translate-y-0 active:scale-[0.96] focus-visible:outline-none'
export const CASE_STUDY_CHAPTER_MARKER_CLASS_NAME = 'block rounded-full'
export const CASE_STUDY_CHAPTER_HAPTIC_STYLE = 'light'
export const CASE_STUDY_CHAPTER_SCROLL_OPTIONS = { behavior: 'smooth', block: 'start' } as const
export const CASE_STUDY_CHAPTER_SELECTOR = '[data-chapter]'
export const CASE_STUDY_CHAPTER_OBSERVER_OPTIONS = { rootMargin: '-20% 0px -60% 0px' } as const

const CASE_STUDY_CHAPTER_LABEL_BASE_CLASS =
  'font-mono text-[10px] tracking-[0.08em] transition-opacity duration-200'
const CASE_STUDY_CHAPTER_LABEL_ACTIVE_CLASS = 'text-foreground opacity-70'
const CASE_STUDY_CHAPTER_LABEL_INACTIVE_CLASS = 'text-muted-foreground opacity-0 group-hover:opacity-50'

function escapeCssAttributeValue(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
}

export function getCaseStudyChapters(elements: Iterable<CaseStudyChapterElement>): CaseStudyChapter[] {
  const chapters: CaseStudyChapter[] = []

  for (const element of elements) {
    const id = element.dataset.chapter ?? ''
    const title = element.dataset.chapterTitle ?? ''

    if (id) {
      chapters.push({ id, title })
    }
  }

  return chapters
}

export function getInitialCaseStudyChapterId(chapters: CaseStudyChapter[]) {
  return chapters[0]?.id ?? ''
}

export function getIntersectingCaseStudyChapterId(
  entries: Iterable<CaseStudyChapterObserverEntry>,
) {
  for (const entry of entries) {
    const chapter = getCaseStudyChapterDataset(entry.target)?.chapter

    if (entry.isIntersecting && chapter) {
      return chapter
    }
  }

  return null
}

function getCaseStudyChapterDataset(target: unknown): { chapter?: string } | undefined {
  if (!target || typeof target !== 'object') return undefined

  const dataset = (target as { dataset?: unknown }).dataset

  if (!dataset || typeof dataset !== 'object') return undefined

  const chapter = (dataset as { chapter?: unknown }).chapter

  return typeof chapter === 'string' ? { chapter } : undefined
}

export function getCaseStudyChapterSelector(chapterId: string) {
  return `[data-chapter="${escapeCssAttributeValue(chapterId)}"]`
}

export function getCaseStudyChapterAnalyticsTarget(chapterId: string) {
  return `chapter_${chapterId}`
}

export function getCaseStudyChapterAriaLabel(chapter: CaseStudyChapter) {
  return `Chapter ${chapter.id}: ${chapter.title}`
}

export function getCaseStudyChapterAriaCurrent(isActive: boolean) {
  return isActive ? 'step' : undefined
}

export function getCaseStudyChapterIndicatorState(isActive: boolean): CaseStudyChapterIndicatorState {
  return {
    width: isActive ? 16 : 4,
    height: 4,
    opacity: isActive ? 0.9 : 0.15,
    backgroundColor: isActive ? 'var(--accent)' : 'var(--foreground)',
  }
}

export function getCaseStudyChapterLabelClassName(isActive: boolean) {
  return `${CASE_STUDY_CHAPTER_LABEL_BASE_CLASS} ${
    isActive ? CASE_STUDY_CHAPTER_LABEL_ACTIVE_CLASS : CASE_STUDY_CHAPTER_LABEL_INACTIVE_CLASS
  }`
}

export function activateCaseStudyChapterNavigation({
  chapterId,
  findChapterElement,
  trackNavigationClick,
  triggerHaptic,
}: CaseStudyChapterActivationInput) {
  triggerHaptic(CASE_STUDY_CHAPTER_HAPTIC_STYLE)
  trackNavigationClick(getCaseStudyChapterAnalyticsTarget(chapterId))
  findChapterElement(getCaseStudyChapterSelector(chapterId))?.scrollIntoView(CASE_STUDY_CHAPTER_SCROLL_OPTIONS)
}

export function activateCaseStudyChapterObserver<TElement>({
  chapters,
  createObserver,
  getChapterElements,
  setActiveChapter,
}: CaseStudyChapterObserverActivationInput<TElement>): (() => void) | undefined {
  if (chapters.length === 0) {
    return undefined
  }

  const observer = createObserver((entries) => {
    const nextActiveChapter = getIntersectingCaseStudyChapterId(entries)

    if (nextActiveChapter) {
      setActiveChapter(nextActiveChapter)
    }
  }, CASE_STUDY_CHAPTER_OBSERVER_OPTIONS)

  for (const element of getChapterElements()) {
    observer.observe(element)
  }

  return () => observer.disconnect()
}
