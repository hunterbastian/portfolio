import { getAnimatedDigitParts } from '@/lib/animated-digits'
import { cn } from '@/lib/utils'

interface AnimatedDigitsProps {
  ariaHidden?: boolean
  className?: string
  text: string
}

export function AnimatedDigits({ ariaHidden = true, className, text }: AnimatedDigitsProps) {
  return (
    <span
      key={text}
      aria-hidden={ariaHidden}
      className={cn('t-digit-group is-animating', className)}
    >
      {getAnimatedDigitParts(text).map((part) => (
        <span
          key={part.key}
          className="t-digit"
          data-stagger={part.stagger}
        >
          {part.character === ' ' ? '\u00a0' : part.character}
        </span>
      ))}
    </span>
  )
}
