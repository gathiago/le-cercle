import Link from 'next/link'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] bg-[var(--color-surface)] flex flex-col">
      {/* Glass nav */}
      <header className="py-5 px-6 bg-[var(--color-surface)]/80 backdrop-blur-[20px] sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-baseline gap-2.5">
            <span className="text-lg font-bold text-[var(--color-azul-escuro)] tracking-tight">Le Cercle</span>
            <span className="text-[9px] text-[var(--color-rosa)] font-semibold tracking-[2.5px] uppercase">Mardia</span>
          </Link>
          <Link href="/login" className="text-sm font-medium text-[var(--color-azul-escuro)]/40 hover:text-[var(--color-azul-escuro)] transition-colors">
            Ja tem conta? Entrar
          </Link>
        </div>
      </header>

      <main className="flex-1 pb-20">{children}</main>

      <footer className="py-8 text-center text-xs text-[var(--color-azul-escuro)]/25">
        &copy; 2026 Le Cercle &mdash; Idiomas com Mardia
      </footer>
    </div>
  )
}
