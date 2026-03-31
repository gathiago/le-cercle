export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex bg-[var(--color-surface)]">
      {/* Left: Decorative panel — asymmetric split */}
      <div className="hidden lg:flex w-[45%] bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-rosa)] relative overflow-hidden items-end p-12">
        {/* Estampa de fundo */}
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none" style={{ backgroundImage: 'url(/Estampa-Logo.png)', backgroundSize: '180px', backgroundRepeat: 'repeat' }} />
        {/* Ambient shapes */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/[0.06] rounded-full blur-[80px]" />
        <div className="absolute bottom-20 left-10 w-48 h-48 bg-white/[0.04] rounded-full blur-[60px]" />

        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-white tracking-tight leading-tight mb-4">
            Votre voyage<br />commence ici.
          </h2>
          <p className="text-white/50 text-base max-w-[35ch] leading-relaxed">
            Conteúdo semanal, encontros ao vivo e uma comunidade apaixonada por francês.
          </p>
          <div className="flex items-center gap-3 mt-8">
            <div className="flex -space-x-2">
              {['I', 'T', 'M'].map((l, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold" style={{ border: '2px solid rgba(255,255,255,0.1)' }}>
                  {l}
                </div>
              ))}
            </div>
            <span className="text-white/40 text-xs">+200 membros ativos</span>
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--color-azul-escuro)]">Le Cercle</h1>
            <p className="text-[9px] text-[var(--color-rosa)] font-semibold tracking-[2.5px] uppercase mt-1">The Modern Salon</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
