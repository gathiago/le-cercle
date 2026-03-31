'use client'

import { motion } from 'framer-motion'
import { Star, Quotes } from '@phosphor-icons/react'

const spring = { type: 'spring' as const, stiffness: 100, damping: 20 }

const testimonials = [
  { name: 'Isadora B.', level: 'Iniciante para Intermediário', text: 'Em 3 meses consegui me apresentar em francês sem travar. O método da Mardia faz você perder o medo naturalmente.', initials: 'IB', gradient: 'from-[var(--color-primary)] to-[var(--color-rosa)]' },
  { name: 'Thiago R.', level: 'Intermediário', text: 'Os encontros ao vivo mudaram tudo. Praticar com outras pessoas fez eu perder o medo de falar. Já consigo manter conversas inteiras.', initials: 'TR', gradient: 'from-[var(--color-secondary)] to-[var(--color-laranja)]' },
  { name: 'Carolina M.', level: 'Avançado', text: 'A comunidade é o diferencial. Não é só um curso, é uma imersão real na cultura francesa. Me sinto parte de algo especial.', initials: 'CM', gradient: 'from-emerald-600 to-teal-400' },
]

export function LandingTestimonials() {
  return (
    <section className="py-28 px-6 bg-[var(--color-surface-low)]">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="text-[var(--color-rosa)] text-xs font-semibold tracking-[3px] uppercase mb-4">Depoimentos</p>
            <h2 className="text-3xl md:text-[2.75rem] font-bold text-[var(--color-azul-escuro)] tracking-tight">
              Quem faz parte, recomenda.
            </h2>
          </div>
          <div className="flex items-center gap-1.5">
            {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 text-amber-400" weight="fill" />)}
            <span className="text-sm text-[var(--color-azul-escuro)]/35 ml-2">4.9 de 5</span>
          </div>
        </div>

        {/* Asymmetric: 1 large + 2 stacked */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={spring}
            className="bg-[var(--color-surface-lowest)] rounded-[2rem] p-8 md:p-10 shadow-[0_8px_32px_rgba(48,51,66,0.04)] flex flex-col justify-between"
          >
            <div>
              <Quotes className="h-8 w-8 text-[var(--color-rosa)]/20 mb-6" weight="fill" />
              <p className="text-xl md:text-2xl text-[var(--color-azul-escuro)]/70 leading-relaxed font-medium mb-8">
                &ldquo;{testimonials[0].text}&rdquo;
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonials[0].gradient} flex items-center justify-center text-white text-sm font-bold`}>
                {testimonials[0].initials}
              </div>
              <div>
                <p className="font-bold text-[var(--color-azul-escuro)]">{testimonials[0].name}</p>
                <p className="text-xs text-[var(--color-azul-escuro)]/35">{testimonials[0].level}</p>
              </div>
            </div>
          </motion.div>

          <div className="space-y-5">
            {testimonials.slice(1).map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...spring, delay: 0.1 + i * 0.1 }}
                className="bg-[var(--color-surface-lowest)] rounded-[1.5rem] p-6 shadow-[0_8px_32px_rgba(48,51,66,0.04)]"
              >
                <p className="text-[var(--color-azul-escuro)]/55 leading-relaxed mb-5">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white text-xs font-bold`}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[var(--color-azul-escuro)]">{t.name}</p>
                    <p className="text-xs text-[var(--color-azul-escuro)]/35">{t.level}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
