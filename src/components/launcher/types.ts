import type { ComponentType, SVGProps } from 'react'
import type { LauncherProjectSource, SearchableLauncherCommand } from '@/lib/launcher'

export interface LauncherCommand extends SearchableLauncherCommand {
  icon: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>
  run: () => void | Promise<void>
}

export type LauncherProject = LauncherProjectSource
