export const SOUND_TOGGLE_ENABLE_LABEL = 'Enable sounds'
export const SOUND_TOGGLE_MUTE_LABEL = 'Mute sounds'
export const SOUND_TOGGLE_ICON_SIZE = 11
export const SOUND_TOGGLE_ICON_VIEW_BOX = '0 0 16 16'
export const SOUND_TOGGLE_ICON_STROKE_WIDTH = 1.5
export const SOUND_TOGGLE_BUTTON_CLASS_NAME =
  'flex items-center justify-center w-11 h-11 text-foreground/40 hover:text-foreground/70 active:scale-[0.96] transition-[color,transform] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
export const SOUND_TOGGLE_ICON_SWAP_CLASS_NAME = 't-icon-swap'
export const SOUND_TOGGLE_ICON_CLASS_NAME = 't-icon'

export type SoundToggleIconId = 'a' | 'b'

export interface SoundToggleIconDescriptor {
  id: SoundToggleIconId
  paths: string[]
}

export const SOUND_TOGGLE_ICONS: SoundToggleIconDescriptor[] = [
  {
    id: 'a',
    paths: [
      'M3 5.5h2l3.5-3v11L5 10.5H3a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1Z',
      'M11 5.5l4 5M15 5.5l-4 5',
    ],
  },
  {
    id: 'b',
    paths: [
      'M3 5.5h2l3.5-3v11L5 10.5H3a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1Z',
      'M11 5.5a3 3 0 0 1 0 5',
      'M13 3.5a6 6 0 0 1 0 9',
    ],
  },
]

export function getSoundToggleLabel(enabled: boolean) {
  return enabled ? SOUND_TOGGLE_MUTE_LABEL : SOUND_TOGGLE_ENABLE_LABEL
}

export function getSoundToggleIconState(enabled: boolean): SoundToggleIconId {
  return enabled ? 'b' : 'a'
}
