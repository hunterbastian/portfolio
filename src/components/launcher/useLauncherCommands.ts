'use client'

import { useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Archive, Contact, Work, Writing } from '@/components/pixel/glyphs'
import { showJoyToast } from '@/lib/joy'
import {
  LAUNCHER_EMAIL_ADDRESS,
  LAUNCHER_WORK_FILTER_EVENT,
  LAUNCHER_WORK_FILTERS,
  activateLauncherDraftProjectEmail,
  activateLauncherEmailCopy,
  activateLauncherPageLinkCopy,
  activateLauncherWorkFilter,
  getLauncherProjectCommandHint,
  getLauncherProjectCommandKeywords,
} from '@/lib/launcher'
import type { LauncherCommand, LauncherProject } from '@/components/launcher/types'
import type { LauncherWorkFilter } from '@/lib/launcher'

export function useLauncherCommands(projects: LauncherProject[]) {
  const router = useRouter()

  const openWorkFilter = useCallback(
    (filter: LauncherWorkFilter, toastMessage: string) => {
      activateLauncherWorkFilter({
        dispatchWorkFilterEvent: (filter) => {
          window.dispatchEvent(new CustomEvent(LAUNCHER_WORK_FILTER_EVENT, { detail: { filter } }))
        },
        filter,
        pushRoute: (target) => router.push(target),
        schedule: (callback, delayMs) => window.setTimeout(callback, delayMs),
        showToast: showJoyToast,
        toastMessage,
      })
    },
    [router],
  )

  return useMemo<LauncherCommand[]>(() => {
    const coreCommands: LauncherCommand[] = [
      {
        id: 'home',
        label: 'Home',
        hint: 'Return to the main page',
        icon: Work,
        section: 'navigate',
        priority: 10,
        keys: 'H',
        kind: 'Navigate',
        keywords: ['start', 'main', 'index', 'landing'],
        run: () => {
          router.push('/')
          showJoyToast('Opening home')
        },
      },
      {
        id: 'projects',
        label: 'Projects',
        hint: 'Jump to selected work',
        icon: Work,
        section: 'navigate',
        priority: 20,
        keys: 'P',
        kind: 'Navigate',
        keywords: ['work', 'case studies', 'portfolio', 'selected'],
        run: () => {
          router.push('/#projects')
          showJoyToast('Opening projects')
        },
      },
      {
        id: 'cv',
        label: 'Resume',
        hint: 'Open the resume page',
        icon: Writing,
        section: 'navigate',
        priority: 30,
        keys: 'C',
        kind: 'Navigate',
        keywords: ['cv', 'resume', 'pdf', 'experience'],
        run: () => {
          router.push('/cv')
          showJoyToast('Opening resume')
        },
      },
      {
        id: 'contact',
        label: 'Contact',
        hint: 'Jump to social links',
        icon: Contact,
        section: 'navigate',
        priority: 40,
        keys: 'S',
        kind: 'Contact',
        keywords: ['email', 'social', 'hire', 'freelance'],
        run: () => {
          router.push('/#contact')
          showJoyToast('Say hi')
        },
      },
      {
        id: 'playground',
        label: 'Playground',
        hint: 'Open experiments',
        icon: Archive,
        section: 'navigate',
        priority: 50,
        keys: 'G',
        kind: 'Navigate',
        keywords: ['archive', 'experiments', 'prototypes', 'play'],
        run: () => {
          router.push('/archive')
          showJoyToast('Opening playground')
        },
      },
      {
        id: 'email',
        label: 'Copy Email',
        hint: LAUNCHER_EMAIL_ADDRESS,
        icon: Contact,
        section: 'contact',
        priority: 20,
        keys: 'E',
        kind: 'Contact',
        keywords: ['copy', 'mail', 'contact', 'hire'],
        run: async () => {
          await activateLauncherEmailCopy({
            copyText: (value) => navigator.clipboard.writeText(value),
            navigateToHref: (href) => {
              window.location.href = href
            },
            showToast: showJoyToast,
          })
        },
      },
      {
        id: 'copy-page-link',
        label: 'Copy Page Link',
        hint: 'Copy the current portfolio URL',
        icon: Archive,
        section: 'contact',
        priority: 30,
        keys: 'L',
        kind: 'Tool',
        keywords: ['copy', 'url', 'link', 'current page', 'share', 'arc command'],
        run: async () => {
          await activateLauncherPageLinkCopy({
            copyText: (value) => navigator.clipboard.writeText(value),
            currentHref: window.location.href,
            showToast: showJoyToast,
          })
        },
      },
      {
        id: 'draft-project-email',
        label: 'Draft Project Email',
        hint: 'Open a focused project inquiry email',
        icon: Contact,
        section: 'contact',
        priority: 40,
        kind: 'Skill',
        keywords: ['email', 'inquiry', 'project', 'hire', 'dia skill', 'compose'],
        run: () => {
          activateLauncherDraftProjectEmail({
            navigateToHref: (href) => {
              window.location.href = href
            },
            showToast: showJoyToast,
          })
        },
      },
    ]

    const filterCommands: LauncherCommand[] = LAUNCHER_WORK_FILTERS.map((filter, index) => ({
      id: `filter-${filter.id}`,
      label: filter.label,
      hint: filter.hint,
      icon: Work,
      section: 'work',
      priority: index,
      kind: 'Filter',
      keywords: filter.keywords,
      run: () => openWorkFilter(filter.id, filter.toast),
    }))

    const projectCommands: LauncherCommand[] = projects.map((project, index) => ({
      id: `project-${project.slug}`,
      label: project.title,
      hint: getLauncherProjectCommandHint(project),
      icon: Work,
      section: 'projects',
      priority: index,
      kind: 'Project',
      keywords: getLauncherProjectCommandKeywords(project),
      run: () => {
        router.push(`/projects/${project.slug}`)
        showJoyToast('Opening project')
      },
    }))

    return [...coreCommands, ...filterCommands, ...projectCommands]
  }, [openWorkFilter, projects, router])
}
