'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, ArrowLeft, Sparkle, BookOpen, Users, Music, Crown, MessageCircle, GraduationCap } from 'lucide-react'

const steps = [
  {
    icon: Sparkle,
    title: 'Bienvenue au Cercle!',
    subtitle: 'Seu sal\u00e3o liter\u00e1rio de franc\u00eas',
    description: 'Que bom ter voc\u00ea aqui! Vamos fazer um tour r\u00e1pido para voc\u00ea conhecer tudo o que a plataforma oferece.',
    gradient: 'from-[#934655] to-[#FF9FAF]',
    iconBg: 'bg-[#FF9FAF]/30',
    pattern: 'Estampa-Logo.png',
  },
  {
    icon: BookOpen,
    title: 'Seus Clubes',
    subtitle: 'Conte\u00fado exclusivo por tema',
    description: 'Cada clube tem aulas, materiais e atividades pr\u00f3prias. Os clubes desbloqueados aparecem no seu Dashboard \u2014 clique em um para acessar os cursos e as aulas!',
    gradient: 'from-[#9c441c] to-[#FC8E60]',
    iconBg: 'bg-[#FC8E60]/30',
    pattern: 'Estampa-Formas.png',
  },
  {
    icon: GraduationCap,
    title: 'Semana & Biblioteca',
    subtitle: 'Conte\u00fado semanal + arquivo completo',
    description: 'Toda semana tem um tema novo com v\u00eddeo, vocabul\u00e1rio, m\u00fasica e desafio. Na Biblioteca, voc\u00ea encontra todas as semanas anteriores organizadas por n\u00edvel.',
    gradient: 'from-[#303342] to-[#934655]',
    iconBg: 'bg-[#FF9FAF]/30',
    pattern: 'Estampa-Logo.png',
  },
  {
    icon: Users,
    title: 'Encontros ao Vivo',
    subtitle: 'Pratique com outras alunas',
    description: 'Encontros online em grupo para praticar conversa\u00e7\u00e3o em franc\u00eas. Veja as datas na p\u00e1gina de Encontros e inscreva-se!',
    gradient: 'from-[#934655] to-[#9c441c]',
    iconBg: 'bg-white/20',
    pattern: 'Estampa-Formas.png',
  },
  {
    icon: MessageCircle,
    title: 'Comunidade',
    subtitle: 'Seu espa\u00e7o para compartilhar',
    description: 'Poste textos em franc\u00eas, grave \u00e1udios, tire d\u00favidas e interaja com outras alunas. A comunidade \u00e9 o cora\u00e7\u00e3o do Le Cercle!',
    gradient: 'from-[#303342] to-[#FC8E60]',
    iconBg: 'bg-[#FC8E60]/30',
    pattern: 'Estampa-Logo.png',
  },
  {
    icon: Crown,
    title: 'Meu Plano',
    subtitle: 'Acompanhe sua assinatura',
    description: 'Veja seus clubes ativos e o seu plano atual. Quer acesso a mais clubes? Fa\u00e7a um upgrade e desbloqueie todos!',
    gradient: 'from-[#9c441c] to-[#934655]',
    iconBg: 'bg-white/20',
    pattern: 'Estampa-Formas.png',
  },
  {
    icon: Music,
    title: 'Tudo pronto!',
    subtitle: 'Sua jornada come\u00e7a agora',
    description: 'Explore seus clubes, assista \u00e0s aulas e participe da comunidade. Bon courage et amusez-vous bien!',
    gradient: 'from-[#FF9FAF] to-[#FC8E60]',
    iconBg: 'bg-white/25',
    pattern: 'Estampa-Logo.png',
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
      <div className="absolute inset-0 bg-[#303342]/70 backdrop-blur-sm" onClick={completeTour} />

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentStep}
          custom={direction}
          initial={{ opacity: 0, x: direction * 60, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: direction * -60, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="relative w-full max-w-md bg-[var(--color-surface-lowest)] rounded-[2rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(48,51,66,0.4)]"
        >
          {/* Close */}
          <button
            onClick={completeTour}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center hover:bg-white/25 transition-colors"
          >
            <X className="h-4 w-4 text-white" />
          </button>

          {/* Header gradient with pattern */}
          <div className={`relative bg-gradient-to-br ${step.gradient} px-8 pt-10 pb-8 text-center overflow-hidden`}>
            {/* Estampa de fundo */}
            <div
              className="absolute inset-0 opacity-[0.08] pointer-events-none"
              style={{
                backgroundImage: `url(/${step.pattern})`,
                backgroundSize: '200px',
                backgroundRepeat: 'repeat',
              }}
            />

            <div className="relative z-[1]">
              <div className={`w-16 h-16 rounded-2xl ${step.iconBg} backdrop-blur-sm flex items-center justify-center mx-auto mb-5`}>
                <Icon className="h-8 w-8 text-white" />
              </div>
              {isFirst && (
                <p className="text-white/70 text-sm mb-1">Ol\u00e1, {userName}!</p>
              )}
              <h2 className="text-2xl font-bold text-white tracking-tight">{step.title}</h2>
              <p className="text-white/60 text-xs font-semibold tracking-widest uppercase mt-1">{step.subtitle}</p>
            </div>
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
                  className="w-10 h-10 rounded-xl bg-[var(--color-surface-low)] flex items-center justify-center hover:bg-[var(--color-cinza-claro)] transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 text-[var(--color-azul-escuro)]/40" />
                </button>
              )}
              <button
                onClick={next}
                className={`h-10 px-5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all active:scale-[0.97] ${
                  isLast
                    ? 'bg-gradient-to-br from-[#9c441c] to-[#FC8E60] text-white shadow-[0_8px_24px_rgba(252,142,96,0.25)]'
                    : 'bg-[var(--color-azul-escuro)] text-white'
                }`}
                style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}
              >
                {isLast ? 'Come\u00e7ar!' : 'Pr\u00f3ximo'}
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
