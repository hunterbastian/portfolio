import assert from 'node:assert/strict'
import test from 'node:test'

import {
  advanceSnakeGameByElapsedTime,
  advanceSnakeGameByElapsedTimeIfPlaying,
  advanceSnakeGame,
  advanceSnakeGameIfPlaying,
  arePointsEqual,
  createSnakeGameSnapshot,
  createInitialSnakeGame,
  directionFromKey,
  getSnakeBoardCellClassName,
  getSnakeBoardCellStyle,
  getSnakeBoardGridStyle,
  getSnakeKeyboardAction,
  getSnakeBoardCells,
  getSnakeGameMode,
  getSnakeMoveButtonAriaLabel,
  getSnakeOpenButtonClassName,
  getSnakePauseButtonLabel,
  getSnakePixelIconCellClassName,
  getSnakePointKey,
  getSnakeScoreLabel,
  isOppositeDirection,
  placeFood,
  SNAKE_ACTION_ROW_CLASS_NAME,
  SNAKE_ARROWS_HINT,
  SNAKE_BOARD_CLASS_NAME,
  SNAKE_CLOSE_LABEL,
  SNAKE_CONTROL_BUTTON_CLASS_NAME,
  SNAKE_CONTROL_LABELS,
  SNAKE_DIALOG_ACTION_BUTTON_CLASS_NAME,
  SNAKE_DIALOG_CLASS_NAME,
  SNAKE_DIALOG_HEADER_CLASS_NAME,
  SNAKE_DIALOG_LABEL,
  SNAKE_FOOD_CELL_STYLE,
  SNAKE_GAME_OVER_CLASS_NAME,
  SNAKE_GAME_OVER_LABEL,
  SNAKE_HINT_CLASS_NAME,
  SNAKE_MODAL_BACKDROP_CLASS_NAME,
  SNAKE_OPEN_BUTTON_LABEL,
  SNAKE_PIXEL_ICON_CELL_ACTIVE_CLASS_NAME,
  SNAKE_PIXEL_ICON_CELL_BASE_CLASS_NAME,
  SNAKE_PIXEL_ICON_CELL_INACTIVE_CLASS_NAME,
  SNAKE_PIXEL_ICON_GRID_CLASS_NAME,
  SNAKE_PAUSE_LABEL,
  SNAKE_PIXEL_ICON,
  SNAKE_RESTART_LABEL,
  SNAKE_RESUME_LABEL,
  SNAKE_SCORE_CLASS_NAME,
  SNAKE_SPACE_HINT,
  SNAKE_TICK_MS,
  SNAKE_TOUCH_CONTROLS_CLASS_NAME,
  SNAKE_TOUCH_CONTROLS_ROW_CLASS_NAME,
  serializeSnakeGameSnapshot,
  setSnakeDirection,
  shouldAdvanceSnakeGame,
} from './snake.ts'

test('createInitialSnakeGame creates a valid initial state', () => {
  const state = createInitialSnakeGame(() => 0, { width: 8, height: 8, initialLength: 3 })

  assert.equal(state.snake.length, 3)
  assert.equal(state.direction, 'right')
  assert.equal(state.score, 0)
  assert.equal(state.gameOver, false)
  assert.notEqual(state.food, null)
  assert.equal(state.snake.some((segment) => arePointsEqual(segment, state.food!)), false)
})

test('snake UI constants preserve modal trigger and timing contracts', () => {
  assert.equal(SNAKE_TICK_MS, 120)
  assert.equal(SNAKE_OPEN_BUTTON_LABEL, 'Open Snake mini game')
  assert.deepEqual(SNAKE_PIXEL_ICON, ['00100', '01110', '11111', '01110', '00100'])
  assert.equal(SNAKE_DIALOG_LABEL, 'Snake game')
  assert.equal(SNAKE_CLOSE_LABEL, 'CLOSE')
  assert.equal(SNAKE_RESTART_LABEL, 'RESTART')
  assert.equal(SNAKE_ARROWS_HINT, 'ARROWS/WASD')
  assert.equal(SNAKE_SPACE_HINT, 'SPACE PAUSE')
  assert.equal(SNAKE_GAME_OVER_LABEL, 'GAME OVER. PRESS RESTART OR R.')
})

