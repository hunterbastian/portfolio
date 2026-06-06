import { cn } from './utils.ts'

export const DEFAULT_LOADER_TYPE = 'zoomies'
export const LOADER_CONTAINER_BASE_CLASS = 'flex flex-col items-center justify-center'
export const LOADER_ICON_WRAPPER_CLASS = 'text-foreground'
export const LOADER_TEXT_CLASS = 'mt-4 text-sm font-medium text-muted-foreground animate-pulse'

export const LDRS_LOADER_TYPES = [
  'zoomies',
  'bouncy',
  'ring',
  'spiral',
  'dots-pulse',
  'quantum',
  'tailspin',
  'lineSpinner',
  'dotStream',
  'infinity',
] as const

export type LoaderType = (typeof LDRS_LOADER_TYPES)[number]

export interface LoaderElementProps {
  size: string
  speed: string
  color: string
}

export interface LoaderRenderState {
  props: LoaderElementProps
  tag: string
}

export interface LoaderRegistrationActivationInput {
  registerLoader?: (type: LoaderType) => Promise<void>
  reportError?: (message: string, error: unknown) => void
  type: LoaderType
}

export const LDRS_LOADER_ELEMENT_TAGS: Record<LoaderType, string> = {
  zoomies: 'l-zoomies',
  bouncy: 'l-bouncy',
  ring: 'l-ring',
  spiral: 'l-spiral',
  'dots-pulse': 'l-dots-pulse',
  quantum: 'l-quantum',
  tailspin: 'l-tailspin',
  lineSpinner: 'l-line-spinner',
  dotStream: 'l-dot-stream',
  infinity: 'l-infinity',
}

const LDRS_LOADER_REGISTER_KEYS: Record<LoaderType, string> = {
  zoomies: 'zoomies',
  bouncy: 'bouncy',
  ring: 'ring',
  spiral: 'spiral',
  'dots-pulse': 'dotPulse',
  quantum: 'quantum',
  tailspin: 'tailspin',
  lineSpinner: 'lineSpinner',
  dotStream: 'dotStream',
  infinity: 'infinity',
}

export function isLoaderType(type: string): type is LoaderType {
  return LDRS_LOADER_TYPES.includes(type as LoaderType)
}

export function getLoaderElementTag(type: LoaderType | string = DEFAULT_LOADER_TYPE): string {
  return isLoaderType(type) ? LDRS_LOADER_ELEMENT_TAGS[type] : LDRS_LOADER_ELEMENT_TAGS[DEFAULT_LOADER_TYPE]
}

export function getLoaderElementProps(size: string, speed: string, color: string): LoaderElementProps {
  return { size, speed, color }
}

export function getLoaderRenderState({
  color,
  size,
  speed,
  type = DEFAULT_LOADER_TYPE,
}: LoaderElementProps & { type?: LoaderType | string }): LoaderRenderState {
  return {
    props: getLoaderElementProps(size, speed, color),
    tag: getLoaderElementTag(type),
  }
}

export function getLoaderContainerClassName(className?: string): string {
  return cn(LOADER_CONTAINER_BASE_CLASS, className)
}

export function shouldRenderLoaderText(text: string | null | undefined): text is string {
  return Boolean(text)
}

export async function activateLoaderRegistration({
  registerLoader = registerLdrsLoader,
  reportError = console.error,
  type,
}: LoaderRegistrationActivationInput): Promise<void> {
  try {
    await registerLoader(type)
  } catch (error) {
    reportError('Failed to load LDRS loader:', error)
  }
}

export async function registerLdrsLoader(type: LoaderType): Promise<void> {
  const ldrs = await import('ldrs')
  const registerKey = LDRS_LOADER_REGISTER_KEYS[type]
  const loader = ldrs[registerKey as keyof typeof ldrs] as { register?: () => void } | undefined

  if (!loader) {
    if (registerKey === 'dotPulse') return

    throw new Error(`Unable to register LDRS loader: ${type}`)
  }

  if (!loader.register) {
    throw new Error(`LDRS loader is missing a register method: ${type}`)
  }

  loader.register()
}
