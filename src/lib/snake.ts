export type SnakeDirection = 'up' | 'down' | 'left' | 'right'

export const SNAKE_TICK_MS = 120
export const SNAKE_OPEN_BUTTON_LABEL = 'Open Snake mini game'
export const SNAKE_PIXEL_ICON = ['00100', '01110', '11111', '01110', '00100']
export const SNAKE_FOOD_CELL_STYLE = {
  backgroundImage:
    'linear-gradient(45deg, #000 25%, #fff 25%, #fff 50%, #000 50%, #000 75%, #fff 75%, #fff 100%)',
  backgroundSize: '4px 4px',
}
export const SNAKE_DIALOG_LABEL = 'Snake game'
export const SNAKE_PAUSE_LABEL = 'PAUSE'
export const SNAKE_RESUME_LABEL = 'RESUME'
export const SNAKE_RESTART_LABEL = 'RESTART'
export const SNAKE_CLOSE_LABEL = 'CLOSE'
export const SNAKE_ARROWS_HINT = 'ARROWS/WASD'
export const SNAKE_SPACE_HINT = 'SPACE PAUSE'
export const SNAKE_GAME_OVER_LABEL = 'GAME OVER. PRESS RESTART OR R.'
export const SNAKE_CONTROL_LABELS: Record<SnakeDirection, string> = {
  up: 'UP',
  down: 'DOWN',
  left: 'LEFT',
  right: 'RIGHT',
}

export const SNAKE_OPEN_BUTTON_BASE_CLASS_NAME =
  'group inline-flex h-10 w-10 origin-center touch-manipulation items-center justify-center border border-current transition-transform duration-150 hover:scale-110 active:translate-y-0 active:scale-[0.96]'
export const SNAKE_OPEN_BUTTON_ACTIVE_CLASS_NAME = 'bg-background text-foreground'
export const SNAKE_OPEN_BUTTON_INACTIVE_CLASS_NAME = 'bg-foreground text-background'
export const SNAKE_PIXEL_ICON_GRID_CLASS_NAME = 'grid grid-cols-5 gap-[1px]'
export const SNAKE_PIXEL_ICON_CELL_BASE_CLASS_NAME = 'h-[2px] w-[2px]'
export const SNAKE_PIXEL_ICON_CELL_ACTIVE_CLASS_NAME = 'bg-current'
export const SNAKE_PIXEL_ICON_CELL_INACTIVE_CLASS_NAME = 'bg-transparent'
export const SNAKE_MODAL_BACKDROP_CLASS_NAME =
  'fixed inset-0 z-[70] flex items-center justify-center bg-black/60 px-4 py-6'
export const SNAKE_DIALOG_CLASS_NAME =
  'w-full max-w-sm border-2 border-black bg-white p-4 text-black shadow-[8px_8px_0_0_#000000]'
export const SNAKE_DIALOG_HEADER_CLASS_NAME = 'mb-3 flex items-center justify-between gap-3'
export const SNAKE_SCORE_CLASS_NAME = 'font-mono text-[11px] tracking-[0.12em]'
export const SNAKE_DIALOG_ACTION_BUTTON_CLASS_NAME =
  'border border-black px-2 py-1 font-mono text-[10px] tracking-[0.1em] transition-colors hover:bg-black hover:text-white'
export const SNAKE_BOARD_CLASS_NAME = 'grid w-[min(84vw,18rem)] border-2 border-black bg-white'
export const SNAKE_ACTION_ROW_CLASS_NAME = 'mt-3 flex flex-wrap items-center gap-2'
export const SNAKE_HINT_CLASS_NAME = 'font-mono text-[10px] tracking-[0.1em] text-black/75'
export const SNAKE_TOUCH_CONTROLS_CLASS_NAME = 'mt-3 flex flex-col items-center gap-1 sm:hidden'
export const SNAKE_TOUCH_CONTROLS_ROW_CLASS_NAME = 'flex items-center gap-1'
export const SNAKE_CONTROL_BUTTON_CLASS_NAME =
  'h-9 min-w-9 border border-black bg-white px-3 text-[10px] font-mono tracking-[0.1em] text-black transition-colors hover:bg-black hover:text-white active:bg-black active:text-white touch-manipulation'