test('createInitialSnakeGame keeps all initial segments in bounds for oversized lengths', () => {
  const state = createInitialSnakeGame(() => 0, { width: 4, height: 6, initialLength: 10 })

  assert.equal(
    state.snake.every(
      (segment) =>
        segment.x >= 0 &&
        segment.y >= 0 &&
        segment.x < state.config.width &&
        segment.y < state.config.height,
    ),
    true,
  )
})

test('setSnakeDirection ignores opposite turns', () => {
  const state = createInitialSnakeGame(() => 0, { width: 8, height: 8, initialLength: 3 })
  const attemptedReverse = setSnakeDirection(state, 'left')

  assert.equal(attemptedReverse.direction, 'right')
})

test('advanceSnakeGame moves and grows when food is eaten', () => {
  const state = {
    config: { width: 6, height: 6, initialLength: 3 },
    snake: [
      { x: 2, y: 2 },
      { x: 1, y: 2 },
      { x: 0, y: 2 },
    ],
    direction: 'right' as const,
    food: { x: 3, y: 2 },
    score: 0,
    tick: 0,
    gameOver: false,
  }

  const next = advanceSnakeGame(state, () => 0)

  assert.deepEqual(next.snake[0], { x: 3, y: 2 })
  assert.equal(next.snake.length, 4)
  assert.equal(next.score, 1)
  assert.equal(next.tick, 1)
  assert.notEqual(next.food, null)
  assert.equal(next.snake.some((segment) => arePointsEqual(segment, next.food!)), false)
})

test('advanceSnakeGame marks game over on wall collision', () => {
  const state = {
    config: { width: 6, height: 6, initialLength: 3 },
    snake: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
    ],
    direction: 'left' as const,
    food: { x: 5, y: 5 },
    score: 0,
    tick: 0,
    gameOver: false,
  }

  const next = advanceSnakeGame(state)

  assert.equal(next.gameOver, true)
  assert.equal(next.tick, 1)
})

test('advanceSnakeGame marks game over on body collision', () => {
  const state = {
    config: { width: 6, height: 6, initialLength: 4 },
    snake: [
      { x: 2, y: 2 },
      { x: 2, y: 3 },
      { x: 1, y: 3 },
      { x: 1, y: 2 },
    ],
    direction: 'down' as const,
    food: { x: 5, y: 5 },
    score: 0,
    tick: 0,
    gameOver: false,
  }

  const next = advanceSnakeGame(state)

  assert.equal(next.gameOver, true)
})

test('placeFood returns null when board is full', () => {
  const config = { width: 2, height: 2, initialLength: 2 }
  const snake = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
  ]

  const food = placeFood(snake, config, () => 0)

  assert.equal(food, null)
})

test('getSnakePointKey serializes board coordinates consistently', () => {
  assert.equal(getSnakePointKey({ x: 0, y: 0 }), '0,0')
  assert.equal(getSnakePointKey({ x: 12, y: 4 }), '12,4')
})

test('getSnakeBoardCells exposes render-ready board cell state', () => {
  const state = {
    config: { width: 4, height: 3, initialLength: 3 },
    snake: [
      { x: 2, y: 1 },
      { x: 1, y: 1 },
      { x: 0, y: 1 },
    ],
    direction: 'right' as const,
    food: { x: 3, y: 2 },
    score: 0,
    tick: 0,
    gameOver: false,
  }

  const cells = getSnakeBoardCells(state)

  assert.equal(cells.length, 12)
  assert.deepEqual(cells[0], { key: '0,0', x: 0, y: 0, isSnake: false, isFood: false })
  assert.deepEqual(cells[6], { key: '2,1', x: 2, y: 1, isSnake: true, isFood: false })
  assert.deepEqual(cells.at(-1), { key: '3,2', x: 3, y: 2, isSnake: false, isFood: true })
})

