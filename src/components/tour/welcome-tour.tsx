'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, ArrowLeft, Sparkle, BookOpen, Users, Music, Crown, MessageCircle, GraduationCap } from 'lucide-react'

const steps = [
  {
    icon: Sparkle,
    title: 'Bienvenue au Cercle!',
    subtitle: 'Seu salao literario de frances',
    description: 'Que bom ter voce aqui! Vamos fazer um tour rapido para voce conhecer tudo o que a plataforma oferece.',
    color: 'from-[var(--color-primary)] to-[var(--color-rosa)]',
  },
  {
    icon: BookOpen,
    title: 'Seus Clubes',
    subtitle: 'Conteudo exclusivo por tema',
    description: 'Cada clube tem aulas, materiais e atividades proprias. Os clubes desbloqueados aparecem no seu Dashboard. Clique em um clube para acessar os cursos e aulas.',
    color: 'from-[var(--color-secondary)] to-[var(--color-laranja)]',
  },
  {
    icon: GraduationCap,
    title: 'Semana & Biblioteca',
    subtitle: 'Conteudo semanal + arquivo completo',
    description: 'Toda semana tem um tema novo com video, vocabulario, musica e desafio. Na Biblioteca voce encontra todas as semanas anteriores organizadas por nivel.',
    color: 'from-emerald-600 to-emerald-400',
  },
  {
    icon: Users,
    title: 'Encontros ao Vivo',
    subtitle: 'Pratique com outras alunas',
    description: 'Encontros online em grupo para praticar conversacao em frances. Veja as datas na pagina Encontros e inscreva-se!',
    color: 'from-violet-600 to-violet-400',
  },
  {
    icon: MessageCircle,
    title: 'Comunidade',
    subtitle: 'Seu espaco para compartilhar',
    description: 'Poste textos em frances, grave audios, tire duvidas e interaja com outras alunas. A comunidade e o coracao do Le Cercle!',
    color: 'from-sky-600 to-sky-400',
  },
  {
    icon: Crown,
    title: 'Meu Plano',
    subtitle: 'Gerencie sua assinatura',
    description: 'Veja seus clubes ativos e seu plano atual. Quer mais clubes? Faca um upgrade para desbloquear todos!',
    color: 'from-amber-600 to-amber-400',
  },
  {
    icon: Music,
    title: 'Tudo pronto!',
    subtitle: 'Sua jornada comeca agora',
    description: 'Explore seus clubes, assista as aulas e participe da comunidade. Bon courage et amusez-vous bien!',
    color: 'from-[var(--color-rosa)] to-[var(--color-laranja)]',
  },
]

export function WelcomeTour({ userName }: { userName: string }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [visible, setVisible] = useState(true)
  const [direction, setDirection] = useState(1)

  async function completeTour() {
    setVisible(false)
    await fetch('/api/tour', { method: 'POST' })
  }

  function next() {
    if (currentStep === steps.length - 1) {
      completeTour()
      return
    }
    setDirection(1)
    setCurrentStep(s => s + 1)
  }

  function prev() {
    if (currentStep === 0) return
    setDirection(-1)
    setCurrentStep(s => s - 1)
  }

  if (!visible) return null

  const step = steps[currentStep]
  const Icon = step.icon
  const isLast = currentStep === steps.length - 1
  const isFirst = currentStep === 0

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={completeTour} />

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentStep}
          custom={direction}
          initial={{ opacity: 0, x: direction * 60, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: direction * -60, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="relative w-full max-w-md bg-[var(--color-surface-lowest)] rounded-[2rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)]"
        >
          {/* Close */}
          <button
            onClick={completeTour}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/10 flex items-center justify-center hover:bg-black/20 transition-colors"
          >
            <X className="h-4 w-4 text-white" />
          </button>

          {/* Header gradient */}
          <div className={`bg-gradient-to-br ${step.color} px-8 pt-10 pb-8 text-center`}>
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-5">
              <Icon className="h-8 w-8 text-white" />
            </div>
            {isFirst && (
              <p className="text-white/70 text-sm mb-1">Ola, {userName}!</p>
            )}
            <h2 className="text-2xl font-bold text-white tracking-tight">{step.title}</h2>
            <p className="text-white/60 text-xs font-semibold tracking-widest uppercase mt-1">{step.subtitle}</p>
          </div>

          {/* Body */}
          <div className="px-8 py-6">
            <p className="text-[var(--color-azul-escuro)]/70 text-sm leading-relaxed text-center">
              {step.description}
            </p>
          </div>

          {/* Footer */}
          <div className="px-8 pb-8 flex items-center justify-between">
            {/* Step dots */}
            <div className="flex items-center gap-1.5">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === currentStep
                      ? 'w-6 bg-[var(--color-rosa)]'
                      : i < currentStep
                      ? 'w-1.5 bg-[var(--color-rosa)]/30'
                      : 'w-1.5 bg-[var(--color-surface-low)]'
                  }`}
                />
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-2">
              {!isFirst && (
                <button
                  onClick={prev}
                  className="w-10 h-10 rounded-xl bg-[var(--color-surface-low)] flex items-center justify-center hover:bg-[var(--color-surface)] transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 text-[var(--color-azul-escuro)]/40" />
                </button>
              )}
              <button
                onClick={next}
                className={`h-10 px-5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all active:scale-[0.97] ${
                  isLast
                    ? 'bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-laranja)] text-white shadow-[0_8px_24px_rgba(252,142,96,0.25)]'
                    : 'bg-[var(--color-azul-escuro)] text-white'
                }`}
                style={isLast ? { borderTop: '1px solid rgba(255,255,255,0.2)' } : undefined}
              >
                {isLast ? 'Comecar!' : 'Proximo'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Skip */}
          {!isLast && (
            <div className="text-center pb-5">
              <button onClick={completeTour} className="text-xs text-[var(--color-azul-escuro)]/25 hover:text-[var(--color-azul-escuro)]/50 transition-colors">
                Pular tour
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
