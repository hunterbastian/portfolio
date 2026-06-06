'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  PLAYGROUND_DRAW_ACTIVE_MARK_CLASS_NAME,
  PLAYGROUND_DRAW_CANVAS_CLASS_NAME,
  PLAYGROUND_DRAW_CLEAR_BUTTON_CLASS_NAME,
  PLAYGROUND_DRAW_CLEAR_LABEL,
  PLAYGROUND_DRAW_CLEAR_TITLE,
  PLAYGROUND_DRAW_ERASER_LABEL,
  PLAYGROUND_DRAW_ERASER_TITLE,
  PLAYGROUND_DRAW_INITIAL_TOOL,
  PLAYGROUND_DRAW_PENCIL_LABEL,
  PLAYGROUND_DRAW_PENCIL_TITLE,
  PLAYGROUND_DRAW_TOOL_BUTTON_CLASS_NAME,
  PLAYGROUND_DRAW_TOOL_TRAY_CLASS_NAME,
  getPlaygroundDrawCanvasStyle,
  getPlaygroundDrawPoint,
  getPlaygroundDrawStrokeConfig,
  getPlaygroundDrawToolIconClassName,
  shouldShowPlaygroundDrawActiveMark,
  type PlaygroundDrawTool,
} from '@/lib/playground-draw'

export default function PlaygroundDraw() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [tool, setTool] = useState<PlaygroundDrawTool>(PLAYGROUND_DRAW_INITIAL_TOOL)
  const [drawing, setDrawing] = useState(false)
  const lastPos = useRef<{ x: number; y: number } | null>(null)

  const getPos = useCallback((e: React.PointerEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    return getPlaygroundDrawPoint(e.clientX, e.clientY, rect, dpr)
  }, [])

  // Size canvas to viewport
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    function resize() {
      const dpr = window.devicePixelRatio || 1
      const w = window.innerWidth
      const h = window.innerHeight
      canvas!.width = w * dpr
      canvas!.height = h * dpr
      canvas!.style.width = w + 'px'
      canvas!.style.height = h + 'px'
    }

    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  const startDraw = useCallback(
    (e: React.PointerEvent) => {
      setDrawing(true)
      lastPos.current = getPos(e)
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    },
    [getPos]
  )

  const draw = useCallback(
    (e: React.PointerEvent) => {
      if (!drawing) return
      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')
      if (!ctx || !lastPos.current) return

      const pos = getPos(e)

      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      const strokeConfig = getPlaygroundDrawStrokeConfig(tool, window.devicePixelRatio || 1)
      ctx.globalCompositeOperation = strokeConfig.globalCompositeOperation
      if (strokeConfig.strokeStyle) {
        ctx.strokeStyle = strokeConfig.strokeStyle
      }
      ctx.lineWidth = strokeConfig.lineWidth

      ctx.beginPath()
      ctx.moveTo(lastPos.current.x, lastPos.current.y)
      ctx.lineTo(pos.x, pos.y)
      ctx.stroke()

      lastPos.current = pos
    },
    [drawing, tool, getPos]
  )

  const stopDraw = useCallback(() => {
    setDrawing(false)
    lastPos.current = null
  }, [])

  const clearAll = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }, [])

  return (
    <>
      {/* Drawing canvas overlay */}
      <canvas
        ref={canvasRef}
        className={PLAYGROUND_DRAW_CANVAS_CLASS_NAME}
        style={getPlaygroundDrawCanvasStyle(tool)}
        onPointerDown={startDraw}
        onPointerMove={draw}
        onPointerUp={stopDraw}
        onPointerLeave={stopDraw}
      />

      {/* Tool tray */}
      <div
        className={PLAYGROUND_DRAW_TOOL_TRAY_CLASS_NAME}
      >
        {/* Pencil */}
        <button
          type="button"
          onClick={() => setTool('pencil')}
          className={PLAYGROUND_DRAW_TOOL_BUTTON_CLASS_NAME}
          aria-label={PLAYGROUND_DRAW_PENCIL_LABEL}
          title={PLAYGROUND_DRAW_PENCIL_TITLE}
        >
          <svg
            width="28"
            height="56"
            viewBox="0 0 28 56"
            fill="none"
            className={getPlaygroundDrawToolIconClassName('pencil', tool)}
          >
            {/* Pencil body */}
            <rect x="8" y="12" width="12" height="34" rx="1" fill="#f5e6d0" />
            {/* Wood taper */}
            <path d="M8 12 L14 0 L20 12 Z" fill="#e8d5b8" />
            {/* Lead tip */}
            <path d="M12 4 L14 0 L16 4 Z" fill="#4a7cc9" />
            {/* Band */}
            <rect x="8" y="38" width="12" height="4" rx="0.5" fill="#c8b89a" />
            {/* Barrel stripe */}
            <rect x="12" y="12" width="4" height="26" fill="#eedcc2" opacity="0.5" />
          </svg>
          {shouldShowPlaygroundDrawActiveMark('pencil', tool) && (
            <span className={PLAYGROUND_DRAW_ACTIVE_MARK_CLASS_NAME} />
          )}
        </button>

        {/* Eraser */}
        <button
          type="button"
          onClick={() => setTool('eraser')}
          className={PLAYGROUND_DRAW_TOOL_BUTTON_CLASS_NAME}
          aria-label={PLAYGROUND_DRAW_ERASER_LABEL}
          title={PLAYGROUND_DRAW_ERASER_TITLE}
        >
          <svg
            width="32"
            height="24"
            viewBox="0 0 32 24"
            fill="none"
            className={getPlaygroundDrawToolIconClassName('eraser', tool)}
          >
            {/* Eraser body */}
            <rect x="1" y="1" width="30" height="22" rx="3" fill="#f5a0b1" />
            {/* Band */}
            <rect x="1" y="14" width="30" height="3" fill="#d88a9a" />
            {/* Label area */}
            <rect x="4" y="4" width="24" height="9" rx="1.5" fill="#f7b8c4" opacity="0.6" />
            {/* Text hint */}
            <line x1="8" y1="7" x2="24" y2="7" stroke="#e09aaa" strokeWidth="1" />
            <line x1="10" y1="10" x2="22" y2="10" stroke="#e09aaa" strokeWidth="1" />
          </svg>
          {shouldShowPlaygroundDrawActiveMark('eraser', tool) && (
            <span className={PLAYGROUND_DRAW_ACTIVE_MARK_CLASS_NAME} />
          )}
        </button>

        {/* Clear button */}
        <button
          type="button"
          onClick={clearAll}
          className={PLAYGROUND_DRAW_CLEAR_BUTTON_CLASS_NAME}
          aria-label={PLAYGROUND_DRAW_CLEAR_LABEL}
          title={PLAYGROUND_DRAW_CLEAR_TITLE}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </>
  )
}
