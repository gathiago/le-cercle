'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Check, GraduationCap, FileText, Target, ListChecks, Quotes, Clock, Certificate } from '@phosphor-icons/react'

const spring = { type: 'spring' as const, stiffness: 100, damping: 20 }

const sections = [
  'Compreensão oral (Compréhension de l\'oral)',
  'Compreensão escrita (Compréhension des écrits)',
  'Produção escrita (Production écrite)',
  'Produção oral (Production orale)',
]

const features = [
  { icon: Target, title: 'Estrutura da prova', desc: 'Explicação detalhada de cada parte do DELF B2, com tempo, pontuação e critérios de avaliação.' },
  { icon: ListChecks, title: 'Roteiros práticos', desc: 'Passo a passo de como fazer cada parte da prova, com dicas e estratégias testadas.' },
  { icon: Certificate, title: 'Para universidades', desc: 'A certificação que a maioria das universidades francófonas pede para estudo e trabalho.' },
]

const feedbacks = [
  { text: 'O guia me ajudou muito a entender a estrutura da prova. Antes eu não sabia nem por onde começar!', time: '14:22' },
  { text: 'As dicas de produção oral foram essenciais. Passei no DELF B2 de primeira!', time: '09:45' },
]

const faqs = [
  { q: 'Preciso ter nível B2 para usar o guia?', a: 'Não necessariamente. O guia é útil mesmo para quem está se preparando e ainda não chegou ao nível B2. Ele ajuda a entender o que é cobrado e como se preparar.' },
  { q: 'O guia inclui exercícios?', a: 'O foco é na organização e estratégia para a prova. Ele não é uma apostila de exercícios, mas um roteiro completo de como abordar cada parte do exame.' },
  { q: 'Por quanto tempo tenho acesso?', a: 'Para sempre! O acesso é vitalício.' },
  { q: 'Serve para o DELF B1 também?', a: 'O conteúdo é específico para o B2, mas a estrutura geral da prova é similar. Muitas dicas podem ser aproveitadas.' },
]

