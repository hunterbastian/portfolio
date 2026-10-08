'use client'

// Adapted from AlignUI's MIT-licensed Modal. See ./LICENSE and README.md.
import * as React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import * as Button from './button'
import { cn } from '@/lib/utils'
import styles from './controls.module.css'

export const Root = Dialog.Root
export const Trigger = Dialog.Trigger
export const Title = Dialog.Title
export const Description = Dialog.Description
export const Content = React.forwardRef<React.ComponentRef<typeof Dialog.Content>, React.ComponentPropsWithoutRef<typeof Dialog.Content>>(
  ({ children, className, ...props }, ref) => (
    <Dialog.Portal>
      <Dialog.Overlay className={cn(styles.overlay, styles.modalOverlay)}>
        <Dialog.Content ref={ref} className={cn(styles.modal, className)} {...props}>
          {children}
          <Dialog.Close asChild>
            <Button.Root mode="ghost" className={styles.modalClose} aria-label="Close image viewer">
              <X size={20} aria-hidden="true" />
            </Button.Root>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Overlay>
    </Dialog.Portal>
  ),
)
Content.displayName = 'AlignModalContent'
