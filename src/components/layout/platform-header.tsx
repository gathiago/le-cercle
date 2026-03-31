'use client'

import { Bell, MagnifyingGlass } from '@phosphor-icons/react'
import { ThemeToggle } from '@/components/theme-toggle'

interface PlatformHeaderProps {
  user: { name: string; avatarUrl: string | null; level: string }
}

export function PlatformHeader({ user }: PlatformHeaderProps) {
  const levelLabel = user.level === 'INTERMEDIARIO' ? 'Intermediario' : user.level === 'AVANCADO' ? 'Avancado' : 'Iniciante'

  return (
    <header className="flex items-center justify-between px-5 md:px-8 py-4 bg-[var(--color-surface)]/80 backdrop-blur-[20px] sticky top-0 z-30">
      {/* Mobile Logo */}
      <div className="lg:hidden">
        <h1 className="font-bold text-[var(--color-azul-escuro)] tracking-tight">Le Cercle</h1>
      </div>

      {/* Desktop search */}
      <div className="hidden lg:block relative">
        <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-azul-escuro)]/25" weight="bold" />
        <input
          type="text"
          placeholder="Buscar..."
          className="pl-10 pr-4 py-2 bg-[var(--color-surface-low)] rounded-xl text-sm w-[260px] outline-none focus:ring-2 focus:ring-[var(--color-rosa)]/20 text-[var(--color-azul-escuro)] placeholder:text-[var(--color-azul-escuro)]/20"
        />
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <button className="relative p-2 rounded-xl hover:bg-[var(--color-surface-low)] transition-colors">
          <Bell className="h-5 w-5 text-[var(--color-azul-escuro)]/40" weight="bold" />
        </button>
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold text-[var(--color-azul-escuro)]">{user.name}</p>
            <span className="text-[10px] font-semibold text-[var(--color-rosa)] uppercase tracking-wider">
              {levelLabel}
            </span>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-rosa)] flex items-center justify-center text-white text-sm font-bold shadow-[0_4px_12px_rgba(147,70,85,0.2)]">
            {user.name?.charAt(0)?.toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  )
}
