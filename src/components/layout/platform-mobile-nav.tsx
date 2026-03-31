'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { House, BookOpen, VideoCamera, ChatCircleDots, UserCircle } from '@phosphor-icons/react'

const navItems = [
  { href: '/dashboard', label: 'Home', icon: House },
  { href: '/semana', label: 'Semana', icon: BookOpen },
  { href: '/encontros', label: 'Encontros', icon: VideoCamera },
  { href: '/comunidade', label: 'Comunidade', icon: ChatCircleDots },
  { href: '/perfil', label: 'Perfil', icon: UserCircle },
]

export function PlatformMobileNav() {
  const pathname = usePathname()

  return (
    <nav className="bg-[var(--color-surface-lowest)]/80 backdrop-blur-[20px] px-2 pt-2 pb-[env(safe-area-inset-bottom,8px)] shadow-[0_-4px_24px_rgba(48,51,66,0.04)]">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-[10px] font-medium transition-colors ${
                isActive ? 'text-[var(--color-rosa)]' : 'text-[var(--color-azul-escuro)]/30'
              }`}
            >
              <Icon className="h-5 w-5" weight={isActive ? 'fill' : 'regular'} />
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
