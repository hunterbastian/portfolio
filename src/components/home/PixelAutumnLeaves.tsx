// Small decorative sprites, drawn on an integer grid so their edges stay crisp.
const LEAF_PIXELS = [
  '.......1.......',
  '......111......',
  '..1...111...1..',
  '..11.11111.11..',
  '...111111111...',
  '111111111111111',
  '.1111111111111.',
  '..11111111111..',
  '...111111111...',
  '..11111111111..',
  '....1111111....',
  '......11.......',
  '......11.......',
  '.....11........',
]

const paths = ['', '', '']
LEAF_PIXELS.forEach((row, y) => {
  Array.from(row).forEach((pixel, x) => {
    if (pixel !== '1') return
    const shade = x === 7 || y > 10 ? 2 : (x + y) % 3 === 0 ? 1 : 0
    paths[shade] += `M${x} ${y}h1v1h-1z`
  })
})

export function PixelAutumnLeaves() {
  return (
    <span className="footer-autumn-leaves" aria-hidden="true">
      {['rust', 'ochre', 'olive', 'ochre', 'rust', 'olive', 'ochre'].map((tone, index) => (
        <svg
          key={index}
          className={`footer-autumn-leaf footer-autumn-leaf--${tone}`}
          viewBox="0 0 15 14"
          width="30"
          height="28"
          focusable="false"
          shapeRendering="crispEdges"
        >
          <path d={paths[0]} fill="currentColor" />
          <path d={paths[1]} fill="var(--leaf-highlight)" />
          <path d={paths[2]} fill="var(--leaf-shadow)" />
        </svg>
      ))}
    </span>
  )
}
