'use client'

// Adapted from AlignUI's MIT-licensed Drawer, retaining Radix dialog behavior.
import * as React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { cn } from '@/lib/utils'
import styles from './controls.module.css'

export const Root = Dialog.Root
export const Trigger = Dialog.Trigger
export const Close = Dialog.Close
export const Title = Dialog.Title
export const Description = Dialog.Description
export const Content = React.forwardRef<React.ComponentRef<typeof Dialog.Content>, React.ComponentPropsWithoutRef<typeof Dialog.Content>>(
  ({ children, className, ...props }, ref) => (
    <Dialog.Portal>
      <Dialog.Overlay className={styles.overlay} />
      <Dialog.Content ref={ref} className={cn(styles.drawer, className)} {...props}>
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  ),
)
Content.displayName = 'AlignDrawerContent'
