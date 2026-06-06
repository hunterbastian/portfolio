import assert from 'node:assert/strict'
import test from 'node:test'

import {
  HERO_GLOW_MAX_X,
  HERO_GLOW_MAX_Y,
  HERO_GLOW_ORIGIN,
  HERO_GRAIN_PARALLAX_RATIO,
  applyHeroGlowCssVariables,
  cancelHeroGlowFrame,
  clampHeroGlowValue,
  getHeroGlowAnimationStep,
  getHeroGlowCssVariables,
  getHeroGlowOffsets,
  getHeroGlowPointerRatio,
  getNextHeroGlowPoint,
  requestHeroGlowFrame,
  scheduleHeroGlowFrameIfIdle,
  shouldContinueHeroGlowAnimation,
} from './hero-glow.ts'

const rect = {
  left: 100,
  top: 50,
  width: 400,
  height: 200,
}

function assertClose(actual: number, expected: number) {
  assert.equal(Math.abs(actual - expected) < 0.000001, true)
}

function createStyleTarget() {
  const properties: Record<string, string> = {}

  return {
    properties,
    target: {
      style: {
        setProperty(propertyName: string, value: string) {
          properties[propertyName] = value
        },
      },
    },
  }
}

test('hero glow pointer ratio maps viewport coordinates around the section center', () => {
  assert.deepEqual(HERO_GLOW_ORIGIN, { x: 0, y: 0 })
  assert.deepEqual(getHeroGlowPointerRatio({ clientX: 300, clientY: 150 }, rect), { x: 0, y: 0 })
  assert.deepEqual(getHeroGlowPointerRatio({ clientX: 500, clientY: 250 }, rect), { x: 1, y: 1 })
  assert.deepEqual(getHeroGlowPointerRatio({ clientX: 100, clientY: 50 }, rect), { x: -1, y: -1 })
})

test('hero glow interpolation preserves lerp behavior', () => {
  assert.deepEqual(getNextHeroGlowPoint({ x: 0, y: 0 }, { x: 1, y: -1 }), {
    x: 0.09,
    y: -0.09,
  })
  const nextPoint = getNextHeroGlowPoint({ x: 0.5, y: -0.5 }, { x: 1, y: 1 }, 0.2)

  assertClose(nextPoint.x, 0.6)
  assertClose(nextPoint.y, -0.2)
})

test('hero glow offsets clamp glow values and apply grain parallax', () => {
  assert.equal(clampHeroGlowValue(20, -HERO_GLOW_MAX_X, HERO_GLOW_MAX_X), HERO_GLOW_MAX_X)
  assert.deepEqual(getHeroGlowOffsets({ x: 2, y: -2 }), {
    glowX: HERO_GLOW_MAX_X,
    glowY: -HERO_GLOW_MAX_Y,
    grainX: HERO_GLOW_MAX_X * HERO_GRAIN_PARALLAX_RATIO,
    grainY: -HERO_GLOW_MAX_Y * HERO_GRAIN_PARALLAX_RATIO,
  })
  assert.deepEqual(getHeroGlowCssVariables({ x: 0.5, y: -0.5 }), {
    '--hero-glow-cursor-x': '8px',
    '--hero-glow-cursor-y': '-4px',
    '--hero-grain-cursor-x': '4.4px',
    '--hero-grain-cursor-y': '-2.2px',
  })
})

test('hero glow css variable writer updates glow and grain targets', () => {
  const glow = createStyleTarget()
  const grain = createStyleTarget()

  assert.deepEqual(
    applyHeroGlowCssVariables({ glow: glow.target, grain: grain.target, point: { x: -0.25, y: 0.25 } }),
    {
      '--hero-glow-cursor-x': '-4px',
      '--hero-glow-cursor-y': '2px',
      '--hero-grain-cursor-x': '-2.2px',
      '--hero-grain-cursor-y': '1.1px',
    },
  )
  assert.deepEqual(glow.properties, {
    '--hero-glow-cursor-x': '-4px',
    '--hero-glow-cursor-y': '2px',
  })
  assert.deepEqual(grain.properties, {
    '--hero-grain-cursor-x': '-2.2px',
    '--hero-grain-cursor-y': '1.1px',
  })
})

test('hero glow settle helper preserves animation continuation threshold', () => {
  assert.equal(shouldContinueHeroGlowAnimation({ x: 0, y: 0 }, { x: 0.001, y: 0.001 }), false)
  assert.equal(shouldContinueHeroGlowAnimation({ x: 0, y: 0 }, { x: 0.003, y: 0 }), true)
  assert.equal(shouldContinueHeroGlowAnimation({ x: 0, y: 0 }, { x: 0, y: -0.003 }), true)
})

test('hero glow animation step reports continuation and final settled point', () => {
  assert.deepEqual(getHeroGlowAnimationStep({ x: 0, y: 0 }, { x: 1, y: -1 }, 0.5, 0.1), {
    point: { x: 0.5, y: -0.5 },
    shouldContinue: true,
    settledPoint: { x: 0.5, y: -0.5 },
  })

  const settlingStep = getHeroGlowAnimationStep({ x: 0.99, y: -0.99 }, { x: 1, y: -1 }, 0.5, 0.01)

  assertClose(settlingStep.point.x, 0.995)
  assertClose(settlingStep.point.y, -0.995)
  assert.equal(settlingStep.shouldContinue, false)
  assert.deepEqual(settlingStep.settledPoint, { x: 1, y: -1 })
})

test('hero glow frame helpers schedule, replace, and cancel animation frames', () => {
  const callbacks: Array<() => void> = []
  const canceledFrames: number[] = []
  const frameRef = { current: null as number | null }
  const requestFrame = (callback: () => void) => {
    callbacks.push(callback)
    return callbacks.length
  }
  const cancelFrame = (frame: number) => canceledFrames.push(frame)
  const callback = () => undefined

  assert.equal(scheduleHeroGlowFrameIfIdle({ callback, frameRef, requestFrame }), 1)
  assert.equal(scheduleHeroGlowFrameIfIdle({ callback, frameRef, requestFrame }), 1)
  assert.equal(callbacks.length, 1)

  assert.equal(requestHeroGlowFrame({ callback, frameRef, requestFrame }), 2)
  assert.equal(frameRef.current, 2)
  assert.equal(callbacks.length, 2)

  assert.equal(cancelHeroGlowFrame({ cancelFrame, frameRef }), true)
  assert.deepEqual(canceledFrames, [2])
  assert.equal(frameRef.current, null)
  assert.equal(cancelHeroGlowFrame({ cancelFrame, frameRef }), false)
})
