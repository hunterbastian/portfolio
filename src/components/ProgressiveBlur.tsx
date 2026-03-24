'use client'

/**
 * Progressive blur — a fixed gradient of increasing backdrop-blur
 * at the bottom of the viewport. Each layer covers a vertical slice
 * with a linear-gradient mask so the blur builds smoothly.
 */

const BLUR_LAYERS = [
  { blur: 0.8, start: 0, end: 20 },
  { blur: 1.6, start: 15, end: 40 },
  { blur: 3.2, start: 35, end: 60 },
  { blur: 6.4, start: 55, end: 80 },
  { blur: 9.6, start: 75, end: 100 },
]

export default function ProgressiveBlur() {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-30"
      style={{ height: '120px' }}
      aria-hidden
    >
      {BLUR_LAYERS.map(({ blur, start, end }, i) => (
        <div
          key={i}
          className="absolute inset-0"
          style={{
            backdropFilter: `blur(${blur}px)`,
            WebkitBackdropFilter: `blur(${blur}px)`,
            maskImage: `linear-gradient(to bottom, transparent ${start}%, black ${end}%)`,
            WebkitMaskImage: `linear-gradient(to bottom, transparent ${start}%, black ${end}%)`,
          }}
        />
      ))}
    </div>
  )
}
