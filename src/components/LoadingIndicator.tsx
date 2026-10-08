import MichelangelusLettering from '@/components/typography/MichelangelusLettering'

interface LoadingIndicatorProps {
  fullscreen?: boolean
  branded?: boolean
  className?: string
}

export default function LoadingIndicator({
  fullscreen = false,
  branded = fullscreen,
  className = '',
}: LoadingIndicatorProps) {
  return (
    <div
      className={`${fullscreen ? 'portfolio-loading-indicator-screen' : 'portfolio-loading-indicator'} ${className}`.trim()}
      role="status"
    >
      <div className="portfolio-loading-indicator__content" aria-hidden="true">
        {branded ? (
          <div className="portfolio-loading-indicator__identity">
            <span className="portfolio-loading-indicator__name preserve-name-case"><MichelangelusLettering /></span>
            <span className="portfolio-loading-indicator__caption">Design &amp; development</span>
          </div>
        ) : null}
        <span className="portfolio-loading-indicator__line" />
      </div>
      <span className="sr-only">Loading</span>
    </div>
  )
}
