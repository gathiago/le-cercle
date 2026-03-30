'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, BookOpen, Library, Users, MessageCircle, Crown, User } from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/semana', label: 'Semana', icon: BookOpen },
  { href: '/biblioteca', label: 'Biblioteca', icon: Library },
  { href: '/encontros', label: 'Encontros', icon: Users },
  { href: '/comunidade', label: 'Comunidade', icon: MessageCircle },
  { href: '/premium', label: 'Premium', icon: Crown },
  { href: '/perfil', label: 'Perfil', icon: User },
]

interface PlatformSidebarProps {
  user: { name: string; avatarUrl: string | null; level: string }
}

export function PlatformSidebar({ user }: PlatformSidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Logo */}
      <div className="p-6 pb-2">
        <h1 className="text-white font-bold text-lg tracking-tight">Le Cercle</h1>
        <p className="text-white/40 text-[10px] tracking-[0.2em] uppercase mt-0.5">
          The Modern Salon
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[var(--color-rosa)]/15 text-[var(--color-rosa)]'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="h-4.5 w-4.5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User Info at Bottom */}
      <div className="p-4">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-[var(--color-rosa)]/20 flex items-center justify-center text-[var(--color-rosa)] text-xs font-bold">
            {user.name?.charAt(0)?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">{user.name}</p>
            <p className="text-white/40 text-xs">{user.level}</p>
          </div>
        </div>
      </div>
    </>
  )
}