test('snake board cell UI helpers preserve class and food style contracts', () => {
  assert.equal(getSnakeBoardCellClassName({ isSnake: true }), 'aspect-square border border-black/5 bg-black')
  assert.equal(getSnakeBoardCellClassName({ isSnake: false }), 'aspect-square border border-black/5 bg-white')
  assert.deepEqual(getSnakeBoardCellStyle({ isFood: true }), SNAKE_FOOD_CELL_STYLE)
  assert.equal(getSnakeBoardCellStyle({ isFood: false }), undefined)
  assert.match(SNAKE_FOOD_CELL_STYLE.backgroundImage, /linear-gradient/)
  assert.equal(SNAKE_FOOD_CELL_STYLE.backgroundSize, '4px 4px')
})

test('snake modal chrome helpers preserve class contracts', () => {
  assert.match(getSnakeOpenButtonClassName(false), /bg-foreground text-background/)
  assert.match(getSnakeOpenButtonClassName(true), /bg-background text-foreground/)
  assert.match(getSnakeOpenButtonClassName(true), /active:scale-\[0\.96\]/)
  assert.match(SNAKE_MODAL_BACKDROP_CLASS_NAME, /fixed inset-0/)
  assert.match(SNAKE_DIALOG_CLASS_NAME, /shadow-\[8px_8px_0_0_#000000\]/)
  assert.match(SNAKE_DIALOG_HEADER_CLASS_NAME, /justify-between/)
  assert.match(SNAKE_DIALOG_ACTION_BUTTON_CLASS_NAME, /hover:bg-black/)
  assert.match(SNAKE_BOARD_CLASS_NAME, /w-\[min\(84vw,18rem\)\]/)
  assert.match(SNAKE_ACTION_ROW_CLASS_NAME, /flex flex-wrap/)
  assert.match(SNAKE_HINT_CLASS_NAME, /text-black\/75/)
  assert.match(SNAKE_TOUCH_CONTROLS_CLASS_NAME, /sm:hidden/)
  assert.match(SNAKE_TOUCH_CONTROLS_ROW_CLASS_NAME, /items-center/)
  assert.match(SNAKE_CONTROL_BUTTON_CLASS_NAME, /min-w-9/)
  assert.match(SNAKE_GAME_OVER_CLASS_NAME, /text-center/)
  assert.equal(SNAKE_SCORE_CLASS_NAME, 'font-mono text-[11px] tracking-[0.12em]')
})

test('snake icon, score, and control helpers preserve render state', () => {
  assert.equal(SNAKE_PIXEL_ICON_GRID_CLASS_NAME, 'grid grid-cols-5 gap-[1px]')
  assert.equal(SNAKE_PIXEL_ICON_CELL_BASE_CLASS_NAME, 'h-[2px] w-[2px]')
  assert.equal(SNAKE_PIXEL_ICON_CELL_ACTIVE_CLASS_NAME, 'bg-current')
  assert.equal(SNAKE_PIXEL_ICON_CELL_INACTIVE_CLASS_NAME, 'bg-transparent')
  assert.equal(getSnakePixelIconCellClassName('1'), 'h-[2px] w-[2px] bg-current')
  assert.equal(getSnakePixelIconCellClassName('0'), 'h-[2px] w-[2px] bg-transparent')
  assert.equal(getSnakePixelIconCellClassName('x'), 'h-[2px] w-[2px] bg-transparent')
  assert.deepEqual(SNAKE_CONTROL_LABELS, {
    up: 'UP',
    down: 'DOWN',
    left: 'LEFT',
    right: 'RIGHT',
  })
  assert.equal(getSnakeMoveButtonAriaLabel('left'), 'Move left')
  assert.deepEqual(getSnakeBoardGridStyle(16), {
    gridTemplateColumns: 'repeat(16, minmax(0, 1fr))',
  })
  assert.equal(getSnakeScoreLabel(7), 'SNAKE // SCORE 7')
})

test('snake pause label helper mirrors paused state copy', () => {
  assert.equal(getSnakePauseButtonLabel(false), SNAKE_PAUSE_LABEL)
  assert.equal(getSnakePauseButtonLabel(true), SNAKE_RESUME_LABEL)
})

test('isOppositeDirection identifies opposite directions', () => {
  assert.equal(isOppositeDirection('up', 'down'), true)
  assert.equal(isOppositeDirection('up', 'left'), false)
})

test('snake keyboard helpers map modal shortcuts and movement keys', () => {
  assert.equal(directionFromKey('w'), 'up')
  assert.equal(directionFromKey('ArrowRight'), 'right')
  assert.deepEqual(getSnakeKeyboardAction('Escape'), { type: 'close' })
  assert.deepEqual(getSnakeKeyboardAction(' '), { type: 'toggle_pause' })
  assert.deepEqual(getSnakeKeyboardAction('R'), { type: 'restart' })
  assert.deepEqual(getSnakeKeyboardAction('a'), { type: 'direction', direction: 'left' })
  assert.equal(getSnakeKeyboardAction('x'), null)
})

test('snake game snapshot helpers expose stable test harness state', () => {
  const state = createInitialSnakeGame(() => 0, { width: 8, height: 8, initialLength: 3 })

  assert.equal(getSnakeGameMode(state, false, false), 'closed')
  assert.equal(getSnakeGameMode(state, true, true), 'paused')

  const snapshot = createSnakeGameSnapshot(state, true, false)
  assert.deepEqual(snapshot.coordinateSystem, { origin: 'top-left', xAxis: 'right', yAxis: 'down' })
  assert.deepEqual(snapshot.board, { width: 8, height: 8 })
  assert.equal(snapshot.mode, 'playing')

  assert.deepEqual(JSON.parse(serializeSnakeGameSnapshot(state, true, false)), snapshot)
})

test('advanceSnakeGameByElapsedTime advances by rounded tick count and stops at game over', () => {
  const state = {
    config: { width: 6, height: 6, initialLength: 3 },
    snake: [
      { x: 3, y: 2 },
      { x: 2, y: 2 },
      { x: 1, y: 2 },
    ],
    direction: 'right' as const,
    food: { x: 0, y: 0 },
    score: 0,
    tick: 0,
    gameOver: false,
  }

  const next = advanceSnakeGameByElapsedTime(state, 240, 120)
  assert.equal(next.tick, 2)
  assert.equal(next.gameOver, false)
  assert.deepEqual(next.snake[0], { x: 5, y: 2 })

  const afterCollision = advanceSnakeGameByElapsedTime(next, 360, 120)
  assert.equal(afterCollision.gameOver, true)
  assert.equal(afterCollision.tick, 3)
})

test('snake runtime helpers advance only while the modal is actively playing', () => {
  const state = {
    config: { width: 6, height: 6, initialLength: 3 },
    snake: [
      { x: 3, y: 2 },
      { x: 2, y: 2 },
      { x: 1, y: 2 },
    ],
    direction: 'right' as const,
    food: { x: 0, y: 0 },
    score: 0,
    tick: 0,
    gameOver: false,
  }

  assert.equal(shouldAdvanceSnakeGame({ isOpen: false, isPaused: false }), false)
  assert.equal(shouldAdvanceSnakeGame({ isOpen: true, isPaused: true }), false)
  assert.equal(shouldAdvanceSnakeGame({ isOpen: true, isPaused: false }), true)
  assert.equal(advanceSnakeGameIfPlaying(state, { isOpen: false, isPaused: false }), state)
  assert.equal(advanceSnakeGameIfPlaying(state, { isOpen: true, isPaused: true }), state)
  assert.deepEqual(advanceSnakeGameIfPlaying(state, { isOpen: true, isPaused: false }).snake[0], { x: 4, y: 2 })
  assert.equal(advanceSnakeGameByElapsedTimeIfPlaying(state, 240, 120, { isOpen: false, isPaused: false }), state)
  assert.equal(advanceSnakeGameByElapsedTimeIfPlaying(state, 240, 120, { isOpen: true, isPaused: false }).tick, 2)
})