export const SNAKE_GAME_OVER_CLASS_NAME =
  'mt-3 border border-black bg-black px-2 py-1 text-center font-mono text-[10px] tracking-[0.12em] text-white'

export interface SnakePoint {
  x: number
  y: number
}

export interface SnakeConfig {
  width: number
  height: number
  initialLength: number
}

export interface SnakeGameState {
  config: SnakeConfig
  snake: SnakePoint[]
  direction: SnakeDirection
  food: SnakePoint | null
  score: number
  tick: number
  gameOver: boolean
}

export type SnakeGameMode = 'closed' | 'game_over' | 'paused' | 'playing'

export type SnakeKeyboardAction =
  | { type: 'close' }
  | { type: 'direction'; direction: SnakeDirection }
  | { type: 'restart' }
  | { type: 'toggle_pause' }

export interface SnakeGameSnapshot {
  mode: SnakeGameMode
  coordinateSystem: {
    origin: 'top-left'
    xAxis: 'right'
    yAxis: 'down'
  }
  board: {
    width: number
    height: number
  }
  snake: SnakePoint[]
  food: SnakePoint | null
  score: number
  direction: SnakeDirection
  tick: number
}

export interface SnakeBoardCell {
  key: string
  x: number
  y: number
  isSnake: boolean
  isFood: boolean
}

export interface SnakeRuntimeState {
  isOpen: boolean
  isPaused: boolean
}

type RandomFn = () => number

const DEFAULT_CONFIG: SnakeConfig = {
  width: 16,
  height: 16,
  initialLength: 3,
}

const DIRECTION_VECTORS: Record<SnakeDirection, SnakePoint> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
}

export function arePointsEqual(a: SnakePoint, b: SnakePoint): boolean {
  return a.x === b.x && a.y === b.y
}

export function getSnakePointKey(point: SnakePoint): string {
  return `${point.x},${point.y}`
}

export function isOppositeDirection(current: SnakeDirection, next: SnakeDirection): boolean {
  return (
    (current === 'up' && next === 'down') ||
    (current === 'down' && next === 'up') ||
    (current === 'left' && next === 'right') ||
    (current === 'right' && next === 'left')
  )
}

function normalizeConfig(config?: Partial<SnakeConfig>): SnakeConfig {
  const width = Math.max(4, Math.floor(config?.width ?? DEFAULT_CONFIG.width))
  const height = Math.max(4, Math.floor(config?.height ?? DEFAULT_CONFIG.height))

  return {
    width,
    height,
    initialLength: Math.min(width, Math.max(2, Math.floor(config?.initialLength ?? DEFAULT_CONFIG.initialLength))),
  }
}

function createInitialSnake(config: SnakeConfig): SnakePoint[] {
  const headX = Math.max(config.initialLength - 1, Math.floor(config.width / 2))
  const headY = Math.floor(config.height / 2)
  const snake: SnakePoint[] = []

  for (let offset = 0; offset < config.initialLength; offset += 1) {
    snake.push({ x: headX - offset, y: headY })
  }

  return snake
}

function randomIndex(length: number, random: RandomFn): number {
  const value = Math.min(0.999999, Math.max(0, random()))
  return Math.floor(value * length)
}

export function placeFood(snake: SnakePoint[], config: SnakeConfig, random: RandomFn = Math.random): SnakePoint | null {
  const occupied = new Set(snake.map(getSnakePointKey))
  const openCells: SnakePoint[] = []

  for (let y = 0; y < config.height; y += 1) {
    for (let x = 0; x < config.width; x += 1) {
      const key = getSnakePointKey({ x, y })
      if (!occupied.has(key)) {
        openCells.push({ x, y })
      }
    }
  }

  if (openCells.length === 0) {
    return null
  }

  return openCells[randomIndex(openCells.length, random)]
}

