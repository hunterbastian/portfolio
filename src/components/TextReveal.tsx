'use client'

import { m, useReducedMotion } from 'framer-motion'

interface TextRevealProps {
  text: string
  className?: string
  /** Enable blur-to-sharp transition per word */
  filter?: boolean
  /** Duration per word in seconds */
  duration?: number
  /** Delay between each word in seconds */
  staggerDelay?: number
  /** Extra delay before the first word starts (seconds) */
  startDelay?: number
  /** Whether the animation should play */
  trigger?: boolean
  /** HTML element to render as the wrapper */
  as?: 'p' | 'span' | 'div'
}

export default function TextReveal({
  text,
  className,
  filter = true,
  duration = 0.5,
  staggerDelay = 0.04,
  startDelay = 0,
  trigger = true,
  as: Tag = 'p',
}: TextRevealProps) {
  const prefersReducedMotion = useReducedMotion()
  const words = text.split(' ')

  if (prefersReducedMotion) {
    return <Tag className={className}>{text}</Tag>
  }

  return (
    <Tag className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <m.span
            className="inline-block"
            initial={{
              opacity: 0,
              y: 8,
              filter: filter ? 'blur(4px)' : 'none',
            }}
            animate={
              trigger
                ? {
                    opacity: 1,
                    y: 0,
                    filter: filter ? 'blur(0px)' : 'none',
                  }
                : {
                    opacity: 0,
                    y: 8,
                    filter: filter ? 'blur(4px)' : 'none',
                  }
            }
            transition={{
              duration,
              delay: startDelay + i * staggerDelay,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
          </m.span>
          {i < words.length - 1 && '\u00A0'}
        </span>
      ))}
    </Tag>
  )
}
