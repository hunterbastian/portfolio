'use client'

// Adapted from AlignUI's MIT-licensed Button. See ./LICENSE and README.md.
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'
import styles from './controls.module.css'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean
  mode?: 'stroke' | 'filled' | 'ghost'
}
export const Root = React.forwardRef<HTMLButtonElement, Props>(
  ({ asChild, mode = 'stroke', className, ...props }, ref) => {
    const Component = asChild ? Slot : 'button'
    return <Component ref={ref} className={cn(styles.button, styles[mode], className)} {...props} />
  },
)
Root.displayName = 'AlignButton'
