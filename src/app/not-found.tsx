'use client'

import Link from 'next/link'
import { m } from 'framer-motion'
import IconArrowBackUp from '@/components/IconArrowBackUp'
import { Archive as ArchiveGlyph } from '@/components/pixel/glyphs'
import {
  getNotFoundRevealTransition,
  getNotFoundStaggerDelay,
  NOT_FOUND_ACTIONS_ANIMATE,
  NOT_FOUND_ACTIONS_INITIAL,
  NOT_FOUND_BLUR_REVEAL_ANIMATE,
  NOT_FOUND_BLUR_REVEAL_INITIAL,
  NOT_FOUND_CONTACT_ACTION_CLASS,
  NOT_FOUND_CONTACT_HREF,
  NOT_FOUND_CONTACT_LABEL,
  NOT_FOUND_DESCRIPTION,
  NOT_FOUND_HOME_ACTION_CLASS,
  NOT_FOUND_HOME_HREF,
  NOT_FOUND_HOME_ICON_CLASS,
  NOT_FOUND_HOME_LABEL,
  NOT_FOUND_STATUS_CODE,
  NOT_FOUND_STATUS_DELAY,
  NOT_FOUND_TITLE,
} from '@/lib/not-found'

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <m.div
          className="flex justify-center mb-4"
          initial={NOT_FOUND_BLUR_REVEAL_INITIAL}
          animate={NOT_FOUND_BLUR_REVEAL_ANIMATE}
          transition={getNotFoundRevealTransition()}
        >
          <ArchiveGlyph size={22} className="text-muted-foreground/50" />
        </m.div>

        <m.p
          className="text-[11px] tracking-[0.14em] uppercase text-muted-foreground"
          style={{ fontFamily: 'inherit' }}
          initial={NOT_FOUND_BLUR_REVEAL_INITIAL}
          animate={NOT_FOUND_BLUR_REVEAL_ANIMATE}
          transition={getNotFoundRevealTransition(NOT_FOUND_STATUS_DELAY)}
        >
          {NOT_FOUND_STATUS_CODE}
        </m.p>

        <m.h1
          className="mt-3 text-sm font-medium tracking-[0.06em] text-foreground"
          style={{ fontFamily: 'inherit' }}
          initial={NOT_FOUND_BLUR_REVEAL_INITIAL}
          animate={NOT_FOUND_BLUR_REVEAL_ANIMATE}
          transition={getNotFoundRevealTransition(getNotFoundStaggerDelay(1))}
        >
          {NOT_FOUND_TITLE}
        </m.h1>

        <m.p
          className="mt-1.5 text-xs leading-relaxed text-muted-foreground"
          style={{ fontFamily: 'inherit' }}
          initial={NOT_FOUND_BLUR_REVEAL_INITIAL}
          animate={NOT_FOUND_BLUR_REVEAL_ANIMATE}
          transition={getNotFoundRevealTransition(getNotFoundStaggerDelay(2))}
        >
          {NOT_FOUND_DESCRIPTION}
        </m.p>

        <m.div
          className="mt-10 flex items-center justify-center gap-6"
          initial={NOT_FOUND_ACTIONS_INITIAL}
          animate={NOT_FOUND_ACTIONS_ANIMATE}
          transition={getNotFoundRevealTransition(getNotFoundStaggerDelay(3))}
        >
          <Link
            href={NOT_FOUND_HOME_HREF}
            className={NOT_FOUND_HOME_ACTION_CLASS}
          >
            <IconArrowBackUp size={11} className={NOT_FOUND_HOME_ICON_CLASS} aria-hidden />
            {NOT_FOUND_HOME_LABEL}
          </Link>
          <Link
            href={NOT_FOUND_CONTACT_HREF}
            className={NOT_FOUND_CONTACT_ACTION_CLASS}
            style={{ fontFamily: 'inherit' }}
          >
            {NOT_FOUND_CONTACT_LABEL}
          </Link>
        </m.div>
      </div>
    </div>
  )
}
