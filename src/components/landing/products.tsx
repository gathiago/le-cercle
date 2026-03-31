'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { BookOpen, Certificate, PlayCircle, ArrowRight } from '@phosphor-icons/react'

const spring = { type: 'spring' as const, stiffness: 100, damping: 20 }

const products = [
  {
    title: 'Resumos Verbais',
    description:
      'Apostila escrita em portugu\u00eas que explica de forma simplificada os tempos verbais essenciais do franc\u00eas, com bastante exerc\u00edcio. Cont\u00e9m gabarito e v\u00eddeo aulas complementares.',
    badge: 'E-book',
    badgeColor: 'text-[var(--color-rosa)] bg-[var(--color-rosa)]/10',
    href: '/resumos-verbais',
    icon: BookOpen,
    gradient: 'from-[var(--color-primary)] to-[var(--color-rosa)]',
  },
  {
    title: 'Guia do DELF B2',
    description:
      'E-book que destrin\u00e7a e organiza a prova do DELF B2, a certifica\u00e7\u00e3o que a maioria das universidades franc\u00f3fonas pede. Explica\u00e7\u00e3o sobre cada parte da prova e roteiros de como fazer cada uma delas.',
    badge: 'E-book',
    badgeColor: 'text-[var(--color-laranja)] bg-[var(--color-laranja)]/10',
    href: '/resumos-verbais',
    icon: Certificate,
    gradient: 'from-[var(--color-secondary)] to-[var(--color-laranja)]',
  },
  {
    title: 'Presente do Indicativo',
    description:
      'Curso gratuito dispon\u00edvel no YouTube que explica tudo sobre o principal e mais utilizado tempo verbal da l\u00edngua francesa.',
    badge: 'Gratuito',
    badgeColor: 'text-emerald-600 bg-emerald-500/10',
    href: '/curso-gratuito',
    icon: PlayCircle,
    gradient: 'from-emerald-600 to-teal-400',
  },
]

export function LandingProducts() {
  return (
    <section className="py-28 px-6 bg-[var(--color-surface)]">
      <div className="max-w-[1400px] mx-auto">
        {/* Section header */}
        <div className="mb-16">
          <p className="text-[var(--color-rosa)] text-xs font-semibold tracking-[3px] uppercase mb-4">
            Materiais
          </p>
          <h2 className="text-3xl md:text-[2.75rem] font-bold text-[var(--color-azul-escuro)] tracking-tight leading-[1.1]">
            Nossos materiais
          </h2>
          <p className="text-[var(--color-azul-escuro)]/45 mt-4 max-w-[50ch] leading-relaxed">
            Recursos criados pela Mardia para acelerar seu aprendizado do franc&ecirc;s &mdash; do b&aacute;sico ao avan&ccedil;ado.
          </p>
        </div>

        {/* Asymmetric grid: large left + two stacked right */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-5">
          {/* Large card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={spring}
          >
            <Link href={products[0].href} className="group block h-full">
              <div className="relative h-full bg-[var(--color-surface-lowest)] rounded-[2rem] p-8 md:p-10 shadow-[0_8px_32px_rgba(48,51,66,0.04)] overflow-hidden transition-shadow hover:shadow-[0_16px_48px_rgba(48,51,66,0.08)]">
                {/* Background pattern */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.03]"
                  style={{
                    backgroundImage: 'url(/Estampa-Logo.png)',
                    backgroundSize: '300px',
                    backgroundRepeat: 'repeat',
                  }}
                />
                <div className="relative z-10 flex flex-col justify-between h-full min-h-[320px]">
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div
                        className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${products[0].gradient} flex items-center justify-center shadow-[0_8px_24px_rgba(147,70,85,0.2)]`}
                      >
                        <BookOpen className="h-6 w-6 text-white" weight="fill" />
                      </div>
                      <span
                        className={`text-[11px] font-semibold tracking-[2px] uppercase rounded-full px-3.5 py-1 ${products[0].badgeColor}`}
                      >
                        {products[0].badge}
                      </span>
                    </div>
                    <h3 className="text-2xl md:text-[1.75rem] font-bold text-[var(--color-azul-escuro)] tracking-tight mb-4">
                      {products[0].title}
                    </h3>
                    <p className="text-[var(--color-azul-escuro)]/50 leading-relaxed max-w-[48ch]">
                      {products[0].description}
                    </p>
                  </div>
                  <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-[var(--color-rosa)] group-hover:gap-3 transition-all">
                    Saiba mais
                    <ArrowRight className="h-4 w-4" weight="bold" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Two stacked cards */}
          <div className="space-y-5">
            {products.slice(1).map((product, i) => {
              const Icon = product.icon
              return (
                <motion.div
                  key={product.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ ...spring, delay: 0.1 + i * 0.1 }}
                >
                  <Link href={product.href} className="group block">
                    <div className="relative bg-[var(--color-surface-lowest)] rounded-[1.5rem] p-6 shadow-[0_8px_32px_rgba(48,51,66,0.04)] overflow-hidden transition-shadow hover:shadow-[0_16px_48px_rgba(48,51,66,0.08)]">
                      {/* Background pattern */}
                      <div
                        className="pointer-events-none absolute inset-0 opacity-[0.03]"
                        style={{
                          backgroundImage: 'url(/Estampa-Logo.png)',
                          backgroundSize: '200px',
                          backgroundRepeat: 'repeat',
                        }}
                      />
                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                          <div
                            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${product.gradient} flex items-center justify-center shadow-[0_6px_16px_rgba(0,0,0,0.1)]`}
                          >
                            <Icon className="h-5 w-5 text-white" weight="fill" />
                          </div>
                          <span
                            className={`text-[11px] font-semibold tracking-[2px] uppercase rounded-full px-3.5 py-1 ${product.badgeColor}`}
                          >
                            {product.badge}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-[var(--color-azul-escuro)] tracking-tight mb-2">
                          {product.title}
                        </h3>
                        <p className="text-sm text-[var(--color-azul-escuro)]/45 leading-relaxed mb-4">
                          {product.description}
                        </p>
                        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--color-rosa)] group-hover:gap-3 transition-all">
                          {product.badge === 'Gratuito' ? 'Assistir agora' : 'Saiba mais'}
                          <ArrowRight className="h-4 w-4" weight="bold" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
