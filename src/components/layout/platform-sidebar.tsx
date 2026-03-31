'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { House, BookOpen, Books, VideoCamera, ChatCircleDots, Crown, UserCircle } from '@phosphor-icons/react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: House },
  { href: '/semana', label: 'Semana', icon: BookOpen },
  { href: '/biblioteca', label: 'Biblioteca', icon: Books },
  { href: '/encontros', label: 'Encontros', icon: VideoCamera },
  { href: '/comunidade', label: 'Comunidade', icon: ChatCircleDots },
  { href: '/premium', label: 'Premium', icon: Crown },
  { href: '/perfil', label: 'Perfil', icon: UserCircle },
]

interface PlatformSidebarProps {
  user: { name: string; avatarUrl: string | null; level: string }
}

export function PlatformSidebar({ user }: PlatformSidebarProps) {
  const pathname = usePathname()

  const levelLabel = user.level === 'INTERMEDIARIO' ? 'Intermediario' : user.level === 'AVANCADO' ? 'Avancado' : 'Iniciante'

  return (
    <>
      {/* Brand */}
      <div className="p-6 pb-3">
        <h1 className="text-white font-bold text-lg tracking-tight">Le Cercle</h1>
        <p className="text-[var(--color-rosa)] text-[9px] font-semibold tracking-[2.5px] uppercase mt-1">
          The Modern Salon
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[var(--color-rosa)]/15 text-[var(--color-rosa)]'
                  : 'text-white/40 hover:text-white/80 hover:bg-white/[0.04]'
              }`}
            >
              <Icon className="h-[18px] w-[18px]" weight={isActive ? 'fill' : 'regular'} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="p-4">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/[0.04]">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-rosa)] flex items-center justify-center text-white text-xs font-bold shrink-0">
            {user.name?.charAt(0)?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">{user.name}</p>
            <p className="text-white/25 text-[10px] uppercase tracking-wider font-semibold">{levelLabel}</p>
          </div>
        </div>
      </div>
    </>
  )
}
