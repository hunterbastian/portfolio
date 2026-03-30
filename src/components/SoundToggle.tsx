'use client'

import { useSound } from '@/lib/sounds/context'

/**
 * Minimal sound toggle button for the header.
 * Shows a small speaker icon, muted by default.
 */
export default function SoundToggle() {
  const { enabled, toggle } = useSound()

  return (
    <button
      type="button"
      onClick={toggle}
      className="flex items-center justify-center w-6 h-6 text-foreground/40 hover:text-foreground/70 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      aria-label={enabled ? 'Mute sounds' : 'Enable sounds'}
      title={enabled ? 'Mute sounds' : 'Enable sounds'}
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {/* Speaker body */}
        <path d="M3 5.5h2l3.5-3v11L5 10.5H3a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1Z" />
        {enabled ? (
          <>
            {/* Sound waves */}
            <path d="M11 5.5a3 3 0 0 1 0 5" />
            <path d="M13 3.5a6 6 0 0 1 0 9" />
          </>
        ) : (
          /* Mute slash */
          <path d="M11 5.5l4 5M15 5.5l-4 5" />
        )}
      </svg>
    </button>
  )
}
