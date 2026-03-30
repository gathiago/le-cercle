'use client'

import { Bell } from 'lucide-react'

interface PlatformHeaderProps {
  user: { name: string; avatarUrl: string | null; level: string }
}

export function PlatformHeader({ user }: PlatformHeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 md:px-8 py-4">
      {/* Mobile Logo */}
      <div className="lg:hidden">
        <h1 className="font-bold text-[var(--color-azul-escuro)] tracking-tight">Le Cercle</h1>
      </div>
      <div className="hidden lg:block" />

      {/* Right side */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-xl hover:bg-[var(--color-surface-low)] transition-colors">
          <Bell className="h-5 w-5 text-[var(--color-azul-escuro)]/60" />
        </button>
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-[var(--color-azul-escuro)]">{user.name}</p>
            <span className="inline-block bg-[var(--color-rosa-light)] text-[var(--color-azul-escuro)] text-[10px] font-semibold px-2 py-0.5 rounded-full tracking-wide">
              {user.level === 'INTERMEDIARIO' ? 'Intermediário' : user.level === 'AVANCADO' ? 'Avançado' : 'Iniciante'}
            </span>
          </div>
          <div className="w-9 h-9 rounded-full bg-[var(--color-rosa)] flex items-center justify-center text-white text-sm font-bold">
            {user.name?.charAt(0)?.toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  )
}
