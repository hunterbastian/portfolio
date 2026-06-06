export const SOUND_STORAGE_KEY = 'hb-sound-enabled'

export interface SoundPreferenceStorage {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
}

export function parseStoredSoundEnabled(storedValue: string | null | undefined): boolean {
  return storedValue === 'true'
}

export function getNextSoundEnabled(currentValue: boolean): boolean {
  return !currentValue
}

export function stringifyStoredSoundEnabled(enabled: boolean): string {
  return String(enabled)
}

export function readStoredSoundEnabled(
  storage: SoundPreferenceStorage,
  key = SOUND_STORAGE_KEY,
): boolean {
  try {
    return parseStoredSoundEnabled(storage.getItem(key))
  } catch {
    return false
  }
}

export function writeStoredSoundEnabled(
  storage: SoundPreferenceStorage,
  enabled: boolean,
  key = SOUND_STORAGE_KEY,
): void {
  try {
    storage.setItem(key, stringifyStoredSoundEnabled(enabled))
  } catch {
    // Storage can be unavailable in privacy modes or during quota failures.
  }
}
