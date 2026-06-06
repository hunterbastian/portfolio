'use client'

import { useSound } from '@/lib/sounds/context'
import {
  SOUND_TOGGLE_BUTTON_CLASS_NAME,
  SOUND_TOGGLE_ICONS,
  SOUND_TOGGLE_ICON_CLASS_NAME,
  SOUND_TOGGLE_ICON_SIZE,
  SOUND_TOGGLE_ICON_STROKE_WIDTH,
  SOUND_TOGGLE_ICON_SWAP_CLASS_NAME,
  SOUND_TOGGLE_ICON_VIEW_BOX,
  getSoundToggleIconState,
  getSoundToggleLabel,
} from '@/lib/sound-toggle'

/**
 * Minimal sound toggle button for the header.
 * Shows a small speaker icon, muted by default.
 */
export default function SoundToggle() {
  const { enabled, toggle } = useSound()
  const label = getSoundToggleLabel(enabled)
  const iconState = getSoundToggleIconState(enabled)

  return (
    <button
      type="button"
      onClick={toggle}
      className={SOUND_TOGGLE_BUTTON_CLASS_NAME}
      aria-label={label}
      title={label}
    >
      <span className={SOUND_TOGGLE_ICON_SWAP_CLASS_NAME} data-state={iconState}>
        {SOUND_TOGGLE_ICONS.map((icon) => (
          <svg
            key={icon.id}
            className={SOUND_TOGGLE_ICON_CLASS_NAME}
            data-icon={icon.id}
            width={SOUND_TOGGLE_ICON_SIZE}
            height={SOUND_TOGGLE_ICON_SIZE}
            viewBox={SOUND_TOGGLE_ICON_VIEW_BOX}
            fill="none"
            stroke="currentColor"
            strokeWidth={SOUND_TOGGLE_ICON_STROKE_WIDTH}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {icon.paths.map((path) => (
              <path key={path} d={path} />
            ))}
          </svg>
        ))}
      </span>
    </button>
  )
}
