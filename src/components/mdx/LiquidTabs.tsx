'use client'

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'
import {
  LIQUID_TAB_VARIANTS,
  LIQUID_TABS,
  type LiquidTab,
  type LiquidTabVariant,
  getLiquidTabButtonClassName,
  getLiquidTabContent,
  getLiquidTabIndicatorClassName,
  getLiquidTabIndicatorStyle,
  getLiquidTabPanelClassName,
  getLiquidTabTrackClassName,
  getLiquidTabVariantLabel,
  updateLiquidTabIndicator,
} from '@/lib/liquid-tabs'

interface IndicatorStyle {
  left: number
  width: number
}

function useIndicator(containerRef: RefObject<HTMLDivElement | null>, activeIndex: number) {
  const [style, setStyle] = useState<IndicatorStyle>({ left: 0, width: 0 })

  const update = useCallback(() => {
    updateLiquidTabIndicator({
      activeIndex,
      getContainer: () => containerRef.current,
      setIndicator: setStyle,
    })
  }, [containerRef, activeIndex])

  useEffect(() => {
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [update])

  return style
}

function VariantTabs({
  activeIndex,
  onSelect,
  variant,
}: {
  activeIndex: number
  onSelect: (i: number) => void
  variant: LiquidTabVariant
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const indicator = useIndicator(containerRef, activeIndex)

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className={getLiquidTabTrackClassName(variant)}
        role="tablist"
      >
        <div
          suppressHydrationWarning
          className={getLiquidTabIndicatorClassName(variant)}
          style={getLiquidTabIndicatorStyle(indicator)}
        />
        {LIQUID_TABS.map((tab, i) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={i === activeIndex}
            onClick={() => onSelect(i)}
            className={getLiquidTabButtonClassName(variant, i === activeIndex)}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  )
}

function Panel({ tab, isActive }: { tab: LiquidTab; isActive: boolean }) {
  return (
    <div
      role="tabpanel"
      className={getLiquidTabPanelClassName(isActive)}
    >
      <p className="py-4 font-inter text-[13px] leading-relaxed text-muted-foreground">
        {getLiquidTabContent(tab)}
      </p>
    </div>
  )
}

function LiquidTabDemoSection({
  activeIndex,
  onSelect,
  variant,
}: {
  activeIndex: number
  onSelect: (i: number) => void
  variant: LiquidTabVariant
}) {
  return (
    <div>
      <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
        {getLiquidTabVariantLabel(variant)}
      </p>
      <div className="border border-border bg-card/50 p-5">
        <VariantTabs activeIndex={activeIndex} onSelect={onSelect} variant={variant} />
        <div className="relative mt-2">
          {LIQUID_TABS.map((tab, i) => (
            <Panel key={tab} tab={tab} isActive={i === activeIndex} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function LiquidTabs() {
  const [pillIndex, setPillIndex] = useState(0)
  const [underlineIndex, setUnderlineIndex] = useState(0)
  const tabSectionState = {
    pill: { activeIndex: pillIndex, onSelect: setPillIndex },
    underline: { activeIndex: underlineIndex, onSelect: setUnderlineIndex },
  } satisfies Record<LiquidTabVariant, { activeIndex: number; onSelect: (i: number) => void }>

  return (
    <div className="not-prose my-8 space-y-10">
      {LIQUID_TAB_VARIANTS.map((variant) => (
        <LiquidTabDemoSection
          key={variant}
          variant={variant}
          activeIndex={tabSectionState[variant].activeIndex}
          onSelect={tabSectionState[variant].onSelect}
        />
      ))}
    </div>
  )
}
