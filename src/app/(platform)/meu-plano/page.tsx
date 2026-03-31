'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Check, Lock, Crown, ArrowRight } from '@phosphor-icons/react'
import { Loader2 } from 'lucide-react'

const spring = { type: 'spring' as const, stiffness: 120, damping: 18 }

const allClubs = [
  { slug: 'premiers-pas-club', nameFr: 'Premiers Pas Club', namePt: 'Clube Iniciantes' },
  { slug: 'club-intermediaire', nameFr: 'Club Intermédiaire', namePt: 'Clube Intermediários' },
  { slug: 'fluent-club', nameFr: 'Fluent Club', namePt: 'Clube Avançados' },
  { slug: 'nuit-club', nameFr: 'Nuit Club', namePt: 'Clube de Música' },
  { slug: 'noir-lecture-club', nameFr: 'Noir Lecture Club', namePt: 'Clube de Leitura' },
  { slug: 'cine-noir-club', nameFr: 'Ciné Noir Club', namePt: 'Clube de Cinema' },
]

const planLimits: Record<string, number> = {
  monthly: 1,
  quarterly: 3,
  yearly: 6,
  premium: 6,
}

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
  const router = useRouter()
  const [myClubs, setMyClubs] = useState<string[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const plan = (session?.user as any)?.subscriptionPlan || 'monthly'
  const limit = planLimits[plan] || 1
  const isAll = limit >= 6

  useEffect(() => {
    fetch('/api/my-clubs')
      .then(r => r.json())
      .then(data => {
        const slugs = (data.clubs || []).map((c: any) => c.club?.slug || c.slug)
        setMyClubs(slugs)
        setSelected(isAll ? allClubs.map(c => c.slug) : slugs)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [isAll])

  function toggleClub(slug: string) {
    if (isAll) return
    setSelected(prev => {
      if (prev.includes(slug)) return prev.filter(s => s !== slug)
      if (prev.length >= limit) return [...prev.slice(1), slug]
      return [...prev, slug]
    })
    setSaved(false)
  }

  async function handleSave() {
    setSaving(true)
    await fetch('/api/my-clubs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clubs: selected }),
    })
    setMyClubs(selected)
    setSaving(false)
    setSaved(true)
    setTimeout(() => router.refresh(), 500)
  }

  const hasChanges = JSON.stringify(selected.sort()) !== JSON.stringify(myClubs.sort())

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
            : `Seu plano inclui ${limit} clube${limit > 1 ? 's' : ''}. Selecione abaixo.`
          }
        </p>
      </div>

      {/* Selection counter */}
      {!isAll && (
        <div className="flex items-center gap-2 mb-6">
          {Array.from({ length: limit }).map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all ${
                i < selected.length ? 'bg-[var(--color-rosa)] scale-110' : 'bg-[var(--color-surface-low)]'
              }`}
            />
          ))}
          <span className="text-xs text-[var(--color-azul-escuro)]/30 ml-2">
            {selected.length}/{limit} selecionado{limit > 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* Club cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {allClubs.map((club, i) => {
          const isSelected = selected.includes(club.slug)
          const isDisabled = !isSelected && selected.length >= limit && !isAll
          const color = clubColors[i]

          return (
            <motion.button
              key={club.slug}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: i * 0.05 }}
              onClick={() => toggleClub(club.slug)}
              disabled={isAll}
              className={`relative text-left rounded-[1.5rem] p-5 transition-all active:scale-[0.98] ${
                isSelected
                  ? 'bg-[var(--color-surface-lowest)] shadow-[0_8px_32px_rgba(255,159,175,0.12)]'
                  : isDisabled
                  ? 'bg-[var(--color-surface-low)] opacity-35'
                  : 'bg-[var(--color-surface-lowest)] shadow-[0_4px_16px_rgba(48,51,66,0.04)] hover:shadow-[0_8px_24px_rgba(48,51,66,0.08)]'
              }`}
              style={isSelected ? { outline: '2px solid var(--color-rosa)' } : undefined}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                  isSelected
                    ? `bg-gradient-to-br ${color}`
                    : isDisabled
                    ? 'bg-[var(--color-surface-low)]'
                    : `bg-gradient-to-br ${color} opacity-60`
                }`}>
                  {isSelected ? (
                    <Check className="h-4 w-4 text-white" weight="bold" />
                  ) : isDisabled ? (
                    <Lock className="h-3.5 w-3.5 text-[var(--color-azul-escuro)]/20" weight="bold" />
                  ) : (
                    <span className="text-sm font-bold text-white">{club.nameFr.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <h3 className={`font-bold tracking-tight text-sm ${isSelected ? 'text-[var(--color-rosa)]' : 'text-[var(--color-azul-escuro)]'}`}>
                    {club.nameFr}
                  </h3>
                  <p className="text-[10px] text-[var(--color-azul-escuro)]/35">{club.namePt}</p>
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Save button */}
      {!isAll && (
        <div className="text-center">
          {saved ? (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-emerald-600 font-semibold"
            >
              Clubes salvos com sucesso!
            </motion.p>
          ) : (
            <button
              onClick={handleSave}
              disabled={saving || !hasChanges || selected.length === 0}
              className="group inline-flex items-center h-12 px-8 rounded-xl bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-laranja)] text-white font-semibold transition-all active:scale-[0.98] shadow-[0_8px_24px_rgba(252,142,96,0.2)] disabled:opacity-30"
              style={{ borderTop: '1px solid rgba(255,255,255,0.2)' }}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                <>
                  Salvar meus clubes
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" weight="bold" />
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* Upgrade CTA */}
      {!isAll && (
        <div className="mt-10 bg-gradient-to-br from-[var(--color-rosa-light)] to-[var(--color-laranja-light)] rounded-[1.5rem] p-6 text-center">
          <h3 className="font-bold text-[var(--color-azul-escuro)] mb-2">Quer acesso a todos os clubes?</h3>
          <p className="text-sm text-[var(--color-azul-escuro)]/50 mb-4">
            Com o plano Anual você tem todos os 6 clubes inclusos. Com o Premium, ainda ganha encontros presenciais no Rio de Janeiro.
          </p>
          <a href="/checkout" className="inline-flex items-center gap-2 text-[var(--color-laranja)] font-semibold text-sm hover:text-[var(--color-laranja-hover)]">
            Ver planos <ArrowRight className="h-4 w-4" weight="bold" />
          </a>
        </div>
      )}
    </div>
  )
}
