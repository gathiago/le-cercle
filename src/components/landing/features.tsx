'use client'

import { motion } from 'framer-motion'
import { BookOpen, Microphone, UsersThree, MapPin } from '@phosphor-icons/react'

const spring = { type: 'spring' as const, stiffness: 100, damping: 20 }

const features = [
  { icon: BookOpen, title: 'Conteudo Semanal', desc: 'Videos, musicas, vocabulario e exercicios novos toda semana. Aprenda no seu ritmo com conteudo cultural imersivo.', accent: 'from-[var(--color-primary)] to-[var(--color-rosa)]' },
  { icon: Microphone, title: 'Encontros ao Vivo', desc: 'Conversacao real com grupos pequenos de ate 8 pessoas. Desbloqueie sua fala com pratica guiada pela Mardia.', accent: 'from-[var(--color-secondary)] to-[var(--color-laranja)]' },
  { icon: UsersThree, title: 'Comunidade Exclusiva', desc: 'Compartilhe progresso, tire duvidas e faca amizades com quem ama o frances. Apoio diario dentro do grupo.', accent: 'from-emerald-600 to-emerald-400' },
  { icon: MapPin, title: 'Eventos Presenciais', desc: 'Cafes, workshops e encontros em cidades do Brasil. Imersao alem da tela, exclusivo para membros Premium.', accent: 'from-amber-600 to-amber-400' },
]

export function LandingFeatures() {
  return (
    <section className="py-28 px-6 bg-[var(--color-surface)]">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-16">
          <p className="text-[var(--color-rosa)] text-xs font-semibold tracking-[3px] uppercase mb-4">Como funciona</p>
          <h2 className="text-3xl md:text-[2.75rem] font-bold text-[var(--color-azul-escuro)] tracking-tight leading-[1.1] max-w-[40ch]">
            Tudo que voce precisa para falar frances de verdade.
          </h2>
        </div>

        {/* Zig-zag 2-col layout — no 3-column card grids */}
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-5">
          {features.map((f, i) => {
            const Icon = f.icon
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ ...spring, delay: i * 0.08 }}
                className="bg-[var(--color-surface-low)] rounded-[1.5rem] p-8 hover:bg-[var(--color-surface-lowest)] hover:shadow-[0_16px_48px_-12px_rgba(48,51,66,0.06)] transition-all group"
                style={{ order: i === 1 ? 1 : i === 2 ? 3 : i === 3 ? 2 : 0 }}
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.accent} flex items-center justify-center mb-5 shadow-[0_8px_16px_-4px_rgba(0,0,0,0.1)]`}>
                  <Icon className="h-6 w-6 text-white" weight="bold" />
                </div>
                <h3 className="text-lg font-bold text-[var(--color-azul-escuro)] mb-2 tracking-tight">{f.title}</h3>
                <p className="text-[var(--color-azul-escuro)]/45 leading-relaxed max-w-[45ch]">{f.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
