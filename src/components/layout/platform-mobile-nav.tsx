'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BookOpen, Users, MessageCircle, User } from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/semana', label: 'Semana', icon: BookOpen },
  { href: '/encontros', label: 'Encontros', icon: Users },
  { href: '/comunidade', label: 'Comunidade', icon: MessageCircle },
  { href: '/perfil', label: 'Perfil', icon: User },
]

export function PlatformMobileNav() {
  const pathname = usePathname()

  return (
    <nav className="bg-white/80 backdrop-blur-[20px] px-2 pt-2 pb-[env(safe-area-inset-bottom,8px)]">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-[10px] font-medium transition-colors ${
                isActive
                  ? 'text-[var(--color-laranja)]'
                  : 'text-[var(--color-azul-escuro)]/40'
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