export default function GuiaDelfB2Page() {
  return (
    <div className="min-h-[100dvh] bg-[var(--color-surface)]">
      {/* Hero */}
      <section className="pt-8 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[50%] h-full bg-gradient-to-l from-[var(--color-laranja-light)]/40 to-transparent pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: 'url(/Estampa-Logo.png)', backgroundSize: '500px', backgroundRepeat: 'repeat' }} />

        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-16 items-center relative">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.1 }}>
            <div className="inline-flex items-center gap-2 bg-[var(--color-laranja)]/[0.08] text-[var(--color-laranja)] text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
              <GraduationCap className="h-3.5 w-3.5" weight="bold" />
              E-book
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-[var(--color-azul-escuro)] tracking-tighter leading-[1.05] mb-4">
              Guia do
              <br />
              <span className="text-[var(--color-laranja)]">DELF B2</span>
            </h1>

            <p className="text-lg text-[var(--color-azul-escuro)]/45 leading-relaxed max-w-[48ch] mb-4">
              E-book que destrincha e organiza a prova do DELF B2, a certificação que a maioria das universidades francófonas pede para estudo e trabalho.
            </p>

            <p className="text-sm text-[var(--color-azul-escuro)]/30 mb-8">
              Por <strong className="text-[var(--color-azul-escuro)]/60">Mardia Brito de Souza Alcantara</strong>
            </p>

            <a href="/produto/guia-delf-b2" className="group inline-flex items-center h-14 px-10 rounded-xl bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-laranja)] text-white font-semibold text-base transition-all active:scale-[0.98] shadow-[0_12px_32px_rgba(252,142,96,0.25)]" style={{ borderTop: '1px solid rgba(255,255,255,0.2)' }}>
              Quero garantir o meu
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-0.5 transition-transform" weight="bold" />
            </a>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ ...spring, delay: 0.3 }} className="hidden lg:block relative">
            <div className="bg-[var(--color-surface-lowest)] rounded-[2rem] p-8 shadow-[0_24px_64px_-16px_rgba(48,51,66,0.06)] relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-laranja)] flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-white" weight="bold" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[var(--color-azul-escuro)]">Guia do DELF B2</p>
                  <p className="text-xs text-[var(--color-azul-escuro)]/35">Roteiro completo da prova</p>
                </div>
              </div>
              <div className="space-y-2.5">
                {sections.map((s, i) => (
                  <motion.div key={s} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ ...spring, delay: 0.5 + i * 0.08 }} className="flex items-center gap-3 py-2.5 px-4 bg-[var(--color-surface-low)] rounded-xl">
                    <Check className="h-4 w-4 text-[var(--color-laranja)] shrink-0" weight="bold" />
                    <span className="text-sm text-[var(--color-azul-escuro)]">{s}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="absolute top-5 -right-3 w-full h-full bg-[var(--color-laranja-light)]/40 rounded-[2rem] -z-10 rotate-2" />
          </motion.div>
        </div>
      </section>

      {/* O que você encontra */}
      <section className="py-20 px-6 bg-[var(--color-surface-low)]">
        <div className="max-w-[1200px] mx-auto">
          <p className="text-[var(--color-laranja)] text-xs font-semibold tracking-[3px] uppercase mb-5">O que você encontra</p>
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-azul-escuro)] tracking-tight leading-tight mb-10">
            Tudo para sua preparação
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-5">
            {features.map((f, i) => {
              const Icon = f.icon
              return (
                <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ ...spring, delay: i * 0.08 }}
                  className="bg-[var(--color-surface-lowest)] rounded-[1.5rem] p-7 shadow-[0_8px_32px_rgba(48,51,66,0.04)]" style={{ order: i === 1 ? 1 : i === 2 ? 3 : 0 }}>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-laranja)] flex items-center justify-center mb-5 shadow-[0_8px_16px_-4px_rgba(0,0,0,0.1)]">
                    <Icon className="h-6 w-6 text-white" weight="bold" />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--color-azul-escuro)] mb-2 tracking-tight">{f.title}</h3>
                  <p className="text-[var(--color-azul-escuro)]/45 leading-relaxed">{f.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Partes da prova */}
      <section className="py-20 px-6">
        <div className="max-w-[1200px] mx-auto">
          <p className="text-[var(--color-laranja)] text-xs font-semibold tracking-[3px] uppercase mb-5">Conteúdo do guia</p>
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-azul-escuro)] tracking-tight leading-tight mb-8">
            Roteiro para cada parte da prova
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {sections.map((s, i) => (
              <motion.div key={s} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ ...spring, delay: i * 0.06 }}
                className="bg-[var(--color-surface-lowest)] rounded-[1.5rem] p-6 shadow-[0_8px_32px_rgba(48,51,66,0.04)] flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-laranja)]/10 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-[var(--color-laranja)]">{i + 1}</span>
                </div>
                <div>
                  <p className="font-bold text-[var(--color-azul-escuro)]">{s}</p>
                  <p className="text-xs text-[var(--color-azul-escuro)]/35 mt-0.5">Explicação + roteiro prático</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quem sou eu */}
      <section className="py-20 px-6 bg-[var(--color-rosa-light)]/40">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-[300px_1fr] gap-16 items-center">
          <div className="flex justify-center md:justify-start">
            <div className="w-60 h-60 md:w-72 md:h-72 rounded-[2rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(147,70,85,0.35)]">
              <img src="/mardia-1.png" alt="Mardia Alcantara" className="w-full h-full object-cover" />
            </div>
          </div>
          <div>
            <p className="text-[var(--color-rosa)] text-xs font-semibold tracking-[3px] uppercase mb-5">Autora</p>
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-azul-escuro)] tracking-tight leading-tight mb-5">Mardia Alcantara</h2>
            <p className="text-[var(--color-azul-escuro)]/50 leading-relaxed max-w-[55ch]">
              Graduada em Química, estudante de Medicina e pós-graduada em Metodologia do Ensino de Francês como Língua Estrangeira. Estudo Francês desde os 13 aninhos e tenho 7 anos de sala de aula.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-[var(--color-laranja)] text-xs font-semibold tracking-[3px] uppercase mb-4">FAQ</p>
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-azul-escuro)] tracking-tight mb-10">Perguntas frequentes</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="group bg-[var(--color-surface-lowest)] rounded-2xl overflow-hidden shadow-[0_4px_16px_rgba(48,51,66,0.03)]">
                <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-[var(--color-azul-escuro)] hover:bg-[var(--color-laranja-light)]/20 transition-colors">
                  {faq.q}
                  <span className="text-[var(--color-laranja)] text-xl group-open:rotate-45 transition-transform ml-4 shrink-0">+</span>
                </summary>
                <p className="px-5 pb-5 text-[var(--color-azul-escuro)]/50 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-laranja)] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none" style={{ backgroundImage: 'url(/Estampa-Formas.png)', backgroundSize: '500px', backgroundRepeat: 'repeat' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/[0.06] rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight mb-5">Garanta o seu guia!</h2>
          <p className="text-white/60 text-lg mb-10 max-w-[40ch] mx-auto leading-relaxed">
            Prepare-se para o DELF B2 com organização e estratégia.
          </p>
          <a href="/produto/guia-delf-b2" className="group inline-flex items-center h-14 px-10 rounded-xl bg-white text-[var(--color-azul-escuro)] font-bold text-base hover:bg-white/90 transition-colors active:scale-[0.98] shadow-[0_12px_32px_rgba(0,0,0,0.1)]">
            Comprar agora
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-0.5 transition-transform" weight="bold" />
          </a>
        </div>
      </section>
    </div>
  )
}
