import {
  getPlaygroundMastheadMetrics,
  PLAYGROUND_MASTHEAD_KICKER,
  PLAYGROUND_MASTHEAD_SUMMARY_LABEL,
  PLAYGROUND_MASTHEAD_TITLE,
} from '@/lib/playground'

interface PlaygroundMastheadProps {
  projectCount: number
  archiveRange: string
}

export default function PlaygroundMasthead({ projectCount, archiveRange }: PlaygroundMastheadProps) {
  const metrics = getPlaygroundMastheadMetrics(projectCount, archiveRange)

  return (
    <div className="playground-masthead">
      <div className="min-w-0">
        <p className="playground-field-kicker">
          <span className="playground-status-dot" aria-hidden="true" />
          {PLAYGROUND_MASTHEAD_KICKER}
        </p>
        <h1 className="playground-field-title">{PLAYGROUND_MASTHEAD_TITLE}</h1>
      </div>

      <dl className="playground-metrics" aria-label={PLAYGROUND_MASTHEAD_SUMMARY_LABEL}>
        {metrics.map((metric) => (
          <div key={metric.label}>
            <dt>{metric.label}</dt>
            <dd>{metric.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
