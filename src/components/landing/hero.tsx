'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Star } from '@phosphor-icons/react'

const spring = { type: 'spring' as const, stiffness: 100, damping: 20 }

export function LandingHero() {
  return (
    <section className="min-h-[100dvh] pt-24 pb-16 px-6 flex items-center relative overflow-hidden bg-[var(--color-surface)]">
      {/* Soulful gradient ambient */}
      <div className="absolute top-0 right-0 w-[55%] h-full bg-gradient-to-l from-[var(--color-rosa-light)]/60 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-gradient-to-tr from-[var(--color-laranja-light)]/30 to-transparent pointer-events-none" />

      <div className="max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-[1fr_460px] gap-20 items-center">
        {/* Left: Content — left-aligned, not centered */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.1 }}
        >
          <div className="inline-flex items-center gap-2 bg-[var(--color-rosa)]/[0.08] text-[var(--color-rosa)] text-xs font-semibold px-4 py-1.5 rounded-full mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-rosa)] animate-pulse" />
            Vagas abertas para novos membros
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-[var(--color-azul-escuro)] tracking-tighter leading-[1.05] mb-6">
            Fale francês com
            <br />
            <span className="text-[var(--color-rosa)]">confiança</span> e prazer.
          </h1>

          <p className="text-lg text-[var(--color-azul-escuro)]/45 leading-relaxed max-w-[48ch] mb-10">
            Conteúdo semanal, encontros ao vivo e uma comunidade
            apaixonada por francês. Sem gramática decorada.
            Com cultura, prática e conexão real.
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-4 mb-14">
            <Link
              href="/checkout"
              className="group inline-flex items-center h-14 px-8 rounded-xl bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-laranja)] text-white font-semibold text-base transition-all active:scale-[0.98] shadow-[0_12px_32px_rgba(252,142,96,0.25)]"
              style={{ borderTop: '1px solid rgba(255,255,255,0.2)' }}
            >
              Quero fazer parte
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-0.5 transition-transform" weight="bold" />
            </Link>
            <span className="text-sm text-[var(--color-azul-escuro)]/30 self-center">A partir de R$ 34,99/mês</span>
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2.5">
              {['I', 'T', 'C', 'M'].map((l, i) => (
                <motion.div
                  key={l}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ ...spring, delay: 0.4 + i * 0.08 }}
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-rosa)] flex items-center justify-center text-white text-xs font-bold"
                  style={{ border: '2.5px solid var(--color-surface)' }}
                >
                  {l}
                </motion.div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-0.5 mb-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 text-amber-400" weight="fill" />)}
              </div>
              <p className="text-xs text-[var(--color-azul-escuro)]/30">Amado por +200 alunas</p>
            </div>
          </div>
        </motion.div>

        {/* Right: Visual card — tonal layering, no borders */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...spring, delay: 0.3 }}
          className="hidden lg:block relative"
        >
          <div className="bg-[var(--color-surface-lowest)] rounded-[2rem] p-8 shadow-[0_24px_64px_-16px_rgba(48,51,66,0.06)] relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-rosa)] flex items-center justify-center">
                <div className="w-5 h-5 rounded-md bg-white/30" />
              </div>
              <div>
                <p className="text-sm font-bold text-[var(--color-azul-escuro)]">Semana 04</p>
                <p className="text-xs text-[var(--color-azul-escuro)]/35">La Culture et les Arts</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {['Le Cinema', 'Le Musee', 'Magnifique', 'L\'Exposition'].map((word, i) => (
                <motion.div
                  key={word}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...spring, delay: 0.6 + i * 0.1 }}
                  className="flex items-center justify-between py-2.5 px-4 bg-[var(--color-surface-low)] rounded-xl"
                >
                  <span className="text-sm font-medium text-[var(--color-azul-escuro)]">{word}</span>
                  <span className="w-6 h-1.5 bg-[var(--color-azul-escuro)]/10 rounded-full" />
                </motion.div>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-[var(--color-surface-low)] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '72%' }}
                  transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-rosa)] rounded-full"
                />
              </div>
              <span className="text-xs font-semibold text-[var(--color-azul-escuro)]/40">72%</span>
            </div>
          </div>

          {/* Tonal layering decorative */}
          <div className="absolute top-5 -right-3 w-full h-full bg-[var(--color-rosa-light)]/40 rounded-[2rem] -z-10 rotate-2" />
          <div className="absolute top-10 -right-6 w-full h-full bg-[var(--color-laranja-light)]/30 rounded-[2rem] -z-20 rotate-[4deg]" />
        </motion.div>
      </div>
    </section>
  )
}
