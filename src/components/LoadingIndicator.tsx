import { LoaderCircle } from 'lucide-react'

interface LoadingIndicatorProps {
  fullscreen?: boolean
  className?: string
}

export default function LoadingIndicator({ fullscreen = false, className = '' }: LoadingIndicatorProps) {
  return (
    <div
      className={`${fullscreen ? 'portfolio-loading-indicator-screen' : 'portfolio-loading-indicator'} ${className}`.trim()}
      role="status"
    >
      <LoaderCircle aria-hidden="true" className="portfolio-loading-indicator__icon" size={34} strokeWidth={1.5} />
      <span className="sr-only">Loading</span>
    </div>
  )
}
