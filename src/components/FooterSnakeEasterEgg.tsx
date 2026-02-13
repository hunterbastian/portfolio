'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

import {
  advanceSnakeGame,
  createInitialSnakeGame,
  directionFromKey,
  setSnakeDirection,
  SnakeDirection,
} from '@/lib/snake'

const TICK_MS = 120
const PIXEL_ICON = ['00100', '01110', '11111', '01110', '00100']

declare global {
  interface Window {
    render_game_to_text?: () => string
    advanceTime?: (ms: number) => void
  }
}

function createGame() {
  return createInitialSnakeGame()
}

function ControlButton({
  label,
  direction,
  onPress,
}: {
  label: string
  direction: SnakeDirection
  onPress: (direction: SnakeDirection) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onPress(direction)}
      className="h-9 min-w-9 border border-black bg-white px-3 text-[10px] font-code tracking-[0.1em] text-black transition-colors hover:bg-black hover:text-white active:bg-black active:text-white touch-manipulation"
      aria-label={`Move ${direction}`}
    >
      {label}
    </button>
  )
}

export default function FooterSnakeEasterEgg() {
  const [isOpen, setIsOpen] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [game, setGame] = useState(createGame)

  const occupiedCells = useMemo(() => new Set(game.snake.map((segment) => `${segment.x},${segment.y}`)), [game.snake])

  const restartGame = useCallback(() => {
    setGame(createGame())
    setIsPaused(false)
  }, [])

  const handleDirection = useCallback((nextDirection: SnakeDirection) => {
    setGame((previousGame) => {
      if (previousGame.gameOver) {
        return previousGame
      }
      return setSnakeDirection(previousGame, nextDirection)
    })
  }, [])

  useEffect(() => {
    if (!isOpen || isPaused) {
      return undefined
    }

    const intervalId = window.setInterval(() => {
      setGame((previousGame) => {
        if (previousGame.gameOver) {
          return previousGame
        }
        return advanceSnakeGame(previousGame)
      })
    }, TICK_MS)

    return () => window.clearInterval(intervalId)
  }, [isOpen, isPaused])

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setIsOpen(false)
        return
      }

      if (event.key === ' ') {
        event.preventDefault()
        setIsPaused((previousValue) => !previousValue)
        return
      }

      if (event.key.toLowerCase() === 'r') {
        event.preventDefault()
        restartGame()
        return
      }

      const nextDirection = directionFromKey(event.key)
      if (nextDirection) {
        event.preventDefault()
        handleDirection(nextDirection)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleDirection, isOpen, restartGame])

  useEffect(() => {
    window.render_game_to_text = () =>
      JSON.stringify({
        mode: !isOpen ? 'closed' : game.gameOver ? 'game_over' : isPaused ? 'paused' : 'playing',
        coordinateSystem: { origin: 'top-left', xAxis: 'right', yAxis: 'down' },
        board: { width: game.config.width, height: game.config.height },
        snake: game.snake,
        food: game.food,
        score: game.score,
        direction: game.direction,
        tick: game.tick,
      })

    window.advanceTime = (ms: number) => {
      if (!isOpen || isPaused) {
        return
      }

      const steps = Math.max(1, Math.round(ms / TICK_MS))
      setGame((previousGame) => {
        let nextGame = previousGame
        for (let step = 0; step < steps; step += 1) {
          if (nextGame.gameOver) {
            break
          }
          nextGame = advanceSnakeGame(nextGame)
        }
        return nextGame
      })
    }

    return () => {
      delete window.render_game_to_text
      delete window.advanceTime
    }
  }, [game, isOpen, isPaused])

  const boardCells = game.config.width * game.config.height

  return (
    <>
      <button
        type="button"
        aria-label="Open Snake mini game"
        onClick={() => {
          setIsOpen(true)
          restartGame()
        }}
        className={`group inline-flex h-7 w-7 items-center justify-center border border-current transition-transform duration-150 hover:scale-110 active:scale-95 ${
          isOpen ? 'bg-black text-white' : 'bg-white text-black'
        }`}
      >
        <span className="grid grid-cols-5 gap-[1px]">
          {PIXEL_ICON.map((row, rowIndex) =>
            row.split('').map((pixel, columnIndex) => (
              <span
                key={`${rowIndex}-${columnIndex}`}
                className={`h-[2px] w-[2px] ${pixel === '1' ? 'bg-current' : 'bg-transparent'}`}
                aria-hidden="true"
              />
            )),
          )}
        </span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 px-4 py-6" onClick={() => setIsOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Snake game"
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-sm border-2 border-black bg-white p-4 text-black shadow-[8px_8px_0_0_#000000]"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="font-code text-[11px] tracking-[0.12em]">SNAKE // SCORE {game.score}</p>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="border border-black px-2 py-1 font-code text-[10px] tracking-[0.1em] transition-colors hover:bg-black hover:text-white"
              >
                CLOSE
              </button>
            </div>

            <div
              className="grid w-[min(84vw,18rem)] border-2 border-black bg-white"
              style={{ gridTemplateColumns: `repeat(${game.config.width}, minmax(0, 1fr))` }}
            >
              {Array.from({ length: boardCells }).map((_, index) => {
                const x = index % game.config.width
                const y = Math.floor(index / game.config.width)
                const key = `${x},${y}`
                const isSnake = occupiedCells.has(key)
                const isFood = game.food?.x === x && game.food?.y === y

                const foodStyle = isFood
                  ? {
                      backgroundImage:
                        'linear-gradient(45deg, #000 25%, #fff 25%, #fff 50%, #000 50%, #000 75%, #fff 75%, #fff 100%)',
                      backgroundSize: '4px 4px',
                    }
                  : undefined

                return (
                  <span
                    key={key}
                    className={`aspect-square border border-black/5 ${isSnake ? 'bg-black' : 'bg-white'}`}
                    style={foodStyle}
                    aria-hidden="true"
                  />
                )
              })}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPaused((previousValue) => !previousValue)}
                className="border border-black px-2 py-1 font-code text-[10px] tracking-[0.1em] transition-colors hover:bg-black hover:text-white"
              >
                {isPaused ? 'RESUME' : 'PAUSE'}
              </button>
              <button
                type="button"
                onClick={restartGame}
                className="border border-black px-2 py-1 font-code text-[10px] tracking-[0.1em] transition-colors hover:bg-black hover:text-white"
              >
                RESTART
              </button>
              <p className="font-code text-[10px] tracking-[0.1em] text-black/75">ARROWS/WASD</p>
              <p className="font-code text-[10px] tracking-[0.1em] text-black/75">SPACE PAUSE</p>
            </div>

            <div className="mt-3 flex flex-col items-center gap-1 sm:hidden">
              <ControlButton label="UP" direction="up" onPress={handleDirection} />
              <div className="flex items-center gap-1">
                <ControlButton label="LEFT" direction="left" onPress={handleDirection} />
                <ControlButton label="DOWN" direction="down" onPress={handleDirection} />
                <ControlButton label="RIGHT" direction="right" onPress={handleDirection} />
              </div>
            </div>

            {game.gameOver && (
              <p className="mt-3 border border-black bg-black px-2 py-1 text-center font-code text-[10px] tracking-[0.12em] text-white">
                GAME OVER. PRESS RESTART OR R.
              </p>
            )}
          </div>
        </div>
      )}
    </>
  )
}
