'use client'

interface ArcSigilLoaderProps {
  size?: number
  className?: string
}

export default function ArcSigilLoader({ size = 96, className = '' }: ArcSigilLoaderProps) {
  const pixelSize = `${size}px`

  return (
    <div className={`flex items-center justify-center ${className}`} aria-label="Loading">
      <div className="relative" style={{ width: pixelSize, height: pixelSize }}>
        <svg
          viewBox="0 0 120 120"
          className="absolute inset-0 text-foreground/25 [animation:spin_16s_linear_infinite_reverse]"
          fill="none"
          stroke="currentColor"
        >
          <circle cx="60" cy="60" r="44" strokeWidth="0.9" />
          <circle cx="60" cy="60" r="30" strokeWidth="0.7" opacity="0.45" />
          <path d="M24 42l72 36" strokeWidth="0.6" opacity="0.2" />
          <path d="M20 66l80-12" strokeWidth="0.6" opacity="0.16" />
        </svg>

        <svg
          viewBox="0 0 120 120"
          className="absolute inset-0 text-primary/75 [animation:spin_2.8s_linear_infinite]"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
        >
          <circle cx="60" cy="60" r="37" strokeWidth="1.2" strokeDasharray="34 198" strokeDashoffset="8" />
        </svg>

        <svg
          viewBox="0 0 120 120"
          className="absolute inset-0 text-foreground/75 [animation:spin_3.4s_linear_infinite_reverse]"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
        >
          <line x1="60" y1="30" x2="60" y2="40" strokeWidth="1.2" />
        </svg>

        <div className="absolute inset-0 [animation:spin_6s_linear_infinite]">
          <span className="absolute left-1/2 top-[16px] h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-foreground/80" />
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <span className="h-2 w-2 rounded-full bg-foreground/80 [animation:pulse_900ms_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  )
}
