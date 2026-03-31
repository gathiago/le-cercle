'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, Check, Lock } from '@phosphor-icons/react'
import { Loader2 } from 'lucide-react'

const spring = { type: 'spring' as const, stiffness: 120, damping: 18 }

const clubs = [
  { slug: 'premiers-pas-club', nameFr: 'Premiers Pas Club', namePt: 'Clube Iniciantes', emoji: '1' },
  { slug: 'club-intermediaire', nameFr: 'Club Intermédiaire', namePt: 'Clube Intermediários', emoji: '2' },
  { slug: 'fluent-club', nameFr: 'Fluent Club', namePt: 'Clube Avançados', emoji: '3' },
  { slug: 'nuit-club', nameFr: 'Nuit Club', namePt: 'Clube de Música', emoji: '4' },
  { slug: 'noir-lecture-club', nameFr: 'Noir Lecture Club', namePt: 'Clube de Leitura', emoji: '5' },
  { slug: 'cine-noir-club', nameFr: 'Ciné Noir Club', namePt: 'Clube de Cinema', emoji: '6' },
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

function ClubesContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const planId = searchParams.get('plan') || 'yearly'
  const coupon = searchParams.get('coupon') || ''
  const limit = planLimits[planId] || 1
  const isAll = limit >= 6

  const [selected, setSelected] = useState<string[]>([])

  // Auto-select all for yearly/premium
  useEffect(() => {
    if (isAll) {
      setSelected(clubs.map(c => c.slug))
    }
  }, [isAll])

  function toggleClub(slug: string) {
    if (isAll) return // Can't deselect on yearly/premium
    setSelected(prev => {
      if (prev.includes(slug)) {
        return prev.filter(s => s !== slug)
      }
      if (prev.length >= limit) {
        // Replace the first selected
        return [...prev.slice(1), slug]
      }
      return [...prev, slug]
    })
  }

  function handleContinue() {
    if (selected.length === 0) return
    const params = new URLSearchParams({ plan: planId })
    if (coupon) params.set('coupon', coupon)
    params.set('clubs', selected.join(','))
    router.push(`/checkout/cadastro?${params.toString()}`)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 pt-8">
      <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-[var(--color-azul-escuro)]/35 hover:text-[var(--color-azul-escuro)] mb-8 transition-colors">
        <ArrowLeft className="h-4 w-4" weight="bold" /> Voltar aos planos
      </button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={spring}>
        <p className="text-[var(--color-rosa)] text-xs font-semibold tracking-[3px] uppercase mb-3">Plano {planLabels[planId]}</p>
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-azul-escuro)] tracking-tight mb-2">
          {isAll ? 'Todos os clubes inclusos!' : `Escolha ${limit === 1 ? 'seu clube' : `seus ${limit} clubes`}`}
        </h1>
        <p className="text-[var(--color-azul-escuro)]/40 mb-8">
          {isAll
            ? 'No plano anual você tem acesso a todos os 6 clubes.'
            : `Selecione ${limit === 1 ? '1 clube' : `até ${limit} clubes`} para incluir no seu plano.`
          }
        </p>

        {/* Selection counter */}
        {!isAll && (
          <div className="flex items-center gap-2 mb-6">
            {Array.from({ length: limit }).map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all ${
                  i < selected.length
                    ? 'bg-[var(--color-rosa)] scale-110'
                    : 'bg-[var(--color-surface-low)]'
                }`}
              />
            ))}
            <span className="text-xs text-[var(--color-azul-escuro)]/30 ml-2">
              {selected.length}/{limit} selecionado{selected.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}

        {/* Club cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <AnimatePresence>
            {clubs.map((club, i) => {
              const isSelected = selected.includes(club.slug)
              const isDisabled = !isSelected && selected.length >= limit && !isAll

              return (
                <motion.button
                  key={club.slug}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...spring, delay: i * 0.06 }}
                  onClick={() => toggleClub(club.slug)}
                  disabled={isAll}
                  className={`relative text-left rounded-[1.5rem] p-5 transition-all active:scale-[0.98] ${
                    isSelected
                      ? 'bg-[var(--color-surface-lowest)] shadow-[0_8px_32px_rgba(255,159,175,0.15)]'
                      : isDisabled
                      ? 'bg-[var(--color-surface-low)] opacity-40'
                      : 'bg-[var(--color-surface-lowest)] shadow-[0_4px_16px_rgba(48,51,66,0.04)] hover:shadow-[0_8px_24px_rgba(48,51,66,0.08)]'
                  }`}
                  style={isSelected ? { outline: '2px solid var(--color-rosa)' } : undefined}
                >
                  <div className="flex items-start gap-4">
                    {/* Selection indicator */}
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                      isSelected
                        ? 'bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-rosa)]'
                        : 'bg-[var(--color-surface-low)]'
                    }`}>
                      {isSelected ? (
                        <Check className="h-4 w-4 text-white" weight="bold" />
                      ) : isDisabled ? (
                        <Lock className="h-3.5 w-3.5 text-[var(--color-azul-escuro)]/20" weight="bold" />
                      ) : (
                        <span className="text-xs font-bold text-[var(--color-azul-escuro)]/25">{club.emoji}</span>
                      )}
                    </div>

                    <div>
                      <h3 className={`font-bold tracking-tight transition-colors ${
                        isSelected ? 'text-[var(--color-rosa)]' : 'text-[var(--color-azul-escuro)]'
                      }`}>
                        {club.nameFr}
                      </h3>
                      <p className="text-xs text-[var(--color-azul-escuro)]/35 mt-0.5">{club.namePt}</p>
                    </div>
                  </div>
                </motion.button>
              )
            })}
          </AnimatePresence>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={handleContinue}
            disabled={selected.length === 0}
            className="group w-full sm:w-auto inline-flex items-center justify-center h-14 px-10 rounded-xl bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-laranja)] text-white font-semibold text-base transition-all active:scale-[0.98] shadow-[0_12px_32px_rgba(252,142,96,0.25)] disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ borderTop: '1px solid rgba(255,255,255,0.2)' }}
          >
            Continuar
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-0.5 transition-transform" weight="bold" />
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default function ClubesPage() {
  return (
    <Suspense fallback={<div className="min-h-[100dvh] flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-[var(--color-laranja)]" /></div>}>
      <ClubesContent />
    </Suspense>
  )
}