export function createInitialSnakeGame(
  random: RandomFn = Math.random,
  config?: Partial<SnakeConfig>,
): SnakeGameState {
  const normalizedConfig = normalizeConfig(config)
  const snake = createInitialSnake(normalizedConfig)

  return {
    config: normalizedConfig,
    snake,
    direction: 'right',
    food: placeFood(snake, normalizedConfig, random),
    score: 0,
    tick: 0,
    gameOver: false,
  }
}

export function setSnakeDirection(state: SnakeGameState, nextDirection: SnakeDirection): SnakeGameState {
  if (isOppositeDirection(state.direction, nextDirection)) {
    return state
  }

  if (state.direction === nextDirection) {
    return state
  }

  return {
    ...state,
    direction: nextDirection,
  }
}

function isOutOfBounds(point: SnakePoint, config: SnakeConfig): boolean {
  return point.x < 0 || point.y < 0 || point.x >= config.width || point.y >= config.height
}

export function advanceSnakeGame(state: SnakeGameState, random: RandomFn = Math.random): SnakeGameState {
  if (state.gameOver || state.food == null) {
    return {
      ...state,
      gameOver: true,
    }
  }

  const vector = DIRECTION_VECTORS[state.direction]
  const currentHead = state.snake[0]
  const nextHead: SnakePoint = {
    x: currentHead.x + vector.x,
    y: currentHead.y + vector.y,
  }
  const willGrow = arePointsEqual(nextHead, state.food)
  const bodyToCheck = willGrow ? state.snake : state.snake.slice(0, -1)
  const hitsBody = bodyToCheck.some((segment) => arePointsEqual(segment, nextHead))

  if (isOutOfBounds(nextHead, state.config) || hitsBody) {
    return {
      ...state,
      tick: state.tick + 1,
      gameOver: true,
    }
  }

  const nextSnake = willGrow ? [nextHead, ...state.snake] : [nextHead, ...state.snake.slice(0, -1)]
  const nextFood = willGrow ? placeFood(nextSnake, state.config, random) : state.food
  const nextScore = willGrow ? state.score + 1 : state.score
  const nextGameOver = nextFood == null

  return {
    ...state,
    snake: nextSnake,
    food: nextFood,
    score: nextScore,
    tick: state.tick + 1,
    gameOver: nextGameOver,
  }
}

export function restartSnakeGame(state: SnakeGameState, random: RandomFn = Math.random): SnakeGameState {
  return createInitialSnakeGame(random, state.config)
}

export function getSnakeGameMode(state: SnakeGameState, isOpen: boolean, isPaused: boolean): SnakeGameMode {
  if (!isOpen) return 'closed'
  if (state.gameOver) return 'game_over'
  if (isPaused) return 'paused'
  return 'playing'
}

export function createSnakeGameSnapshot(
  state: SnakeGameState,
  isOpen: boolean,
  isPaused: boolean,
): SnakeGameSnapshot {
  return {
    mode: getSnakeGameMode(state, isOpen, isPaused),
    coordinateSystem: { origin: 'top-left', xAxis: 'right', yAxis: 'down' },
    board: { width: state.config.width, height: state.config.height },
    snake: state.snake,
    food: state.food,
    score: state.score,
    direction: state.direction,
    tick: state.tick,
  }
}

export function serializeSnakeGameSnapshot(state: SnakeGameState, isOpen: boolean, isPaused: boolean): string {
  return JSON.stringify(createSnakeGameSnapshot(state, isOpen, isPaused))
}

export function getSnakeBoardCells(state: Pick<SnakeGameState, 'config' | 'food' | 'snake'>): SnakeBoardCell[] {
  const occupied = new Set(state.snake.map(getSnakePointKey))
  const cells: SnakeBoardCell[] = []

  for (let y = 0; y < state.config.height; y += 1) {
    for (let x = 0; x < state.config.width; x += 1) {
      const key = getSnakePointKey({ x, y })

      cells.push({
        key,
        x,
        y,
        isSnake: occupied.has(key),
        isFood: state.food != null && arePointsEqual(state.food, { x, y }),
      })
    }
  }

  return cells
}

