export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface)] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-azul-escuro)]">
            Le Cercle
          </h1>
          <p className="text-sm text-muted-foreground mt-1 tracking-widest uppercase">
            The Modern Salon
          </p>
        </div>
        {children}
      </div>
    </div>
  )
}
