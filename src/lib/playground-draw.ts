export type PlaygroundDrawTool = 'pencil' | 'eraser'

export interface PlaygroundDrawPoint {
  x: number
  y: number
}

export interface PlaygroundDrawRect {
  left: number
  top: number
}

export interface PlaygroundDrawCanvasStyle {
  cursor: 'crosshair' | 'grab'
  touchAction: 'none'
}

export interface PlaygroundDrawStrokeConfig {
  globalCompositeOperation: 'source-over' | 'destination-out'
  lineWidth: number
  strokeStyle?: string
}

export const PLAYGROUND_DRAW_INITIAL_TOOL: PlaygroundDrawTool = 'pencil'
export const PLAYGROUND_DRAW_PENCIL_LABEL = 'Pencil tool'
export const PLAYGROUND_DRAW_PENCIL_TITLE = 'Pencil'
export const PLAYGROUND_DRAW_ERASER_LABEL = 'Eraser tool'
export const PLAYGROUND_DRAW_ERASER_TITLE = 'Eraser'
export const PLAYGROUND_DRAW_CLEAR_LABEL = 'Clear drawing'
export const PLAYGROUND_DRAW_CLEAR_TITLE = 'Clear all'
export const PLAYGROUND_DRAW_PENCIL_STROKE_STYLE = 'rgba(60, 60, 60, 0.7)'
export const PLAYGROUND_DRAW_PENCIL_WIDTH = 2.5
export const PLAYGROUND_DRAW_ERASER_WIDTH = 24

export const PLAYGROUND_DRAW_CANVAS_CLASS_NAME = 'fixed inset-0 z-[5]'
export const PLAYGROUND_DRAW_TOOL_TRAY_CLASS_NAME =
  'fixed bottom-5 left-1/2 z-30 flex -translate-x-1/2 items-end gap-1 border border-black/[0.05] bg-card/60 px-3 pb-2 pt-2 shadow-[0_2px_20px_rgba(0,0,0,0.08)] backdrop-blur-xl'
export const PLAYGROUND_DRAW_TOOL_BUTTON_CLASS_NAME =
  'group relative flex flex-col items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded'
export const PLAYGROUND_DRAW_TOOL_ICON_BASE_CLASS_NAME = 'transition-transform duration-300 ease-soft'
export const PLAYGROUND_DRAW_TOOL_ICON_ACTIVE_CLASS_NAME = '-translate-y-2'
export const PLAYGROUND_DRAW_TOOL_ICON_INACTIVE_CLASS_NAME = 'translate-y-0 group-hover:-translate-y-1'
export const PLAYGROUND_DRAW_ACTIVE_MARK_CLASS_NAME =
  'absolute -bottom-0.5 h-1 w-1 rounded-[1px] bg-foreground/40'
export const PLAYGROUND_DRAW_CLEAR_BUTTON_CLASS_NAME =
  'ml-1 flex h-10 w-10 items-center justify-center text-muted-foreground/60 transition-colors duration-150 hover:bg-black/[0.04] hover:text-foreground/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'

export function getPlaygroundDrawPoint(
  clientX: number,
  clientY: number,
  rect: PlaygroundDrawRect,
  devicePixelRatio: number,
): PlaygroundDrawPoint {
  return {
    x: (clientX - rect.left) * devicePixelRatio,
    y: (clientY - rect.top) * devicePixelRatio,
  }
}

export function getPlaygroundDrawCanvasStyle(tool: PlaygroundDrawTool): PlaygroundDrawCanvasStyle {
  return {
    cursor: tool === 'pencil' ? 'crosshair' : 'grab',
    touchAction: 'none',
  }
}

export function getPlaygroundDrawToolIconClassName(tool: PlaygroundDrawTool, activeTool: PlaygroundDrawTool) {
  return `${PLAYGROUND_DRAW_TOOL_ICON_BASE_CLASS_NAME} ${
    tool === activeTool ? PLAYGROUND_DRAW_TOOL_ICON_ACTIVE_CLASS_NAME : PLAYGROUND_DRAW_TOOL_ICON_INACTIVE_CLASS_NAME
  }`
}

export function shouldShowPlaygroundDrawActiveMark(tool: PlaygroundDrawTool, activeTool: PlaygroundDrawTool) {
  return tool === activeTool
}

export function getPlaygroundDrawStrokeConfig(
  tool: PlaygroundDrawTool,
  devicePixelRatio: number,
): PlaygroundDrawStrokeConfig {
  if (tool === 'pencil') {
    return {
      globalCompositeOperation: 'source-over',
      strokeStyle: PLAYGROUND_DRAW_PENCIL_STROKE_STYLE,
      lineWidth: PLAYGROUND_DRAW_PENCIL_WIDTH * devicePixelRatio,
    }
  }

  return {
    globalCompositeOperation: 'destination-out',
    lineWidth: PLAYGROUND_DRAW_ERASER_WIDTH * devicePixelRatio,
  }
}
