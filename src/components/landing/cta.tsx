'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from '@phosphor-icons/react'

const spring = { type: 'spring' as const, stiffness: 100, damping: 20 }

export function LandingCta() {
  return (
    <section className="py-28 px-6 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-rosa)] relative overflow-hidden">
      {/* Estampa de fundo */}
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none" style={{ backgroundImage: 'url(/Estampa-Logo.png)', backgroundSize: '500px', backgroundRepeat: 'repeat' }} />
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/[0.06] rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={spring}
        className="max-w-3xl mx-auto text-center relative"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight mb-5">
          Sua jornada no francês
          <br />
          começa aqui.
        </h2>
        <p className="text-white/60 text-lg mb-10 max-w-[42ch] mx-auto leading-relaxed">
          Junte-se a centenas de alunas que já transformaram sua relação com o idioma.
        </p>
        <Link
          href="/checkout"
          className="group inline-flex items-center h-14 px-10 rounded-xl bg-white text-[var(--color-azul-escuro)] font-bold text-base hover:bg-white/90 transition-colors active:scale-[0.98] shadow-[0_12px_32px_rgba(0,0,0,0.1)]"
        >
          Quero fazer parte
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-0.5 transition-transform" weight="bold" />
        </Link>
      </motion.div>
    </section>
  )
}
