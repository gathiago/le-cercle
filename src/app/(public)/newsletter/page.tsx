'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { EnvelopeSimple, PaperPlaneTilt, CheckCircle, SpinnerGap } from '@phosphor-icons/react'

const spring = { type: 'spring' as const, stiffness: 100, damping: 20 }

export default function NewsletterPage() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return

    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name: name || undefined }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Erro ao inscrever')
      }

      setStatus('success')
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro inesperado. Tente novamente.')
      setStatus('error')
    }
  }

  return (
    <div className="min-h-[100dvh] bg-[var(--color-surface)] relative overflow-hidden">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'url(/Estampa-Logo.png)',
          backgroundSize: '180px',
          backgroundRepeat: 'repeat',
        }}
      />

      {/* Decorative gradient blobs */}
      <div className="absolute top-0 right-0 w-[50%] h-[60%] bg-gradient-to-bl from-[var(--color-rosa-light)]/40 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-gradient-to-tr from-[var(--color-laranja-light)]/30 to-transparent pointer-events-none" />

      <div className="relative flex items-center justify-center min-h-[100dvh] px-6 py-16">
        <div className="w-full max-w-xl">
          {/* Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...spring, delay: 0.1 }}
            className="flex justify-center mb-8"
          >
            <div className="w-16 h-16 rounded-[1.25rem] bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-rosa)] flex items-center justify-center shadow-[0_16px_48px_-8px_rgba(147,70,85,0.3)]">
              <EnvelopeSimple className="h-7 w-7 text-white" weight="bold" />
            </div>
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.2 }}
            className="text-center mb-10"
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-azul-escuro)] tracking-tight mb-4">
              Newsletter <span className="text-[var(--color-rosa)]">Le Cercle</span>
            </h1>
            <p className="text-[var(--color-azul-escuro)]/50 leading-relaxed max-w-[48ch] mx-auto">
              Coucou! Receba todo dia 15 curiosidades culturais e cronogramas de atividades para quatro semanas de estudo.
            </p>
          </motion.div>

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.35 }}
            className="bg-[var(--color-surface-lowest)] rounded-[2rem] p-8 sm:p-10 shadow-[0_24px_64px_-16px_rgba(48,51,66,0.06)]"
          >
            {status === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={spring}
                className="text-center py-8"
              >
                <div className="flex justify-center mb-5">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-emerald-500" weight="bold" />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-[var(--color-azul-escuro)] mb-2">
                  Merci! Voce esta na lista.
                </h2>
                <p className="text-sm text-[var(--color-azul-escuro)]/40">
                  Fique de olho no seu e-mail.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name field */}
                <div>
                  <label
                    htmlFor="newsletter-name"
                    className="block text-sm font-medium text-[var(--color-azul-escuro)]/60 mb-2"
                  >
                    Nome <span className="text-[var(--color-azul-escuro)]/25">(opcional)</span>
                  </label>
                  <input
                    id="newsletter-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome"
                    className="w-full h-12 px-4 rounded-xl bg-[var(--color-surface-low)] text-[var(--color-azul-escuro)] placeholder:text-[var(--color-azul-escuro)]/25 text-sm outline-none focus:ring-2 focus:ring-[var(--color-rosa)]/30 transition-shadow"
                  />
                </div>

                {/* Email field */}
                <div>
                  <label
                    htmlFor="newsletter-email"
                    className="block text-sm font-medium text-[var(--color-azul-escuro)]/60 mb-2"
                  >
                    E-mail <span className="text-[var(--color-rosa)]">*</span>
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full h-12 px-4 rounded-xl bg-[var(--color-surface-low)] text-[var(--color-azul-escuro)] placeholder:text-[var(--color-azul-escuro)]/25 text-sm outline-none focus:ring-2 focus:ring-[var(--color-rosa)]/30 transition-shadow"
                  />
                </div>

                {/* Error message */}
                {status === 'error' && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500 bg-red-50 px-4 py-2.5 rounded-xl"
                  >
                    {errorMsg}
                  </motion.p>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="group w-full h-14 rounded-xl bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-laranja)] text-white font-semibold text-base transition-all active:scale-[0.98] shadow-[0_12px_32px_rgba(252,142,96,0.25)] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.2)' }}
                >
                  {status === 'loading' ? (
                    <>
                      <SpinnerGap className="h-5 w-5 animate-spin" weight="bold" />
                      Inscrevendo...
                    </>
                  ) : (
                    <>
                      Quero receber
                      <PaperPlaneTilt className="h-5 w-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" weight="bold" />
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>

          {/* Footer note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center text-xs text-[var(--color-azul-escuro)]/25 mt-6"
          >
            Prometemos nao enviar spam. Voce pode cancelar a qualquer momento.
          </motion.p>
        </div>
      </div>
    </div>
  )
}
