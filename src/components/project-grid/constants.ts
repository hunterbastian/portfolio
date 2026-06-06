import { MOTION_EASE_SOFT } from '@/lib/motion'
import type { StackPriority } from '@/lib/project-grid'

export const CARD_STAGGER_TIMING = {
  panelAppear: 90,
  cardsAppear: 220,
  panelDuration: 360,
  cardDuration: 400,
  cardStagger: 75,
}

export const CARD_STAGGER_PANEL = {
  initialOpacity: 0,
  finalOpacity: 1,
  initialY: 12,
  finalY: 0,
  ease: MOTION_EASE_SOFT,
}

export const CARD_STAGGER_ITEM = {
  initialOpacity: 0,
  finalOpacity: 1,
  initialY: 12,
  finalY: 0,
}

export interface CaseStudyDialState {
  pile: {
    compactSpreadFactor: number
    compactScale: number
    compactGapX: number
    compactGapY: number
    stackPriority: StackPriority
  }
  expanded: {
    gapX: number
    gapY: number
    scale: number
  }
  motion: {
    expandMs: number
    collapseMs: number
  }
  hover: {
    inactiveOpacity: number
  }
}

export const CASE_STUDY_DIAL_DEFAULTS: CaseStudyDialState = {
  pile: {
    compactSpreadFactor: 0.12,
    compactScale: 0.985,
    compactGapX: 18,
    compactGapY: 22,
    stackPriority: 'default',
  },
  expanded: {
    gapX: 28,
    gapY: 32,
    scale: 1,
  },
  motion: {
    expandMs: 800,
    collapseMs: 550,
  },
  hover: {
    inactiveOpacity: 0.88,
  },
}