export function getSnakeBoardCellClassName(cell: Pick<SnakeBoardCell, 'isSnake'>): string {
  return `aspect-square border border-black/5 ${cell.isSnake ? 'bg-black' : 'bg-white'}`
}

export function getSnakeBoardCellStyle(
  cell: Pick<SnakeBoardCell, 'isFood'>,
): typeof SNAKE_FOOD_CELL_STYLE | undefined {
  return cell.isFood ? SNAKE_FOOD_CELL_STYLE : undefined
}

export function getSnakeOpenButtonClassName(isOpen: boolean): string {
  return `${SNAKE_OPEN_BUTTON_BASE_CLASS_NAME} ${
    isOpen ? SNAKE_OPEN_BUTTON_ACTIVE_CLASS_NAME : SNAKE_OPEN_BUTTON_INACTIVE_CLASS_NAME
  }`
}

export function getSnakePixelIconCellClassName(pixel: string): string {
  return `${SNAKE_PIXEL_ICON_CELL_BASE_CLASS_NAME} ${
    pixel === '1' ? SNAKE_PIXEL_ICON_CELL_ACTIVE_CLASS_NAME : SNAKE_PIXEL_ICON_CELL_INACTIVE_CLASS_NAME
  }`
}

export function getSnakeMoveButtonAriaLabel(direction: SnakeDirection) {
  return `Move ${direction}`
}

export function getSnakeBoardGridStyle(width: number): { gridTemplateColumns: string } {
  return {
    gridTemplateColumns: `repeat(${width}, minmax(0, 1fr))`,
  }
}

export function getSnakeScoreLabel(score: number) {
  return `SNAKE // SCORE ${score}`
}

export function getSnakePauseButtonLabel(isPaused: boolean): typeof SNAKE_PAUSE_LABEL | typeof SNAKE_RESUME_LABEL {
  return isPaused ? SNAKE_RESUME_LABEL : SNAKE_PAUSE_LABEL
}

export function advanceSnakeGameByElapsedTime(
  state: SnakeGameState,
  elapsedMs: number,
  tickMs: number,
  random: RandomFn = Math.random,
): SnakeGameState {
  const steps = Math.max(1, Math.round(elapsedMs / tickMs))
  let nextGame = state

  for (let step = 0; step < steps; step += 1) {
    if (nextGame.gameOver) {
      break
    }
    nextGame = advanceSnakeGame(nextGame, random)
  }

  return nextGame
}

export function shouldAdvanceSnakeGame({
  isOpen,
  isPaused,
}: SnakeRuntimeState): boolean {
  return isOpen && !isPaused
}

export function advanceSnakeGameIfPlaying(
  state: SnakeGameState,
  runtime: SnakeRuntimeState,
  random: RandomFn = Math.random,
): SnakeGameState {
  if (!shouldAdvanceSnakeGame(runtime) || state.gameOver) {
    return state
  }

  return advanceSnakeGame(state, random)
}

export function advanceSnakeGameByElapsedTimeIfPlaying(
  state: SnakeGameState,
  elapsedMs: number,
  tickMs: number,
  runtime: SnakeRuntimeState,
  random: RandomFn = Math.random,
): SnakeGameState {
  if (!shouldAdvanceSnakeGame(runtime) || state.gameOver) {
    return state
  }

  return advanceSnakeGameByElapsedTime(state, elapsedMs, tickMs, random)
}

export function directionFromKey(key: string): SnakeDirection | null {
  switch (key.toLowerCase()) {
    case 'arrowup':
    case 'w':
      return 'up'
    case 'arrowdown':
    case 's':
      return 'down'
    case 'arrowleft':
    case 'a':
      return 'left'
    case 'arrowright':
    case 'd':
      return 'right'
    default:
      return null
  }
}

export function getSnakeKeyboardAction(key: string): SnakeKeyboardAction | null {
  if (key === 'Escape') return { type: 'close' }
  if (key === ' ') return { type: 'toggle_pause' }
  if (key.toLowerCase() === 'r') return { type: 'restart' }

  const direction = directionFromKey(key)

  return direction ? { type: 'direction', direction } : null
}
