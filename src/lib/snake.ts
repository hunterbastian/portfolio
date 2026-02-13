export type SnakeDirection = 'up' | 'down' | 'left' | 'right'

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

export function isOppositeDirection(current: SnakeDirection, next: SnakeDirection): boolean {
  return (
    (current === 'up' && next === 'down') ||
    (current === 'down' && next === 'up') ||
    (current === 'left' && next === 'right') ||
    (current === 'right' && next === 'left')
  )
}

function normalizeConfig(config?: Partial<SnakeConfig>): SnakeConfig {
  return {
    width: Math.max(4, Math.floor(config?.width ?? DEFAULT_CONFIG.width)),
    height: Math.max(4, Math.floor(config?.height ?? DEFAULT_CONFIG.height)),
    initialLength: Math.max(2, Math.floor(config?.initialLength ?? DEFAULT_CONFIG.initialLength)),
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
  const occupied = new Set(snake.map((segment) => `${segment.x},${segment.y}`))
  const openCells: SnakePoint[] = []

  for (let y = 0; y < config.height; y += 1) {
    for (let x = 0; x < config.width; x += 1) {
      const key = `${x},${y}`
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
