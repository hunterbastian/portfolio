'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

type Tool = 'pencil' | 'eraser'

export default function PlaygroundDraw() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [tool, setTool] = useState<Tool>('pencil')
  const [drawing, setDrawing] = useState(false)
  const lastPos = useRef<{ x: number; y: number } | null>(null)

  const getPos = useCallback((e: React.PointerEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    return {
      x: (e.clientX - rect.left) * dpr,
      y: (e.clientY - rect.top) * dpr,
    }
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

      if (tool === 'pencil') {
        ctx.globalCompositeOperation = 'source-over'
        ctx.strokeStyle = 'rgba(60, 60, 60, 0.7)'
        ctx.lineWidth = 2.5 * (window.devicePixelRatio || 1)
      } else {
        ctx.globalCompositeOperation = 'destination-out'
        ctx.lineWidth = 24 * (window.devicePixelRatio || 1)
      }

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
        className="fixed inset-0 z-[5]"
        style={{ cursor: tool === 'pencil' ? 'crosshair' : 'grab', touchAction: 'none' }}
        onPointerDown={startDraw}
        onPointerMove={draw}
        onPointerUp={stopDraw}
        onPointerLeave={stopDraw}
      />

      {/* Tool tray */}
      <div
        className="fixed bottom-5 left-1/2 z-30 flex -translate-x-1/2 items-end gap-1 border border-black/[0.05] bg-card/60 px-3 pb-2 pt-2 shadow-[0_2px_20px_rgba(0,0,0,0.08)] backdrop-blur-xl dark:border-white/[0.06] dark:bg-neutral-800/60"
      >
        {/* Pencil */}
        <button
          type="button"
          onClick={() => setTool('pencil')}
          className="group relative flex flex-col items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded"
          aria-label="Pencil tool"
          title="Pencil"
        >
          <svg
            width="28"
            height="56"
            viewBox="0 0 28 56"
            fill="none"
            className={`transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              tool === 'pencil' ? '-translate-y-2' : 'translate-y-0 group-hover:-translate-y-1'
            }`}
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
          {tool === 'pencil' && (
            <span className="absolute -bottom-0.5 h-1 w-1 rounded-[1px] bg-foreground/40" />
          )}
        </button>

        {/* Eraser */}
        <button
          type="button"
          onClick={() => setTool('eraser')}
          className="group relative flex flex-col items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded"
          aria-label="Eraser tool"
          title="Eraser"
        >
          <svg
            width="32"
            height="24"
            viewBox="0 0 32 24"
            fill="none"
            className={`transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              tool === 'eraser' ? '-translate-y-2' : 'translate-y-0 group-hover:-translate-y-1'
            }`}
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
          {tool === 'eraser' && (
            <span className="absolute -bottom-0.5 h-1 w-1 rounded-[1px] bg-foreground/40" />
          )}
        </button>

        {/* Clear button */}
        <button
          type="button"
          onClick={clearAll}
          className="ml-1 flex h-7 w-7 items-center justify-center text-muted-foreground/60 transition-colors duration-150 hover:bg-black/[0.04] hover:text-foreground/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:hover:bg-white/[0.06]"
          aria-label="Clear drawing"
          title="Clear all"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </>
  )
}
