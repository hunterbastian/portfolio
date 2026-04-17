'use client'

import { GitHubCalendar } from 'react-github-calendar'
import type { Activity } from 'react-github-calendar'
import SectionMarker from './pixel/SectionMarker'
import styles from './pixel/pixel.module.css'

function selectRecentMonths(data: Activity[], months: number): Activity[] {
  const cutoff = new Date()
  cutoff.setMonth(cutoff.getMonth() - months)
  const cutoffStr = cutoff.toISOString().slice(0, 10)
  return data.filter((d) => d.date >= cutoffStr)
}

export default function GitHubContributions() {
  return (
    <div className="mx-auto max-w-[560px] px-4 sm:px-6 lg:px-0 py-8">
      <div className="mb-4">
        <SectionMarker kind="now" label="GitHub Activity" />
      </div>
      <div className={styles.crisp}>
        <GitHubCalendar
          username="hunterbastian"
          transformData={(data) => selectRecentMonths(data, 5)}
          showColorLegend={false}
          showTotalCount={false}
          blockSize={10}
          blockMargin={3}
          blockRadius={0}
          fontSize={10}
          theme={{
            light: ['#e5e5e5', '#c0c0c0', '#8a8a8a', '#555555', '#222222'],
            dark: ['#2a2a2a', '#444444', '#666666', '#999999', '#cccccc'],
          }}
        />
      </div>
    </div>
  )
}
