'use client'

import type { ButtonHTMLAttributes } from 'react'
import { getArcGlossUploadButtonClassNames } from '@/lib/arc-gloss-upload-button'
import styles from './ArcGlossUploadButton.module.css'

interface ArcGlossUploadButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  containerClassName?: string
  fillViewport?: boolean
  surface?: 'warm' | 'transparent'
}

export default function ArcGlossUploadButton({
  className,
  containerClassName,
  fillViewport = true,
  surface = 'warm',
  type = 'button',
  'aria-label': ariaLabel = 'Upload',
  ...buttonProps
}: ArcGlossUploadButtonProps) {
  const { buttonClassName, stageClassName } = getArcGlossUploadButtonClassNames({
    buttonClass: styles.button,
    className,
    containerClassName,
    fillViewport,
    fullViewportClass: styles.fullViewport,
    stageClass: styles.stage,
  })

  return (
    <div className={stageClassName} data-surface={surface}>
      <button
        {...buttonProps}
        type={type}
        className={buttonClassName}
        aria-label={ariaLabel}
      >
        <span className={styles.bezel} aria-hidden="true" />
        <span className={styles.recess} aria-hidden="true" />
        <span className={styles.face} aria-hidden="true">
          <svg
            className={styles.arrow}
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M32 48V17"
              stroke="currentColor"
              strokeWidth="5.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M18.5 30.5L32 17L45.5 30.5"
              stroke="currentColor"
              strokeWidth="5.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
    </div>
  )
}
