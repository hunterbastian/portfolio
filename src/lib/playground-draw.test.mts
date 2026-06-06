import assert from 'node:assert/strict'
import test from 'node:test'

import {
  PLAYGROUND_DRAW_ACTIVE_MARK_CLASS_NAME,
  PLAYGROUND_DRAW_CANVAS_CLASS_NAME,
  PLAYGROUND_DRAW_CLEAR_LABEL,
  PLAYGROUND_DRAW_CLEAR_TITLE,
  PLAYGROUND_DRAW_ERASER_LABEL,
  PLAYGROUND_DRAW_ERASER_TITLE,
  PLAYGROUND_DRAW_ERASER_WIDTH,
  PLAYGROUND_DRAW_INITIAL_TOOL,
  PLAYGROUND_DRAW_PENCIL_LABEL,
  PLAYGROUND_DRAW_PENCIL_STROKE_STYLE,
  PLAYGROUND_DRAW_PENCIL_TITLE,
  PLAYGROUND_DRAW_PENCIL_WIDTH,
  PLAYGROUND_DRAW_TOOL_BUTTON_CLASS_NAME,
  PLAYGROUND_DRAW_TOOL_TRAY_CLASS_NAME,
  getPlaygroundDrawCanvasStyle,
  getPlaygroundDrawPoint,
  getPlaygroundDrawStrokeConfig,
  getPlaygroundDrawToolIconClassName,
  shouldShowPlaygroundDrawActiveMark,
} from './playground-draw.ts'

test('playground draw constants preserve visible tool copy and chrome', () => {
  assert.equal(PLAYGROUND_DRAW_INITIAL_TOOL, 'pencil')
  assert.equal(PLAYGROUND_DRAW_PENCIL_LABEL, 'Pencil tool')
  assert.equal(PLAYGROUND_DRAW_PENCIL_TITLE, 'Pencil')
  assert.equal(PLAYGROUND_DRAW_ERASER_LABEL, 'Eraser tool')
  assert.equal(PLAYGROUND_DRAW_ERASER_TITLE, 'Eraser')
  assert.equal(PLAYGROUND_DRAW_CLEAR_LABEL, 'Clear drawing')
  assert.equal(PLAYGROUND_DRAW_CLEAR_TITLE, 'Clear all')
  assert.match(PLAYGROUND_DRAW_CANVAS_CLASS_NAME, /fixed inset-0/)
  assert.match(PLAYGROUND_DRAW_TOOL_TRAY_CLASS_NAME, /backdrop-blur-xl/)
  assert.match(PLAYGROUND_DRAW_TOOL_BUTTON_CLASS_NAME, /focus-visible:outline-primary/)
  assert.match(PLAYGROUND_DRAW_ACTIVE_MARK_CLASS_NAME, /bg-foreground\/40/)
})

test('getPlaygroundDrawPoint converts viewport pointer coordinates to DPR canvas coordinates', () => {
  assert.deepEqual(
    getPlaygroundDrawPoint(64, 36, { left: 10, top: 6 }, 2),
    { x: 108, y: 60 },
  )
})

test('playground draw cursor and icon helpers preserve active tool states', () => {
  assert.deepEqual(getPlaygroundDrawCanvasStyle('pencil'), {
    cursor: 'crosshair',
    touchAction: 'none',
  })
  assert.deepEqual(getPlaygroundDrawCanvasStyle('eraser'), {
    cursor: 'grab',
    touchAction: 'none',
  })
  assert.match(getPlaygroundDrawToolIconClassName('pencil', 'pencil'), /-translate-y-2/)
  assert.match(getPlaygroundDrawToolIconClassName('pencil', 'eraser'), /group-hover:-translate-y-1/)
  assert.equal(shouldShowPlaygroundDrawActiveMark('eraser', 'eraser'), true)
  assert.equal(shouldShowPlaygroundDrawActiveMark('eraser', 'pencil'), false)
})

test('getPlaygroundDrawStrokeConfig preserves pencil and eraser drawing settings', () => {
  assert.equal(PLAYGROUND_DRAW_PENCIL_WIDTH, 2.5)
  assert.equal(PLAYGROUND_DRAW_ERASER_WIDTH, 24)
  assert.equal(PLAYGROUND_DRAW_PENCIL_STROKE_STYLE, 'rgba(60, 60, 60, 0.7)')
  assert.deepEqual(getPlaygroundDrawStrokeConfig('pencil', 2), {
    globalCompositeOperation: 'source-over',
    strokeStyle: PLAYGROUND_DRAW_PENCIL_STROKE_STYLE,
    lineWidth: 5,
  })
  assert.deepEqual(getPlaygroundDrawStrokeConfig('eraser', 2), {
    globalCompositeOperation: 'destination-out',
    lineWidth: 48,
  })
})
