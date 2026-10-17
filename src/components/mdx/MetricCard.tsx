interface MetricCardProps {
  value: number | string
  label: string
  prefix?: string
  suffix?: string
}

/** Project facts must be readable before hydration and without scrolling. */
export default function MetricCard({ value, label, prefix = '', suffix = '' }: MetricCardProps) {
  return (
    <div className="inline-flex min-w-0 flex-col items-center bg-card px-3 py-5 text-center shadow-card-subtle sm:px-6">
      <span className="font-mono text-xl font-medium tracking-tight text-foreground tabular-nums sm:text-3xl">
        {prefix}{value}{suffix}
      </span>
      <span className="mt-1.5 font-inter text-xs font-normal leading-snug text-muted-foreground sm:text-sm">
        {label}
      </span>
    </div>
  )
}
