// Adapted from AlignUI's MIT-licensed Tag, using the static stroke variant.
import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import styles from './controls.module.css'

export function Root({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn(styles.tag, className)} {...props} />
}
