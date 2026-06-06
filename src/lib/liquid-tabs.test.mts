import assert from 'node:assert/strict'
import test from 'node:test'

import {
  LIQUID_TAB_INDICATOR_TRANSITION,
  LIQUID_TAB_VARIANTS,
  LIQUID_TABS,
  getLiquidTabButtonClassName,
  getLiquidTabContent,
  getLiquidTabIndicatorClassName,
  getLiquidTabIndicatorGeometry,
  getLiquidTabIndicatorStyle,
  getLiquidTabPanelClassName,
  getLiquidTabTrackClassName,
  getLiquidTabVariantLabel,
  updateLiquidTabIndicator,
} from './liquid-tabs.ts'

test('LIQUID_TABS preserves the demo tab order', () => {
  assert.deepEqual([...LIQUID_TABS], ['Overview', 'Features', 'Pricing', 'About'])
})

test('LIQUID_TAB_VARIANTS preserves section order and labels', () => {
  assert.deepEqual([...LIQUID_TAB_VARIANTS], ['pill', 'underline'])
  assert.equal(getLiquidTabVariantLabel('pill'), 'Pill variant')
  assert.equal(getLiquidTabVariantLabel('underline'), 'Underline variant')
})

test('getLiquidTabContent exposes stable panel copy', () => {
  assert.match(getLiquidTabContent('Overview'), /high-level look/)
  assert.match(getLiquidTabContent('About'), /liquid tab navigation/)
})

test('liquid tab class helpers preserve variant and active states', () => {
  const activePill = getLiquidTabButtonClassName('pill', true)
  const inactiveUnderline = getLiquidTabButtonClassName('underline', false)

  assert.match(activePill, /py-2/)
  assert.match(activePill, /text-foreground/)
  assert.match(inactiveUnderline, /py-2\.5/)
  assert.match(inactiveUnderline, /hover:text-foreground\/70/)
  assert.match(getLiquidTabIndicatorClassName('pill'), /bottom-1/)
  assert.match(getLiquidTabIndicatorClassName('underline'), /h-\[2px\]/)
  assert.match(getLiquidTabTrackClassName('pill'), /bg-muted\/50/)
  assert.match(getLiquidTabTrackClassName('underline'), /border-b/)
})

test('getLiquidTabPanelClassName switches active and hidden panel states', () => {
  assert.match(getLiquidTabPanelClassName(true), /relative/)
  assert.match(getLiquidTabPanelClassName(true), /opacity-100/)
  assert.match(getLiquidTabPanelClassName(false), /absolute/)
  assert.match(getLiquidTabPanelClassName(false), /invisible/)
})

test('getLiquidTabIndicatorStyle maps measured geometry to transform style', () => {
  assert.deepEqual(getLiquidTabIndicatorStyle({ left: 42, width: 96 }), {
    width: 96,
    transform: 'translateX(42px)',
    transition: LIQUID_TAB_INDICATOR_TRANSITION,
  })
})

test('liquid tab indicator geometry helper measures active buttons relative to the track', () => {
  assert.deepEqual(
    getLiquidTabIndicatorGeometry({
      buttonRect: { left: 140, width: 96 },
      containerRect: { left: 100, width: 400 },
    }),
    { left: 40, width: 96 },
  )
})

test('updateLiquidTabIndicator updates geometry only when the active button exists', () => {
  const indicators: unknown[] = []
  const container = {
    children: [
      { getBoundingClientRect: () => ({ left: 120, width: 80 }) },
      { getBoundingClientRect: () => ({ left: 220, width: 96 }) },
    ],
    getBoundingClientRect: () => ({ left: 100, width: 400 }),
  }

  assert.equal(updateLiquidTabIndicator({
    activeIndex: 1,
    getContainer: () => container,
    setIndicator: (geometry) => indicators.push(geometry),
  }), true)
  assert.deepEqual(indicators, [{ left: 120, width: 96 }])

  assert.equal(updateLiquidTabIndicator({
    activeIndex: 3,
    getContainer: () => container,
    setIndicator: (geometry) => indicators.push(geometry),
  }), false)
  assert.equal(updateLiquidTabIndicator({
    activeIndex: 0,
    getContainer: () => null,
    setIndicator: (geometry) => indicators.push(geometry),
  }), false)
  assert.deepEqual(indicators, [{ left: 120, width: 96 }])
})
