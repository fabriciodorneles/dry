'use client'

import { useState, useRef } from 'react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Flag, Pause, Play } from 'lucide-react'

interface FocusTimerProps {
  onSessionEnd: (session: {
    start: Date
    end: Date
    focus: number
    breakTime: number
  }) => void
}

export function FocusTimer({ onSessionEnd }: FocusTimerProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [focusSeconds, setFocusSeconds] = useState(0)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  function start() {
    setIsRunning(true)
    setIsPaused(false)
    setStartTime(new Date())
    intervalRef.current = setInterval(() => {
      setFocusSeconds((prev) => prev + 1)
    }, 1000)
  }

  function pause() {
    setIsPaused(true)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  function resume() {
    setIsPaused(false)
    intervalRef.current = setInterval(() => {
      setFocusSeconds((prev) => prev + 1)
    }, 1000)
  }

  function stop() {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setIsRunning(false)
    setIsPaused(false)
    const end = new Date()
    onSessionEnd({
      start: startTime || new Date(),
      end,
      focus: focusSeconds,
      breakTime: Math.floor(focusSeconds / 180) * 60,
    })
    setFocusSeconds(0)
    setStartTime(null)
  }

  function format(sec: number) {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const balance = focusSeconds - Math.floor(focusSeconds / 180) * 60
  const breakAccum = Math.floor(focusSeconds / 180) * 60

  return (
    <Card className="bg-muted/40 p-4 w-full max-w-md">
      <CardContent className="flex flex-col gap-4 p-0">
        <div className="flex gap-2 mb-2">
          <div className="flex-1 flex flex-col items-center">
            <span className="text-xs tracking-widest text-muted-foreground">
              FOCUS
            </span>
            <span className="text-2xl font-bold text-primary bg-primary/10 rounded px-2 py-1">
              {format(focusSeconds)}
            </span>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <span className="text-xs tracking-widest text-muted-foreground">
              BREAKS
            </span>
            <span className="text-2xl font-bold text-muted-foreground bg-muted/30 rounded px-2 py-1">
              {format(breakAccum)}
            </span>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <span className="text-xs tracking-widest text-muted-foreground">
              BALANCE
            </span>
            <span className="text-2xl font-bold text-muted-foreground bg-muted/30 rounded px-2 py-1">
              {format(balance)}
            </span>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <Button
            variant="secondary"
            className="flex-1 flex gap-2 items-center justify-center text-lg font-bold h-12"
            onClick={() => {
              if (!isRunning) start()
              else if (isPaused) resume()
              else pause()
            }}
          >
            {isRunning && !isPaused ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
            {isRunning && !isPaused ? 'TAKE A BREAK' : 'FOCUS'}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12"
            onClick={stop}
            disabled={!isRunning}
          >
            <Flag className="w-6 h-6" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
