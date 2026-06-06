'use client'

import { GitHubCalendar } from 'react-github-calendar'
import {
  GITHUB_CONTRIBUTION_CALENDAR_CONFIG,
  GITHUB_CONTRIBUTION_MONTHS,
  GITHUB_CONTRIBUTION_THEME,
  GITHUB_CONTRIBUTION_USERNAME,
  selectRecentContributionMonths,
} from '@/lib/github-contributions'
import SectionMarker from './pixel/SectionMarker'
import styles from './pixel/pixel.module.css'

export default function GitHubContributions() {
  return (
    <div className="mx-auto max-w-[560px] px-4 sm:px-6 lg:px-0 py-8">
      <div className="mb-4">
        <SectionMarker kind="now" label="GitHub Activity" />
      </div>
      <div className={styles.crisp}>
        <GitHubCalendar
          username={GITHUB_CONTRIBUTION_USERNAME}
          transformData={(data) => selectRecentContributionMonths(data, GITHUB_CONTRIBUTION_MONTHS)}
          {...GITHUB_CONTRIBUTION_CALENDAR_CONFIG}
          theme={GITHUB_CONTRIBUTION_THEME}
        />
      </div>
    </div>
  )
}
