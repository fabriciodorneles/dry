'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from './ui/card'

const TEST_SECONDS = 1
const BRICKS_PER_ROW = 8
const BRICK_WIDTH = 32
const BRICK_HEIGHT = 16
const BRICK_GAP = 2

interface FocusWallProps {
  totalFocusSeconds: number
}

export function FocusWall({ totalFocusSeconds }: FocusWallProps) {
  const [activeBricks, setActiveBricks] = useState<boolean[]>([])

  useEffect(() => {
    const totalBricks = Math.floor(totalFocusSeconds / TEST_SECONDS)
    const newBricks = Array.from({ length: totalBricks }, () => true)
    setActiveBricks(newBricks)
  }, [totalFocusSeconds])

  const totalRows = Math.ceil(activeBricks.length / BRICKS_PER_ROW)
  const containerHeight = totalRows * (BRICK_HEIGHT + BRICK_GAP) + BRICK_GAP

  function shouldBeHalfBrick(row: number, col: number): boolean {
    const isOddRow = row % 2 === 1
    return isOddRow && col === 0
  }

  function getBrickWidth(row: number, col: number): number {
    const isOddRow = row % 2 === 1
    if (isOddRow && col === 8) {
      return BRICK_WIDTH + BRICK_WIDTH / 2
    }
    return shouldBeHalfBrick(row, col) ? BRICK_WIDTH / 2 : BRICK_WIDTH
  }

  function getBrickLeft(row: number, col: number): number {
    const isEvenRow = row % 2 === 0

    if (isEvenRow) {
      return col * (BRICK_WIDTH + BRICK_GAP) + 10
    } else {
      if (col === 0) {
        return 10
      } else if (col === 8) {
        return 7 * (BRICK_WIDTH + BRICK_GAP) + BRICK_WIDTH + 10
      } else {
        return (col - 1) * (BRICK_WIDTH + BRICK_GAP) + BRICK_WIDTH / 2 + 10
      }
    }
  }

  function shouldShowBrick(index: number): boolean {
    const row = Math.floor(index / BRICKS_PER_ROW)
    const col = index % BRICKS_PER_ROW
    const isOddRow = row % 2 === 1

    if (isOddRow) {
      return col <= 8
    } else {
      return col < BRICKS_PER_ROW
    }
  }

  return (
    <Card className="bg-muted/40 p-4 w-full max-w-sm">
      <CardContent className="p-4">
        <div className="text-center mb-4">
          <h3 className="text-lg font-bold">Parede de Foco</h3>
          <p className="text-sm text-muted-foreground">
            {Math.floor(totalFocusSeconds / 60)}m {totalFocusSeconds % 60}s de
            foco
          </p>
        </div>

        <div
          className="relative mx-auto"
          style={{
            width: `${BRICKS_PER_ROW * BRICK_WIDTH + (BRICKS_PER_ROW - 1) * BRICK_GAP + 20}px`,
            height: `${Math.max(containerHeight, 200)}px`,
            minHeight: '200px',
          }}
        >
          {activeBricks.map((isActive, index) => {
            const row = Math.floor(index / BRICKS_PER_ROW)
            const col = index % BRICKS_PER_ROW

            if (!shouldShowBrick(index)) return null

            const left = getBrickLeft(row, col)
            const containerMaxHeight = Math.max(containerHeight, 200)
            const top =
              containerMaxHeight - (row + 1) * (BRICK_HEIGHT + BRICK_GAP) - 10

            return (
              <div
                key={index}
                className={`
                  absolute rounded-sm transition-all duration-700 ease-out
                  ${
                    isActive
                      ? 'bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg transform scale-100'
                      : 'hidden'
                  }
                `}
                style={{
                  width: `${getBrickWidth(row, col)}px`,
                  height: `${BRICK_HEIGHT}px`,
                  left: `${left}px`,
                  top: `${top}px`,
                  animationDelay: `${index * 150}ms`,
                  animation: isActive ? 'brickPlace 0.7s ease-out' : 'none',
                }}
              />
            )
          })}
        </div>

        <div className="text-center mt-4">
          <p className="text-xs text-muted-foreground">
            Cada tijolo = {TEST_SECONDS}s de foco
          </p>
        </div>
      </CardContent>

      <style jsx>{`
        @keyframes brickPlace {
          0% {
            opacity: 0;
            transform: scale(0.3) translateY(20px);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1) translateY(-2px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </Card>
  )
}
