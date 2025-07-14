'use client'

import { Card, CardContent } from './ui/card'

interface Session {
  start: Date
  end: Date
  focus: number
  breakTime: number
}

interface FocusSessionHistoryProps {
  sessions: Session[]
}

function formatDate(date: Date) {
  return (
    date.toLocaleDateString() +
    ' ' +
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  )
}

function formatDuration(sec: number) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

export function FocusSessionHistory({ sessions }: FocusSessionHistoryProps) {
  return (
    <Card className="bg-muted/40 p-4 w-full max-w-md">
      <CardContent className="flex flex-col gap-2 p-0">
        {sessions.length === 0 && (
          <div className="text-muted-foreground text-center py-4">
            Nenhuma sessão finalizada
          </div>
        )}
        {sessions
          .map((s, i) => (
            <div
              key={i}
              className="flex flex-col border-b last:border-b-0 border-border py-2"
            >
              <span className="text-xs text-muted-foreground">
                {formatDate(new Date(s.start))}
              </span>
              <span className="text-sm font-medium">
                Tempo de foco: {formatDuration(s.focus)} + Descanso:{' '}
                {formatDuration(s.breakTime)}
              </span>
            </div>
          ))
          .reverse()}
      </CardContent>
    </Card>
  )
}
