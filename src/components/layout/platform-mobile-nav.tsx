'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { House, BookOpen, VideoCamera, ChatCircleDots, DotsThree, X, PlayCircle, Books, Crown, UserCircle } from '@phosphor-icons/react'

const mainNav = [
  { href: '/dashboard', label: 'Home', icon: House },
  { href: '/semana', label: 'Semana', icon: BookOpen },
  { href: '/encontros', label: 'Encontros', icon: VideoCamera },
  { href: '/comunidade', label: 'Social', icon: ChatCircleDots },
]

const moreNav = [
  { href: '/conteudo-gratuito', label: 'Conteúdo Grátis', icon: PlayCircle },
  { href: '/biblioteca', label: 'Biblioteca', icon: Books },
  { href: '/meu-plano', label: 'Meu Plano', icon: Crown },
  { href: '/perfil', label: 'Perfil', icon: UserCircle },
]

export function PlatformMobileNav() {
  const pathname = usePathname()
  const [showMore, setShowMore] = useState(false)

  const isMoreActive = moreNav.some(item => pathname === item.href || pathname.startsWith(item.href + '/'))

  return (
    <>
      {/* More menu overlay */}
      {showMore && (
        <div className="fixed inset-0 z-50" onClick={() => setShowMore(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="absolute bottom-0 left-0 right-0 bg-[var(--color-surface-lowest)] rounded-t-[2rem] p-6 pb-[calc(env(safe-area-inset-bottom,8px)+1rem)] shadow-[0_-8px_32px_rgba(0,0,0,0.15)]" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm font-bold text-[var(--color-azul-escuro)]">Mais opções</p>
              <button onClick={() => setShowMore(false)} className="p-1.5 rounded-lg hover:bg-[var(--color-surface-low)]">
                <X className="h-5 w-5 text-[var(--color-azul-escuro)]/40" weight="bold" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {moreNav.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setShowMore(false)}
                    className={`flex items-center gap-3 p-3.5 rounded-xl transition-colors ${
                      isActive ? 'bg-[var(--color-rosa)]/10 text-[var(--color-rosa)]' : 'bg-[var(--color-surface-low)] text-[var(--color-azul-escuro)]/60'
                    }`}
                  >
                    <Icon className="h-5 w-5" weight={isActive ? 'fill' : 'regular'} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bottom nav bar */}
      <nav className="bg-[var(--color-surface-lowest)]/80 backdrop-blur-[20px] px-2 pt-2 pb-[env(safe-area-inset-bottom,8px)] shadow-[0_-4px_24px_rgba(48,51,66,0.04)]">
        <div className="flex items-center justify-around">
          {mainNav.map((item) => {
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
          <button
            onClick={() => setShowMore(!showMore)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-[10px] font-medium transition-colors ${
              isMoreActive ? 'text-[var(--color-rosa)]' : 'text-[var(--color-azul-escuro)]/30'
            }`}
          >
            <DotsThree className="h-5 w-5" weight="bold" />
            Mais
          </button>
        </div>
      </nav>
    </>
  )
}
