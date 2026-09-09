'use client'

import Link from 'next/link'
import type { ComponentProps, MouseEvent } from 'react'
import { useProjectMorph } from '@/components/ViewTransitionProvider'

interface MorphLinkProps extends Omit<ComponentProps<typeof Link>, 'href'> {
  href: string
  /** Identifies which card and hero are the two ends of the same morph. */
  slug: string
  'data-project-morph'?: 'true'
}

/**
 * A project link that hands navigation to the View Transitions API so the card
 * morphs into the detail hero. Falls back to an ordinary client-side push when
 * the browser lacks support, the visitor asked for reduced motion, or the click
 * was modified to open elsewhere.
 */
export default function MorphLink({ href, slug, onClick, ...linkProps }: MorphLinkProps) {
  const morphTo = useProjectMorph()

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)

    if (event.defaultPrevented || !morphTo) {
      return
    }

    const handled = morphTo(href, slug, {
      altKey: event.altKey,
      button: event.button,
      ctrlKey: event.ctrlKey,
      metaKey: event.metaKey,
      shiftKey: event.shiftKey,
    })

    if (handled) {
      event.preventDefault()
    }
  }

  return <Link href={href} onClick={handleClick} {...linkProps} />
}
