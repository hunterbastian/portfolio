import assert from 'node:assert/strict'
import test from 'node:test'

import {
  advanceSnakeGame,
  arePointsEqual,
  createInitialSnakeGame,
  isOppositeDirection,
  placeFood,
  setSnakeDirection,
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

test('isOppositeDirection identifies opposite directions', () => {
  assert.equal(isOppositeDirection('up', 'down'), true)
  assert.equal(isOppositeDirection('up', 'left'), false)
})
