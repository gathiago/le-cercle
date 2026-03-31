'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Check, Lock, Crown, ArrowRight } from '@phosphor-icons/react'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

const spring = { type: 'spring' as const, stiffness: 120, damping: 18 }

const allClubs = [
  { slug: 'premiers-pas-club', nameFr: 'Premiers Pas Club', namePt: 'Clube de Iniciantes' },
  { slug: 'club-intermediaire', nameFr: 'Club Intermédiaire', namePt: 'Clube de Intermediários' },
  { slug: 'fluent-club', nameFr: 'Fluent Club', namePt: 'Clube de Avançados' },
  { slug: 'nuit-club', nameFr: 'Nuit Club', namePt: 'Clube de Música' },
  { slug: 'noir-lecture-club', nameFr: 'Noir Lecture Club', namePt: 'Clube de Leitura' },
  { slug: 'cine-noir-club', nameFr: 'Ciné Noir Club', namePt: 'Clube de Cinema' },
]

const planLabels: Record<string, string> = {
  monthly: 'Mensal',
  quarterly: 'Trimestral',
  yearly: 'Anual',
  premium: 'Premium',
}

const clubColors = [
  'from-[var(--color-primary)] to-[var(--color-rosa)]',
  'from-[var(--color-secondary)] to-[var(--color-laranja)]',
  'from-emerald-600 to-emerald-400',
  'from-violet-600 to-violet-400',
  'from-amber-600 to-amber-400',
  'from-sky-600 to-sky-400',
]

export default function MeuPlanoPage() {
  const { data: session } = useSession()
  const [myClubs, setMyClubs] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const plan = (session?.user as any)?.subscriptionPlan || 'monthly'
  const isAll = plan === 'yearly' || plan === 'premium'

  useEffect(() => {
    fetch('/api/my-clubs')
      .then(r => r.json())
      .then((data) => {
        const slugs = (data.clubs || []).map((c: any) => c.club?.slug || c.slug)
        setMyClubs(slugs)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--color-rosa)]" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Plan info */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-[var(--color-azul-escuro)] tracking-tight">Meu Plano</h1>
          <span className="inline-flex items-center gap-1 bg-[var(--color-rosa)]/10 text-[var(--color-rosa)] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {plan === 'premium' && <Crown className="h-3 w-3" weight="fill" />}
            {planLabels[plan]}
          </span>
        </div>
        <p className="text-[var(--color-azul-escuro)]/40">
          {isAll
            ? 'Você tem acesso a todos os 6 clubes.'
            : `Seu plano inclui ${myClubs.length} clube${myClubs.length !== 1 ? 's' : ''}.`
          }
        </p>
      </div>

      {/* Club cards - read only */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {allClubs.map((club, i) => {
          const isMember = myClubs.includes(club.slug)
          const color = clubColors[i]

          return (
            <motion.div
              key={club.slug}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: i * 0.05 }}
              className={`relative text-left rounded-[1.5rem] p-5 transition-all ${
                isMember
                  ? 'bg-[var(--color-surface-lowest)] shadow-[0_8px_32px_rgba(255,159,175,0.12)]'
                  : 'bg-[var(--color-surface-low)] opacity-35'
              }`}
              style={isMember ? { outline: '2px solid var(--color-rosa)' } : undefined}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                  isMember
                    ? `bg-gradient-to-br ${color}`
                    : 'bg-[var(--color-surface-low)]'
                }`}>
                  {isMember ? (
                    <Check className="h-4 w-4 text-white" weight="bold" />
                  ) : (
                    <Lock className="h-3.5 w-3.5 text-[var(--color-azul-escuro)]/20" weight="bold" />
                  )}
                </div>
                <div>
                  <h3 className={`font-bold tracking-tight text-sm ${isMember ? 'text-[var(--color-rosa)]' : 'text-[var(--color-azul-escuro)]'}`}>
                    {club.nameFr}
                  </h3>
                  <p className="text-[10px] text-[var(--color-azul-escuro)]/35">{club.namePt}</p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Upgrade CTA */}
      {!isAll && (
        <div className="bg-gradient-to-br from-[var(--color-rosa-light)] to-[var(--color-laranja-light)] rounded-[1.5rem] p-6 text-center">
          <h3 className="font-bold text-[var(--color-azul-escuro)] mb-2">Quer acesso a mais clubes?</h3>
          <p className="text-sm text-[var(--color-azul-escuro)]/50 mb-4">
            Faça um upgrade do seu plano para desbloquear mais clubes. Com o plano Anual você tem todos os 6 clubes inclusos.
          </p>
          <Link href="/checkout" className="inline-flex items-center gap-2 text-[var(--color-laranja)] font-semibold text-sm hover:text-[var(--color-laranja-hover)]">
            Ver planos <ArrowRight className="h-4 w-4" weight="bold" />
          </Link>
        </div>
      )}
    </div>
  )
}
