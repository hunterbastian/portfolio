export const HOME_SECTION_NAV_ARIA_LABEL = 'On this page'
export const HOME_SECTION_NAV_HAPTIC_STYLE = 'light'
export const HOME_SECTION_NAV_SCROLL_OFFSET_PX = 88
export const HOME_SECTION_SCROLL_MARGIN_CLASS_NAME = 'scroll-mt-20 sm:scroll-mt-24'
export const HOME_SECTION_NAV_LIST_CLASS_NAME =
  'flex min-w-0 items-center justify-end gap-0.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-1'

const HOME_SECTION_NAV_LINK_BASE_CLASS =
  'justify-center rounded-[8px] px-1.5 text-[0.72rem] tracking-normal transition-[background-color,color,filter,transform] duration-150 sm:px-2 sm:text-[0.82rem]'
const HOME_SECTION_NAV_LINK_ACTIVE_CLASS =
  'text-[#2f7d73] bg-[color-mix(in_srgb,#2f7d73_11%,transparent)]'
const HOME_SECTION_NAV_LINK_INACTIVE_CLASS =
  'text-muted-foreground/76 hover:bg-[color-mix(in_srgb,#2f7d73_8%,transparent)] hover:text-[#2f7d73] focus-visible:bg-[color-mix(in_srgb,#2f7d73_8%,transparent)] focus-visible:text-[#2f7d73]'

export const HOME_SECTION_NAV_ITEMS = [
  { id: 'home', name: 'Home', peek: 'Back to top' },
  { id: 'projects', name: 'Work', peek: 'Projects' },
  { id: 'playground', name: 'Play', peek: 'Playground' },
  { id: 'experience', name: 'Experience', peek: 'Background' },
  { id: 'contact', name: 'Contact', peek: 'Say hi' },
] as const

export type HomeSectionNavItem = (typeof HOME_SECTION_NAV_ITEMS)[number]
export type HomeSectionId = HomeSectionNavItem['id']

export interface HomeSectionPosition {
  id: string
  top: number
}

export interface HomeSectionViewport {
  documentHeight: number
  height: number
}

export interface HomeSectionScrollableElement {
  scrollIntoView: (options: ReturnType<typeof getHomeSectionScrollOptions>) => void
}

export interface HomeSectionNavigationInput {
  closeMobileMenu?: () => void
  findSectionElement: (sectionId: string) => HomeSectionScrollableElement | null
  prefersReducedMotion: boolean
  replaceUrl: (href: string) => void
  sectionId: string
  trackNavigationClick: (target: string) => void
  triggerHaptic: (style: typeof HOME_SECTION_NAV_HAPTIC_STYLE) => void
}

export function isHomeSectionNavPath(pathname: string) {
  return pathname === '/'
}

export function shouldShowHomeSectionNav(pathname: string) {
  return isHomeSectionNavPath(pathname)
}

export function getHomeSectionHref(sectionId: string) {
  return `/#${sectionId}`
}

export function getHomeSectionHash(sectionId: string) {
  return `#${sectionId}`
}

export function getHomeSectionAnalyticsTarget(sectionId: string) {
  return `section_${sectionId}`
}

export function getHomeSectionScrollBehavior(prefersReducedMotion: boolean): ScrollBehavior {
  return prefersReducedMotion ? 'auto' : 'smooth'
}

export function getHomeSectionScrollOptions(prefersReducedMotion: boolean) {
  return {
    behavior: getHomeSectionScrollBehavior(prefersReducedMotion),
    block: 'start',
  } as const
}

export function getActiveHomeSectionId(
  sections: readonly HomeSectionPosition[],
  scrollY: number,
  offsetPx = HOME_SECTION_NAV_SCROLL_OFFSET_PX,
  viewport?: HomeSectionViewport,
) {
  if (sections.length === 0) {
    return ''
  }

  if (viewport) {
    const bottomRemaining = viewport.documentHeight - (scrollY + viewport.height)

    if (bottomRemaining <= offsetPx) {
      for (let index = sections.length - 1; index >= 0; index -= 1) {
        const section = sections[index]

        if (section && Number.isFinite(section.top)) {
          return section.id
        }
      }
    }
  }

  const probe = scrollY + offsetPx
  let activeId = sections[0]?.id ?? ''

  for (const section of sections) {
    if (!Number.isFinite(section.top)) {
      continue
    }

    if (section.top <= probe) {
      activeId = section.id
    }
  }

  return activeId
}

export function getHomeSectionPositions(
  items: readonly Pick<HomeSectionNavItem, 'id'>[],
  getSectionTop: (sectionId: string) => number | null,
): HomeSectionPosition[] {
  return items.map((item) => {
    const top = getSectionTop(item.id)

    return {
      id: item.id,
      top: top ?? Number.POSITIVE_INFINITY,
    }
  })
}

export function getHomeSectionNavAriaCurrent(isActive: boolean) {
  return isActive ? 'location' : undefined
}

export function getHomeSectionNavLinkClassName(isActive: boolean) {
  return `${HOME_SECTION_NAV_LINK_BASE_CLASS} ${
    isActive ? HOME_SECTION_NAV_LINK_ACTIVE_CLASS : HOME_SECTION_NAV_LINK_INACTIVE_CLASS
  }`
}

export function activateHomeSectionNavigation({
  closeMobileMenu,
  findSectionElement,
  prefersReducedMotion,
  replaceUrl,
  sectionId,
  trackNavigationClick,
  triggerHaptic,
}: HomeSectionNavigationInput) {
  triggerHaptic(HOME_SECTION_NAV_HAPTIC_STYLE)
  trackNavigationClick(getHomeSectionAnalyticsTarget(sectionId))
  closeMobileMenu?.()
  findSectionElement(sectionId)?.scrollIntoView(getHomeSectionScrollOptions(prefersReducedMotion))
  replaceUrl(getHomeSectionHref(sectionId))
}
