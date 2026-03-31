'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus } from '@phosphor-icons/react'

const faqs = [
  { q: 'Preciso saber francês para entrar?', a: 'Não! Temos conteúdo para todos os níveis. No onboarding, descobrimos seu nível e personalizamos sua experiência desde o primeiro dia.' },
  { q: 'Como funcionam os encontros ao vivo?', a: 'São encontros semanais por videoconferência com grupos pequenos (máximo 8 pessoas). Prática de conversação guiada pela Mardia em um ambiente acolhedor.' },
  { q: 'Posso cancelar quando quiser?', a: 'Sim, sem multa e sem burocracia. Você mantém acesso até o final do período pago.' },
  { q: 'O que é o plano Premium?', a: 'Além de todo o conteúdo online, você participa de encontros presenciais exclusivos em cidades do Brasil. Cafés, workshops e imersões culturais.' },
  { q: 'Como funciona o pagamento?', a: 'Aceitamos PIX, cartão de crédito e boleto. Aprovação instantânea para PIX e cartão. Acesso liberado imediatamente após o pagamento.' },
]

export function LandingFaq() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="py-24 px-6 bg-zinc-50">
      <div className="max-w-3xl mx-auto">
        <div className="mb-14">
          <p className="text-[var(--color-rosa)] text-xs font-semibold tracking-[3px] uppercase mb-4">FAQ</p>
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 tracking-tight">
            Perguntas frequentes
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = open === i
            return (
              <div
                key={i}
                className={`rounded-2xl overflow-hidden transition-colors ${isOpen ? 'bg-white shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] border border-zinc-100' : 'bg-white/60 border border-transparent hover:bg-white'}`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-semibold text-zinc-900 pr-4">{faq.q}</span>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all ${isOpen ? 'bg-[var(--color-rosa)] rotate-45' : 'bg-zinc-100'}`}>
                    <Plus className={`h-4 w-4 ${isOpen ? 'text-white' : 'text-zinc-500'}`} weight="bold" />
                  </div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <p className="px-5 pb-5 text-zinc-500 leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
