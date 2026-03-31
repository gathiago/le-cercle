'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'
import { ArrowRight, ArrowLeft } from '@phosphor-icons/react'

interface Question {
  id: number
  question: string
  subtitle?: string
  options?: { label: string; value: number | string }[]
  type: 'select' | 'text'
  field?: string
}

const questions: Question[] = [
  {
    id: 1,
    question: 'Se voce tivesse que se apresentar em frances agora...',
    subtitle: 'Seja honesta — nao ha resposta errada.',
    type: 'select',
    options: [
      { label: 'Nao conseguiria falar nada', value: 1 },
      { label: 'Diria meu nome com dificuldade', value: 2 },
      { label: 'Conseguiria me apresentar basicamente', value: 3 },
      { label: 'Faria uma apresentacao completa', value: 4 },
    ],
  },
  {
    id: 2,
    question: 'Complete: "Je m\'appelle __ et j\'aime __"',
    subtitle: 'Como voce se sai com frases simples?',
    type: 'select',
    options: [
      { label: 'Nao entendi a frase', value: 1 },
      { label: 'Sei o que significa mas nao completaria', value: 2 },
      { label: 'Completaria com palavras simples', value: 3 },
    ],
  },
  {
    id: 3,
    question: 'Quando voce escuta frances...',
    subtitle: 'Pense em uma musica ou filme.',
    type: 'select',
    options: [
      { label: 'Nao entendo nada', value: 1 },
      { label: 'Identifico algumas palavras', value: 2 },
      { label: 'Entendo o contexto geral', value: 3 },
      { label: 'Entendo quase tudo', value: 4 },
    ],
  },
  {
    id: 4,
    question: 'Voce ja estudou frances?',
    subtitle: 'Qualquer forma de estudo conta.',
    type: 'select',
    options: [
      { label: 'Nunca estudei', value: 1 },
      { label: 'Sozinha, apps ou videos', value: 2 },
      { label: 'Fiz um curso basico', value: 3 },
      { label: 'Curso avancado ou vivencia', value: 4 },
    ],
  },
  {
    id: 5,
    question: 'Se alguem fala com voce em frances...',
    subtitle: 'Imagine a situacao.',
    type: 'select',
    options: [
      { label: 'Ficaria paralisada', value: 1 },
      { label: 'Tentaria responder com gestos', value: 2 },
      { label: 'Responderia frases curtas', value: 3 },
      { label: 'Manteria uma conversa', value: 4 },
    ],
  },
  {
    id: 6,
    question: 'Voce consegue ler textos simples em frances?',
    subtitle: 'Um menu, uma placa, um post...',
    type: 'select',
    options: [
      { label: 'Nao', value: 1 },
      { label: 'Com muita dificuldade', value: 2 },
      { label: 'Sim, textos basicos', value: 3 },
      { label: 'Sim, ate textos complexos', value: 4 },
    ],
  },
  {
    id: 7,
    question: 'O que mais te trava?',
    subtitle: 'Vamos trabalhar isso juntas.',
    type: 'select',
    field: 'blockReason',
    options: [
      { label: 'Medo de errar', value: 'medo_errar' },
      { label: 'Falta de vocabulario', value: 'vocabulario' },
      { label: 'Falta de pratica', value: 'falta_pratica' },
      { label: 'Dificuldade de escuta', value: 'escuta' },
    ],
  },
  {
    id: 8,
    question: 'Por que voce entrou no Le Cercle?',
    subtitle: 'Conte um pouco da sua motivacao.',
    type: 'text',
    field: 'openAnswer',
  },
]

const levelMessages = {
  INICIANTE: { title: 'Bienvenue!', message: 'Vamos construir seu frances do zero, juntas.', color: 'from-emerald-500 to-emerald-400' },
  INTERMEDIARIO: { title: 'Tres bien!', message: 'Voce ja tem uma base otima. Hora de destravar a fala.', color: 'from-[var(--color-laranja)] to-amber-400' },
  AVANCADO: { title: 'Magnifique!', message: 'Voce esta pronta pra voar. Debates, cultura e fluencia real.', color: 'from-[var(--color-primary)] to-[var(--color-rosa)]' },
}

