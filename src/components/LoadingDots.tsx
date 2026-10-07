import { Ellipsis } from 'lucide-react'

interface LoadingDotsProps {
  fullscreen?: boolean
  className?: string
}

export default function LoadingDots({ fullscreen = false, className = '' }: LoadingDotsProps) {
  return (
    <div
      className={`${fullscreen ? 'portfolio-loading-dots-screen' : 'portfolio-loading-dots'} ${className}`.trim()}
      role="status"
    >
      <Ellipsis aria-hidden="true" className="portfolio-loading-dots__icon" size={48} />
      <span className="sr-only">Loading</span>
    </div>
  )
}
