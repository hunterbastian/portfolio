import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

/**
 * Cards surface: one step lighter than the canvas, with the small shadow and
 * no extra border. Sections inside use a hairline, not another card.
 */
function Card({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="card"
      className={cn('cards-card bg-surface text-fg shadow-sm', className)}
      {...props}
    />
  )
}

export { Card }
