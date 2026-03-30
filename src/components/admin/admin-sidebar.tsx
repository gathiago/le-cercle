'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, BookOpen, Users, Calendar, MessageCircle, Crown, Ticket, Settings } from 'lucide-react'

const adminNav = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/semanas', label: 'Semanas', icon: BookOpen },
  { href: '/admin/membros', label: 'Membros', icon: Users },
  { href: '/admin/encontros', label: 'Encontros', icon: Calendar },
  { href: '/admin/comunidade', label: 'Comunidade', icon: MessageCircle },
  { href: '/admin/premium', label: 'Premium', icon: Crown },
  { href: '/admin/cupons', label: 'Cupons', icon: Ticket },
  { href: '/admin/configuracoes', label: 'Config', icon: Settings },
]

export function AdminSidebar({ userName }: { userName: string }) {
  const pathname = usePathname()

  return (
    <>
      {/* Brand */}
      <div className="p-6 pb-2">
        <h1 className="text-xl font-bold text-[var(--color-azul-escuro)]">Le Cercle</h1>
        <p className="text-[var(--color-rosa)] text-[10px] font-semibold tracking-[3px] uppercase mt-0.5">Admin Console</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 mt-4 space-y-0.5">
        {adminNav.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[var(--color-rosa)]/10 text-[var(--color-rosa)] border-r-3 border-[var(--color-rosa)]'
                  : 'text-gray-500 hover:text-[var(--color-azul-escuro)] hover:bg-gray-50'
              }`}
            >
              <Icon className={`h-[18px] w-[18px] ${isActive ? 'text-[var(--color-rosa)]' : ''}`} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Back to site */}
      <div className="p-4 border-t border-gray-100">
        <Link href="/dashboard" className="text-xs text-gray-400 hover:text-[var(--color-azul-escuro)] transition-colors flex items-center gap-2">
          &larr; Voltar ao site
        </Link>
      </div>
    </>
  )
}
