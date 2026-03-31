'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check, Lightning } from '@phosphor-icons/react'

const spring = { type: 'spring' as const, stiffness: 100, damping: 20 }

const plans = [
  { id: 'monthly', name: 'Mensal', price: '49,90', monthly: '49,90', period: null, features: ['Conteudo semanal', 'Comunidade', 'Encontros online'] },
  { id: 'quarterly', name: 'Trimestral', price: '127,70', monthly: '42,57', period: 'por trimestre', badge: '-15%', features: ['Tudo do Mensal', 'Material PDF', 'Economia de 15%'] },
  { id: 'yearly', name: 'Anual', price: '419,90', monthly: '34,99', period: 'anualmente', badge: 'Popular', popular: true, features: ['Tudo do Mensal', 'Prioridade encontros', 'Economia de 30%'] },
  { id: 'premium', name: 'Premium', price: '899,90', monthly: '74,99', period: 'anualmente', badge: 'Exclusivo', premium: true, features: ['Acesso total', 'Eventos presenciais', 'Experiencia VIP'] },
]

export function LandingPricing() {
  return (
    <section className="py-28 px-6 bg-[var(--color-surface)]" id="planos">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-16">
          <p className="text-[var(--color-rosa)] text-xs font-semibold tracking-[3px] uppercase mb-4">Planos</p>
          <h2 className="text-3xl md:text-[2.75rem] font-bold text-[var(--color-azul-escuro)] tracking-tight">
            Escolha sua jornada.
          </h2>
          <p className="text-[var(--color-azul-escuro)]/40 mt-3 max-w-[38ch] mx-auto">Cancele quando quiser. Sem multa, sem burocracia.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...spring, delay: i * 0.06 }}
              className={`relative rounded-[1.5rem] p-6 transition-all ${
                plan.premium
                  ? 'bg-[var(--color-azul-escuro)] text-white'
                  : 'bg-[var(--color-surface-lowest)]'
              } ${
                plan.popular
                  ? 'shadow-[0_8px_40px_-8px_rgba(255,159,175,0.25)]'
                  : 'shadow-[0_4px_24px_-8px_rgba(48,51,66,0.04)]'
              }`}
              style={plan.popular ? { outline: '2px solid var(--color-rosa)' } : undefined}
            >
              {plan.badge && (
                <div className={`absolute -top-3 right-5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wide ${
                  plan.popular ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-rosa)] text-white' :
                  plan.premium ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-white' :
                  'bg-[var(--color-surface-low)] text-[var(--color-azul-escuro)]/60'
                }`}>
                  {plan.badge}
                </div>
              )}

              <p className={`text-xs font-semibold tracking-[2px] uppercase mb-5 ${plan.premium ? 'text-amber-400' : 'text-[var(--color-rosa)]'}`}>
                {plan.name}
              </p>

              <div className="mb-1">
                <span className={`text-sm ${plan.premium ? 'text-white/40' : 'text-[var(--color-azul-escuro)]/30'}`}>R$</span>
                <span className={`text-3xl font-bold tracking-tight ${plan.premium ? 'text-white' : 'text-[var(--color-azul-escuro)]'}`}>{plan.monthly}</span>
                <span className={`text-sm ${plan.premium ? 'text-white/40' : 'text-[var(--color-azul-escuro)]/30'}`}>/mes</span>
              </div>

              {plan.period && <p className={`text-xs mb-5 ${plan.premium ? 'text-white/25' : 'text-[var(--color-azul-escuro)]/30'}`}>R$ {plan.price} {plan.period}</p>}
              {!plan.period && <div className="mb-5" />}

              <ul className="space-y-2.5 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check className={`h-4 w-4 mt-0.5 shrink-0 ${plan.premium ? 'text-amber-400' : 'text-[var(--color-rosa)]'}`} weight="bold" />
                    <span className={plan.premium ? 'text-white/60' : 'text-[var(--color-azul-escuro)]/55'}>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={`/checkout?plan=${plan.id}`}
                className={`flex items-center justify-center w-full py-3 rounded-xl font-semibold text-sm transition-all active:scale-[0.98] ${
                  plan.popular
                    ? 'bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-laranja)] text-white shadow-[0_8px_20px_rgba(252,142,96,0.2)]'
                    : plan.premium
                    ? 'bg-white text-[var(--color-azul-escuro)] hover:bg-white/90'
                    : 'bg-[var(--color-surface-low)] text-[var(--color-azul-escuro)] hover:bg-[var(--color-rosa-light)]'
                }`}
                style={plan.popular ? { borderTop: '1px solid rgba(255,255,255,0.2)' } : undefined}
              >
                {plan.popular && <Lightning className="h-4 w-4 mr-1.5" weight="fill" />}
                Fazer parte
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
