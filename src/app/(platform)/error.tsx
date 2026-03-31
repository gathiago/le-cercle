'use client'

import { AlertTriangle } from 'lucide-react'

export default function PlatformError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-5">
        <AlertTriangle className="h-7 w-7 text-red-400" />
      </div>
      <h2 className="text-xl font-bold text-[var(--color-azul-escuro)] mb-2">Algo deu errado</h2>
      <p className="text-sm text-[var(--color-azul-escuro)]/40 mb-6 max-w-sm">
        Tivemos um problema ao carregar esta página. Tente novamente.
      </p>
      <button
        onClick={reset}
        className="inline-flex items-center h-10 px-6 rounded-xl bg-[var(--color-rosa)] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
      >
        Tentar novamente
      </button>
    </div>
  )
}
