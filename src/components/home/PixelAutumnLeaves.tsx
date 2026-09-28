// Original autumn sprites: brown outlines, stepped shading, and tiny sunlit pixels.
// Each cell renders at an integer scale; no rotation or smoothing is needed.
const SPRITES = {
  maple: [
    '.......0........',
    '......030.......',
    '..0...0320..0...',
    '..030.0320.030..',
    '...03203200320..',
    '.0003323223320..',
    '032333222232000.',
    '.03222212222220.',
    '..032221222210..',
    '...0322122110...',
    '..03222122120...',
    '...000212000....',
    '......010.......',
    '......010.......',
    '.....010........',
    '......0.........',
  ],
  oval: [
    '..........00....',
    '........00320...',
    '......0033320...',
    '.....03332220...',
    '....033322210...',
    '...0333222120...',
    '..03332221210...',
    '..0322221210....',
    '..0322212110....',
    '..032212110.....',
    '...0212110......',
    '...012110.......',
    '...01000........',
    '..010...........',
    '..00............',
    '................',
  ],
  curled: [
    '................',
    '................',
    '.........000....',
    '.......003330...',
    '.....003332210..',
    '...003333222210.',
    '..0333222212210.',
    '.03222221112210.',
    '.03222110001210.',
    '..021110..0310..',
    '..01210....00...',
    '.01000..........',
    '..0.............',
    '................',
    '................',
    '................',
  ],
}

function spritePaths(pixels: string[]) {
  const paths = ['', '', '', '']
  pixels.forEach((row, y) => {
    Array.from(row).forEach((pixel, x) => {
      if (pixel !== '.') paths[Number(pixel)] += `M${x} ${y}h1v1h-1z`
    })
  })
  return paths
}

const spritePathsByShape = {
  maple: spritePaths(SPRITES.maple),
  oval: spritePaths(SPRITES.oval),
  curled: spritePaths(SPRITES.curled),
}

const LEAVES = [
  { tone: 'rust', shape: 'maple' },
  { tone: 'ochre', shape: 'oval' },
  { tone: 'olive', shape: 'curled' },
  { tone: 'ochre', shape: 'curled' },
  { tone: 'rust', shape: 'oval' },
  { tone: 'olive', shape: 'maple' },
  { tone: 'ochre', shape: 'maple' },
] as const

export function PixelAutumnLeaves() {
  return (
    <span className="footer-autumn-leaves" aria-hidden="true">
      {LEAVES.map(({ tone, shape }, index) => (
        <svg
          key={index}
          className={`footer-autumn-leaf footer-autumn-leaf--${tone}`}
          viewBox="0 0 16 16"
          width="32"
          height="32"
          focusable="false"
          shapeRendering="crispEdges"
        >
          <path d={spritePathsByShape[shape][0]} fill="var(--leaf-outline)" />
          <path d={spritePathsByShape[shape][1]} fill="var(--leaf-shadow)" />
          <path d={spritePathsByShape[shape][2]} fill="currentColor" />
          <path d={spritePathsByShape[shape][3]} fill="var(--leaf-highlight)" />
        </svg>
      ))}
    </span>
  )
}
