'use client'

import { useState } from 'react'
import { FocusTimer } from '@/components/focus-timer'
import { FocusSessionHistory } from '@/components/focus-session-history'

interface Session {
  start: Date
  end: Date
  focus: number
  breakTime: number
}

export default function FocusTrackerPage() {
  const [sessions, setSessions] = useState<Session[]>([])

  function handleSessionEnd(session: Session) {
    setSessions((prev) => [...prev, session])
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh] p-8 px-4">
      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-5xl">
        <div className="flex-1 flex justify-center">
          <FocusTimer onSessionEnd={handleSessionEnd} />
        </div>
        <div className="flex-1 flex justify-center">
          <FocusSessionHistory sessions={sessions} />
        </div>
      </div>
    </main>
  )
}