export default function OnboardingPage() {
  const router = useRouter()
  const { update } = useSession()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number | string>>({})
  const [blockReason, setBlockReason] = useState('')
  const [openAnswer, setOpenAnswer] = useState('')
  const [level, setLevel] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const totalSteps = questions.length
  const progress = ((step + 1) / (totalSteps + 1)) * 100

  function calculateLevel(ans: Record<number, number | string>): string {
    let score = 0
    for (let i = 1; i <= 6; i++) score += Number(ans[i]) || 0
    if (score <= 9) return 'INICIANTE'
    if (score <= 17) return 'INTERMEDIARIO'
    return 'AVANCADO'
  }

  function handleSelect(questionId: number, value: number | string) {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
    if (questionId === 7) setBlockReason(value as string)
  }

  async function handleNext() {
    if (step < totalSteps - 1) { setStep(step + 1); return }
    setLoading(true)
    const calculatedLevel = calculateLevel(answers)
    setLevel(calculatedLevel)
    try {
      await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, blockReason, openAnswer, level: calculatedLevel }),
      })
      await update({ level: calculatedLevel, onboardingDone: true })
    } catch (error) { console.error('Onboarding error:', error) }
    setLoading(false)
    setStep(totalSteps)
  }

  const currentQuestion = questions[step]
  const canProceed = step === totalSteps ? true :
    currentQuestion?.type === 'text' ? openAnswer.trim().length > 0 : answers[currentQuestion?.id] !== undefined

  // Result screen
  if (step === totalSteps && level) {
    const msg = levelMessages[level as keyof typeof levelMessages]
    return (
      <div className="min-h-[100dvh] bg-[var(--color-surface)] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-[var(--color-surface-lowest)] rounded-[2rem] p-10 shadow-[0_16px_48px_-12px_rgba(48,51,66,0.06)]">
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${msg.color} flex items-center justify-center mx-auto mb-6 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.15)]`}>
              <span className="text-3xl text-white font-bold">{level.charAt(0)}</span>
            </div>
            <div className="inline-block bg-[var(--color-rosa-light)] text-[var(--color-azul-escuro)] px-4 py-1.5 rounded-full text-xs font-semibold tracking-[2px] uppercase mb-4">
              {level}
            </div>
            <h1 className="text-3xl font-bold text-[var(--color-azul-escuro)] tracking-tight mb-3">{msg.title}</h1>
            <p className="text-[var(--color-azul-escuro)]/45 text-lg mb-8">{msg.message}</p>
            <Button
              onClick={() => router.push('/dashboard')}
              className="h-14 px-10 rounded-xl bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-laranja)] text-white font-semibold text-lg shadow-[0_12px_32px_rgba(252,142,96,0.25)] active:scale-[0.98]"
              style={{ borderTop: '1px solid rgba(255,255,255,0.2)' }}
            >
              Entrar no Le Cercle <ArrowRight className="ml-2 h-5 w-5" weight="bold" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[100dvh] bg-[var(--color-surface)] flex flex-col">
      {/* Progress header */}
      <div className="px-6 pt-8 pb-4">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold tracking-[3px] text-[var(--color-rosa)] uppercase">
              Passo {String(step + 1).padStart(2, '0')} de {String(totalSteps).padStart(2, '0')}
            </span>
            <span className="text-xs text-[var(--color-azul-escuro)]/25 font-semibold">{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 bg-[var(--color-surface-low)] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-rosa)] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col px-6 py-8 max-w-lg mx-auto w-full">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-azul-escuro)] tracking-tight leading-tight">
            {currentQuestion.question}
          </h2>
          {currentQuestion.subtitle && (
            <p className="text-[var(--color-azul-escuro)]/35 mt-3">{currentQuestion.subtitle}</p>
          )}
        </div>

        {/* Options */}
        {currentQuestion.type === 'select' && (
          <div className="space-y-3 flex-1">
            {currentQuestion.options?.map((option) => {
              const isSelected = answers[currentQuestion.id] === option.value
              return (
                <button
                  key={String(option.value)}
                  onClick={() => handleSelect(currentQuestion.id, option.value)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all active:scale-[0.98] ${
                    isSelected
                      ? 'bg-[var(--color-rosa-light)] shadow-[0_4px_16px_rgba(255,159,175,0.15)]'
                      : 'bg-[var(--color-surface-lowest)] shadow-[0_4px_16px_-4px_rgba(48,51,66,0.04)] hover:bg-[var(--color-surface-low)]'
                  }`}
                  style={isSelected ? { outline: '2px solid var(--color-rosa)' } : undefined}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-rosa)]' : 'bg-[var(--color-surface-low)]'
                  }`}>
                    {isSelected ? (
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-[var(--color-azul-escuro)]/15" />
                    )}
                  </div>
                  <span className={`font-medium ${isSelected ? 'text-[var(--color-azul-escuro)]' : 'text-[var(--color-azul-escuro)]/60'}`}>
                    {option.label}
                  </span>
                </button>
              )
            })}
          </div>
        )}

        {currentQuestion.type === 'text' && (
          <Textarea
            value={openAnswer}
            onChange={(e) => setOpenAnswer(e.target.value)}
            placeholder="Escreva sua resposta aqui..."
            className="bg-[var(--color-surface-lowest)] rounded-2xl min-h-[160px] shadow-[0_4px_16px_-4px_rgba(48,51,66,0.04)] focus-visible:ring-[var(--color-rosa)]/30 text-base p-5 text-[var(--color-azul-escuro)] placeholder:text-[var(--color-azul-escuro)]/20"
          />
        )}

        {/* Navigation */}
        <div className="mt-8 space-y-3">
          <Button
            onClick={handleNext}
            disabled={!canProceed || loading}
            className="w-full h-14 rounded-xl bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-laranja)] text-white font-semibold text-lg shadow-[0_12px_32px_rgba(252,142,96,0.25)] disabled:opacity-30 active:scale-[0.98]"
            style={{ borderTop: '1px solid rgba(255,255,255,0.2)' }}
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : step === totalSteps - 1 ? (
              'Descobrir meu nivel'
            ) : (
              <>Proxima <ArrowRight className="ml-2 h-5 w-5" weight="bold" /></>
            )}
          </Button>

          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="w-full text-center text-sm text-[var(--color-azul-escuro)]/30 hover:text-[var(--color-azul-escuro)]/60 flex items-center justify-center gap-1 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" weight="bold" /> Voltar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
