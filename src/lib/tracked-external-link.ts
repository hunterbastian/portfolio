import { getSafeExternalLinkRel } from './link-safety.ts'

export type TrackedExternalLinkContextInput = {
  trackingSource?: string
  projectSlug?: string
  projectTitle?: string
}

export type TrackedExternalLinkAnalyticsInput = TrackedExternalLinkContextInput & {
  href: string
  platform?: string
}

export interface TrackedExternalLinkClickAction<TEvent = unknown>
  extends TrackedExternalLinkAnalyticsInput {
  event: TEvent
  onClick?: (event: TEvent) => void
  trackExternalLink: (
    href: string,
    platform: string | undefined,
    context: ReturnType<typeof getTrackedExternalLinkAnalyticsContext>,
  ) => void
}

export function getTrackedExternalLinkAnalyticsContext({
  trackingSource,
  projectSlug,
  projectTitle,
}: TrackedExternalLinkContextInput) {
  return {
    source: trackingSource,
    projectSlug,
    projectTitle,
  }
}

export function getTrackedExternalLinkAnalyticsPayload({
  href,
  platform,
  trackingSource,
  projectSlug,
  projectTitle,
}: TrackedExternalLinkAnalyticsInput) {
  return {
    href,
    platform,
    context: getTrackedExternalLinkAnalyticsContext({ trackingSource, projectSlug, projectTitle }),
  }
}

export function getTrackedExternalLinkRel(target?: string, rel?: string) {
  return getSafeExternalLinkRel(target, rel)
}

export function activateTrackedExternalLink<TEvent = unknown>({
  event,
  href,
  onClick,
  platform,
  projectSlug,
  projectTitle,
  trackExternalLink,
  trackingSource,
}: TrackedExternalLinkClickAction<TEvent>) {
  const payload = getTrackedExternalLinkAnalyticsPayload({
    href,
    platform,
    projectSlug,
    projectTitle,
    trackingSource,
  })

  trackExternalLink(payload.href, payload.platform, payload.context)
  onClick?.(event)
}
