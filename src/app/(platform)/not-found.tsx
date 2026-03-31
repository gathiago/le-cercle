import Link from 'next/link'
import { Home } from 'lucide-react'

export default function PlatformNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <p className="text-6xl font-bold text-[var(--color-rosa)]/20 mb-4">404</p>
      <h2 className="text-xl font-bold text-[var(--color-azul-escuro)] mb-2">Página não encontrada</h2>
      <p className="text-sm text-[var(--color-azul-escuro)]/40 mb-6 max-w-sm">
        O conteúdo que você procura não existe ou foi movido.
      </p>
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 h-10 px-6 rounded-xl bg-[var(--color-azul-escuro)] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
      >
        <Home className="h-4 w-4" /> Voltar ao Dashboard
      </Link>
    </div>
  )
}
