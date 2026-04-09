'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const TABS = ['Overview', 'Features', 'Pricing', 'About']

const PANEL_CONTENT: Record<string, string> = {
  Overview: 'A high-level look at what this product does and why it exists. Built for people who care about craft.',
  Features: 'Spring-based animations, positional DOM math, zero dependencies. Pure CSS transitions with a few lines of JS.',
  Pricing: 'Free and open source. No subscriptions, no paywalls, no analytics. Just the code.',
  About: 'A 15-minute challenge exploring liquid tab navigation — elastic springs, stretching pills, and smooth panel swaps.',
}

interface IndicatorStyle {
  left: number
  width: number
}

function useIndicator(containerRef: React.RefObject<HTMLDivElement | null>, activeIndex: number) {
  const [style, setStyle] = useState<IndicatorStyle>({ left: 0, width: 0 })

  const update = useCallback(() => {
    const container = containerRef.current
    if (!container) return
    const button = container.children[activeIndex] as HTMLElement | undefined
    if (!button) return
    const containerRect = container.getBoundingClientRect()
    const buttonRect = button.getBoundingClientRect()
    setStyle({
      left: buttonRect.left - containerRect.left,
      width: buttonRect.width,
    })
  }, [containerRef, activeIndex])

  useEffect(() => {
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [update])

  return style
}

function PillTabs({ activeIndex, onSelect }: { activeIndex: number; onSelect: (i: number) => void }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const indicator = useIndicator(containerRef, activeIndex)

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="relative flex gap-1 rounded-full bg-muted/50 p-1"
        role="tablist"
      >
        <div
          suppressHydrationWarning
          className="absolute top-1 bottom-1 rounded-full bg-foreground/10 shadow-sm"
          style={{
            width: indicator.width,
            transform: `translateX(${indicator.left}px)`,
            transition: 'transform 500ms cubic-bezier(0.16, 1, 0.3, 1), width 400ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
        {TABS.map((tab, i) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={i === activeIndex}
            onClick={() => onSelect(i)}
            className={`relative z-10 rounded-full px-4 py-2 font-mono text-[12px] tracking-[0.04em] transition-colors duration-200 ${
              i === activeIndex ? 'text-foreground' : 'text-muted-foreground hover:text-foreground/70'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  )
}

function UnderlineTabs({ activeIndex, onSelect }: { activeIndex: number; onSelect: (i: number) => void }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const indicator = useIndicator(containerRef, activeIndex)

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="relative flex gap-1 border-b border-border"
        role="tablist"
      >
        <div
          suppressHydrationWarning
          className="absolute bottom-0 h-[2px] rounded-full bg-foreground"
          style={{
            width: indicator.width,
            transform: `translateX(${indicator.left}px)`,
            transition: 'transform 500ms cubic-bezier(0.16, 1, 0.3, 1), width 400ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
        {TABS.map((tab, i) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={i === activeIndex}
            onClick={() => onSelect(i)}
            className={`relative z-10 px-4 py-2.5 font-mono text-[12px] tracking-[0.04em] transition-colors duration-200 ${
              i === activeIndex ? 'text-foreground' : 'text-muted-foreground hover:text-foreground/70'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  )
}

function Panel({ tab, isActive }: { tab: string; isActive: boolean }) {
  return (
    <div
      role="tabpanel"
      className={`overflow-hidden transition-opacity duration-300 ${
        isActive
          ? 'relative h-auto opacity-100 visible'
          : 'absolute h-0 opacity-0 invisible'
      }`}
    >
      <p className="py-4 font-inter text-[13px] leading-relaxed text-muted-foreground">
        {PANEL_CONTENT[tab]}
      </p>
    </div>
  )
}

export default function LiquidTabs() {
  const [pillIndex, setPillIndex] = useState(0)
  const [underlineIndex, setUnderlineIndex] = useState(0)

  return (
    <div className="not-prose my-8 space-y-10">
      <div>
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
          Pill variant
        </p>
        <div className="rounded-[3px] border border-border bg-card/50 p-5">
          <PillTabs activeIndex={pillIndex} onSelect={setPillIndex} />
          <div className="relative mt-2">
            {TABS.map((tab, i) => (
              <Panel key={tab} tab={tab} isActive={i === pillIndex} />
            ))}
          </div>
        </div>
      </div>

      <div>
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
          Underline variant
        </p>
        <div className="rounded-[3px] border border-border bg-card/50 p-5">
          <UnderlineTabs activeIndex={underlineIndex} onSelect={setUnderlineIndex} />
          <div className="relative mt-2">
            {TABS.map((tab, i) => (
              <Panel key={tab} tab={tab} isActive={i === underlineIndex} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
