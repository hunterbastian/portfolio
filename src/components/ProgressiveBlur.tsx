/**
 * Fixed top viewport blur. Each masked layer increases the backdrop blur
 * toward the top edge, producing a smooth optical falloff.
 */

const BLUR_LAYERS = [
  { blur: 0.7, start: 0, end: 20 },
  { blur: 1.4, start: 15, end: 40 },
  { blur: 2.9, start: 35, end: 60 },
  { blur: 5.8, start: 55, end: 80 },
  { blur: 8.6, start: 75, end: 100 },
]

export default function ProgressiveBlur() {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-30 h-[4.75rem] sm:h-[5.625rem]"
      aria-hidden="true"
    >
      {BLUR_LAYERS.map(({ blur, start, end }, i) => (
        <div
          key={i}
          className="absolute inset-0"
          style={{
            backdropFilter: `blur(${blur}px)`,
            WebkitBackdropFilter: `blur(${blur}px)`,
            maskImage: `linear-gradient(to top, transparent ${start}%, black ${end}%)`,
            WebkitMaskImage: `linear-gradient(to top, transparent ${start}%, black ${end}%)`,
          }}
        />
      ))}
    </div>
  )
}
