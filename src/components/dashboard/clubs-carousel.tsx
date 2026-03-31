'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { Lock, ChevronLeft, ChevronRight } from 'lucide-react'

interface Club {
  id: string
  slug: string
  name: string
  imageUrl: string | null
  subtitle: string
  isMember: boolean
}

export function ClubsCarousel({ clubs }: { clubs: Club[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  function updateScrollState() {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 10)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
  }

  useEffect(() => {
    updateScrollState()
    const el = scrollRef.current
    if (el) el.addEventListener('scroll', updateScrollState, { passive: true })
    window.addEventListener('resize', updateScrollState)
    return () => {
      if (el) el.removeEventListener('scroll', updateScrollState)
      window.removeEventListener('resize', updateScrollState)
    }
  }, [])

  function scroll(dir: 'left' | 'right') {
    const el = scrollRef.current
    if (!el) return
    const cardWidth = 220 + 16 // card + gap
    el.scrollBy({ left: dir === 'left' ? -cardWidth * 2 : cardWidth * 2, behavior: 'smooth' })
  }

  return (
    <div className="relative group/carousel">
      {/* Arrow Left */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-[var(--color-surface-lowest)] shadow-[0_4px_16px_rgba(48,51,66,0.12)] flex items-center justify-center hover:scale-105 transition-transform -ml-3"
        >
          <ChevronLeft className="h-5 w-5 text-[var(--color-azul-escuro)]" />
        </button>
      )}

      {/* Arrow Right */}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-[var(--color-surface-lowest)] shadow-[0_4px_16px_rgba(48,51,66,0.12)] flex items-center justify-center hover:scale-105 transition-transform -mr-3"
        >
          <ChevronRight className="h-5 w-5 text-[var(--color-azul-escuro)]" />
        </button>
      )}

      {/* Fade edges */}
      {canScrollLeft && (
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[var(--color-surface)] to-transparent pointer-events-none z-[5]" />
      )}
      {canScrollRight && (
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[var(--color-surface)] to-transparent pointer-events-none z-[5]" />
      )}

      {/* Cards */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
        style={{ scrollSnapType: 'x mandatory', scrollPadding: '0 16px' }}
      >
        {clubs.map((club) => (
          <div key={club.id} className="shrink-0" style={{ scrollSnapAlign: 'start' }}>
            {club.isMember ? (
              <Link href={`/clube/${club.slug}`} className="block group">
                <div className="relative w-[220px] h-[300px] rounded-[1.5rem] overflow-hidden shadow-[0_8px_32px_rgba(48,51,66,0.1)]">
                  {club.imageUrl ? (
                    <img src={club.imageUrl.startsWith('/uploads/') ? `/api${club.imageUrl}` : club.imageUrl} alt={club.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-rosa)]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h4 className="text-white font-bold text-lg leading-tight">{club.name}</h4>
                    <p className="text-white/60 text-xs mt-0.5">{club.subtitle}</p>
                  </div>
                </div>
              </Link>
            ) : (
              <Link href="/checkout" className="block group">
                <div className="relative w-[220px] h-[300px] rounded-[1.5rem] overflow-hidden shadow-[0_4px_16px_rgba(48,51,66,0.06)]">
                  {club.imageUrl ? (
                    <img src={club.imageUrl.startsWith('/uploads/') ? `/api${club.imageUrl}` : club.imageUrl} alt={club.name} className="absolute inset-0 w-full h-full object-cover grayscale opacity-40" />
                  ) : (
                    <div className="absolute inset-0 bg-[var(--color-surface-low)]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/30 to-black/20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                      <Lock className="h-5 w-5 text-white/70" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h4 className="text-white/60 font-bold text-lg leading-tight">{club.name}</h4>
                    <p className="text-white/30 text-xs mt-0.5">{club.subtitle}</p>
                  </div>
                </div>
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
