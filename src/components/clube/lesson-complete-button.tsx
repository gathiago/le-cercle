'use client'

import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'

export function LessonCompleteButton({ lessonId, completed: initialCompleted }: { lessonId: string; completed: boolean }) {
  const [completed, setCompleted] = useState(initialCompleted)
  const [loading, setLoading] = useState(false)

  async function toggle() {
    setLoading(true)
    const res = await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lessonId, completed: !completed }),
    })
    if (res.ok) setCompleted(!completed)
    setLoading(false)
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`w-full flex items-center justify-center gap-2 h-12 rounded-xl font-semibold text-sm transition-all active:scale-[0.98] ${
        completed
          ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
          : 'bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-laranja)] text-white shadow-[0_8px_24px_rgba(252,142,96,0.2)]'
      }`}
      style={!completed ? { borderTop: '1px solid rgba(255,255,255,0.2)' } : undefined}
    >
      <CheckCircle2 className="h-4 w-4" />
      {completed ? 'Aula concluída!' : 'Marcar como concluída'}
    </button>
  )
}
