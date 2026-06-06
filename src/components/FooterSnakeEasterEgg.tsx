'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

import {
  advanceSnakeGameByElapsedTimeIfPlaying,
  advanceSnakeGameIfPlaying,
  createInitialSnakeGame,
  getSnakeBoardGridStyle,
  getSnakeBoardCells,
  getSnakeBoardCellClassName,
  getSnakeBoardCellStyle,
  getSnakeKeyboardAction,
  getSnakeMoveButtonAriaLabel,
  getSnakeOpenButtonClassName,
  getSnakePauseButtonLabel,
  getSnakePixelIconCellClassName,
  getSnakeScoreLabel,
  serializeSnakeGameSnapshot,
  setSnakeDirection,
  SnakeDirection,
  SNAKE_ACTION_ROW_CLASS_NAME,
  SNAKE_ARROWS_HINT,
  SNAKE_BOARD_CLASS_NAME,
  SNAKE_CLOSE_LABEL,
  SNAKE_CONTROL_BUTTON_CLASS_NAME,
  SNAKE_CONTROL_LABELS,
  SNAKE_DIALOG_ACTION_BUTTON_CLASS_NAME,
  SNAKE_DIALOG_CLASS_NAME,
  SNAKE_DIALOG_HEADER_CLASS_NAME,
  SNAKE_DIALOG_LABEL,
  SNAKE_GAME_OVER_CLASS_NAME,
  SNAKE_GAME_OVER_LABEL,
  SNAKE_HINT_CLASS_NAME,
  SNAKE_MODAL_BACKDROP_CLASS_NAME,
  SNAKE_OPEN_BUTTON_LABEL,
  SNAKE_PIXEL_ICON_GRID_CLASS_NAME,
  SNAKE_PIXEL_ICON,
  SNAKE_RESTART_LABEL,
  SNAKE_SCORE_CLASS_NAME,
  SNAKE_SPACE_HINT,
  SNAKE_TICK_MS,
  SNAKE_TOUCH_CONTROLS_CLASS_NAME,
  SNAKE_TOUCH_CONTROLS_ROW_CLASS_NAME,
} from '@/lib/snake'
import { useBodyScrollLock } from '@/lib/use-body-scroll-lock'

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
      className={SNAKE_CONTROL_BUTTON_CLASS_NAME}
      aria-label={getSnakeMoveButtonAriaLabel(direction)}
    >
      {label}
    </button>
  )
}

export default function FooterSnakeEasterEgg() {
  const [isOpen, setIsOpen] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [game, setGame] = useState(createGame)

  const boardCells = useMemo(() => getSnakeBoardCells(game), [game])

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
        return advanceSnakeGameIfPlaying(previousGame, { isOpen, isPaused })
      })
    }, SNAKE_TICK_MS)

    return () => window.clearInterval(intervalId)
  }, [isOpen, isPaused])

  useBodyScrollLock(isOpen)

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      const action = getSnakeKeyboardAction(event.key)

      if (!action) return

      event.preventDefault()

      if (action.type === 'close') {
        setIsOpen(false)
      } else if (action.type === 'toggle_pause') {
        setIsPaused((previousValue) => !previousValue)
      } else if (action.type === 'restart') {
        restartGame()
      } else {
        handleDirection(action.direction)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleDirection, isOpen, restartGame])

  useEffect(() => {
    window.render_game_to_text = () => serializeSnakeGameSnapshot(game, isOpen, isPaused)

    window.advanceTime = (ms: number) => {
      setGame((previousGame) => {
        return advanceSnakeGameByElapsedTimeIfPlaying(previousGame, ms, SNAKE_TICK_MS, { isOpen, isPaused })
      })
    }

    return () => {
      delete window.render_game_to_text
      delete window.advanceTime
    }
  }, [game, isOpen, isPaused])

  return (
    <>
      <button
        type="button"
        aria-label={SNAKE_OPEN_BUTTON_LABEL}
        onClick={() => {
          setIsOpen(true)
          restartGame()
        }}
        className={getSnakeOpenButtonClassName(isOpen)}
      >
        <span className={SNAKE_PIXEL_ICON_GRID_CLASS_NAME}>
          {SNAKE_PIXEL_ICON.map((row, rowIndex) =>
            row.split('').map((pixel, columnIndex) => (
              <span
                key={`${rowIndex}-${columnIndex}`}
                className={getSnakePixelIconCellClassName(pixel)}
                aria-hidden="true"
              />
            )),
          )}
        </span>
      </button>

      {isOpen && (
        <div className={SNAKE_MODAL_BACKDROP_CLASS_NAME} onClick={() => setIsOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label={SNAKE_DIALOG_LABEL}
            onClick={(event) => event.stopPropagation()}
            className={SNAKE_DIALOG_CLASS_NAME}
          >
            <div className={SNAKE_DIALOG_HEADER_CLASS_NAME}>
              <p className={SNAKE_SCORE_CLASS_NAME}>{getSnakeScoreLabel(game.score)}</p>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className={SNAKE_DIALOG_ACTION_BUTTON_CLASS_NAME}
              >
                {SNAKE_CLOSE_LABEL}
              </button>
            </div>

            <div
              className={SNAKE_BOARD_CLASS_NAME}
              style={getSnakeBoardGridStyle(game.config.width)}
            >
              {boardCells.map((cell) => (
                <span
                  key={cell.key}
                  className={getSnakeBoardCellClassName(cell)}
                  style={getSnakeBoardCellStyle(cell)}
                  aria-hidden="true"
                />
              ))}
            </div>

            <div className={SNAKE_ACTION_ROW_CLASS_NAME}>
              <button
                type="button"
                onClick={() => setIsPaused((previousValue) => !previousValue)}
                className={SNAKE_DIALOG_ACTION_BUTTON_CLASS_NAME}
              >
                {getSnakePauseButtonLabel(isPaused)}
              </button>
              <button
                type="button"
                onClick={restartGame}
                className={SNAKE_DIALOG_ACTION_BUTTON_CLASS_NAME}
              >
                {SNAKE_RESTART_LABEL}
              </button>
              <p className={SNAKE_HINT_CLASS_NAME}>{SNAKE_ARROWS_HINT}</p>
              <p className={SNAKE_HINT_CLASS_NAME}>{SNAKE_SPACE_HINT}</p>
            </div>

            <div className={SNAKE_TOUCH_CONTROLS_CLASS_NAME}>
              <ControlButton label={SNAKE_CONTROL_LABELS.up} direction="up" onPress={handleDirection} />
              <div className={SNAKE_TOUCH_CONTROLS_ROW_CLASS_NAME}>
                <ControlButton label={SNAKE_CONTROL_LABELS.left} direction="left" onPress={handleDirection} />
                <ControlButton label={SNAKE_CONTROL_LABELS.down} direction="down" onPress={handleDirection} />
                <ControlButton label={SNAKE_CONTROL_LABELS.right} direction="right" onPress={handleDirection} />
              </div>
            </div>

            {game.gameOver && (
              <p className={SNAKE_GAME_OVER_CLASS_NAME}>
                {SNAKE_GAME_OVER_LABEL}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  )
}
