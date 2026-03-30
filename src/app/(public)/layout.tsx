export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      <header className="py-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--color-azul-escuro)]">
          Le Cercle
        </h1>
      </header>
      <main className="pb-16">{children}</main>
      <footer className="py-8 text-center text-sm text-muted-foreground">
        &copy; 2026 Le Cercle &mdash; Idiomas com Mardia
      </footer>
    </div>
  )
}
