'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { ArrowRight, ArrowLeft, Sparkles } from 'lucide-react'

interface Question {
  id: number
  question: string
  subtitle?: string
  options?: { label: string; description?: string; value: number | string; icon?: string }[]
  type: 'select' | 'text'
  field?: string
}

const questions: Question[] = [
  {
    id: 1,
    question: 'Se você tivesse que se apresentar em francês agora...',
    subtitle: 'Seja honesta — não há resposta errada.',
    type: 'select',
    options: [
      { label: 'Não conseguiria falar nada', value: 1, icon: '😶' },
      { label: 'Diria meu nome com dificuldade', value: 2, icon: '😅' },
      { label: 'Conseguiria me apresentar basicamente', value: 3, icon: '😊' },
      { label: 'Faria uma apresentação completa', value: 4, icon: '🌟' },
    ],
  },
  {
    id: 2,
    question: 'Complete: "Je m\'appelle __ et j\'aime __"',
    subtitle: 'Como você se sai com frases simples?',
    type: 'select',
    options: [
      { label: 'Não entendi a frase', value: 1, icon: '❓' },
      { label: 'Sei o que significa mas não completaria', value: 2, icon: '🤔' },
      { label: 'Completaria com palavras simples', value: 3, icon: '✨' },
    ],
  },
  {
    id: 3,
    question: 'Quando você escuta francês...',
    subtitle: 'Pense em uma música ou filme.',
    type: 'select',
    options: [
      { label: 'Não entendo nada', value: 1, icon: '🔇' },
      { label: 'Identifico algumas palavras', value: 2, icon: '👂' },
      { label: 'Entendo o contexto geral', value: 3, icon: '🎧' },
      { label: 'Entendo quase tudo', value: 4, icon: '🎯' },
    ],
  },
  {
    id: 4,
    question: 'Você já estudou francês?',
    subtitle: 'Qualquer forma de estudo conta.',
    type: 'select',
    options: [
      { label: 'Nunca estudei', value: 1, icon: '🆕' },
      { label: 'Sozinha, apps ou vídeos', value: 2, icon: '📱' },
      { label: 'Fiz um curso básico', value: 3, icon: '📚' },
      { label: 'Curso avançado ou vivência', value: 4, icon: '🇫🇷' },
    ],
  },
  {
    id: 5,
    question: 'Se alguém fala com você em francês...',
    subtitle: 'Imagine a situação.',
    type: 'select',
    options: [
      { label: 'Ficaria paralisada', value: 1, icon: '😰' },
      { label: 'Tentaria responder com gestos', value: 2, icon: '🤷' },
      { label: 'Responderia frases curtas', value: 3, icon: '💬' },
      { label: 'Manteria uma conversa', value: 4, icon: '🗣️' },
    ],
  },
  {
    id: 6,
    question: 'Você consegue ler textos simples em francês?',
    subtitle: 'Um menu, uma placa, um post...',
    type: 'select',
    options: [
      { label: 'Não', value: 1, icon: '❌' },
      { label: 'Com muita dificuldade', value: 2, icon: '😓' },
      { label: 'Sim, textos básicos', value: 3, icon: '📖' },
      { label: 'Sim, até textos complexos', value: 4, icon: '📰' },
    ],
  },
  {
    id: 7,
    question: 'O que mais te trava?',
    subtitle: 'Vamos trabalhar isso juntas.',
    type: 'select',
    field: 'blockReason',
    options: [
      { label: 'Medo de errar', value: 'medo_errar', icon: '😟' },
      { label: 'Falta de vocabulário', value: 'vocabulario', icon: '📝' },
      { label: 'Falta de prática', value: 'falta_pratica', icon: '🗣️' },
      { label: 'Dificuldade de escuta', value: 'escuta', icon: '👂' },
    ],
  },
  {
    id: 8,
    question: 'Por que você entrou no Le Cercle?',
    subtitle: 'Conte um pouco da sua motivação.',
    type: 'text',
    field: 'openAnswer',
  },
]

const levelMessages = {
  INICIANTE: {
    title: 'Bienvenue!',
    message: 'Vamos construir seu francês do zero, juntas.',
    emoji: '🌱',
  },
  INTERMEDIARIO: {
    title: 'Tres bien!',
    message: 'Você já tem uma base ótima. Hora de destravar a fala.',
    emoji: '🚀',
  },
  AVANCADO: {
    title: 'Magnifique!',
    message: 'Você está pronta pra voar. Debates, cultura e fluência real.',
    emoji: '✨',
  },
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

  function calculateLevel(answers: Record<number, number | string>): string {
    let score = 0
    for (let i = 1; i <= 6; i++) {
      score += Number(answers[i]) || 0
    }
    if (score <= 9) return 'INICIANTE'
    if (score <= 17) return 'INTERMEDIARIO'
    return 'AVANCADO'
  }

  function handleSelect(questionId: number, value: number | string) {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
    if (questionId === 7) {
      setBlockReason(value as string)
    }
  }

  async function handleNext() {
    if (step < totalSteps - 1) {
      setStep(step + 1)
      return
    }

    setLoading(true)
    const calculatedLevel = calculateLevel(answers)
    setLevel(calculatedLevel)

    try {
      await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers,
          blockReason,
          openAnswer,
          level: calculatedLevel,
        }),
      })
      await update({ level: calculatedLevel, onboardingDone: true })
    } catch (error) {
      console.error('Onboarding error:', error)
    }
    setLoading(false)
    setStep(totalSteps)
  }

  function handleBack() {
    if (step > 0) setStep(step - 1)
  }

  const currentQuestion = questions[step]
  const canProceed = step === totalSteps
    ? true
    : currentQuestion?.type === 'text'
    ? openAnswer.trim().length > 0
    : answers[currentQuestion?.id] !== undefined

  // Result screen
  if (step === totalSteps && level) {
    const msg = levelMessages[level as keyof typeof levelMessages]
    return (
      <div className="min-h-screen bg-[var(--color-surface)] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-3xl p-10 shadow-[0_4px_24px_rgba(48,51,66,0.06)]">
            <div className="text-6xl mb-6">{msg.emoji}</div>
            <div className="inline-block bg-[var(--color-rosa-light)] text-[var(--color-azul-escuro)] px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide mb-4">
              {level}
            </div>
            <h1 className="text-3xl font-bold text-[var(--color-azul-escuro)] mb-3">
              {msg.title}
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              {msg.message}
            </p>
            <Button
              onClick={() => router.push('/dashboard')}
              className="h-14 px-10 rounded-2xl bg-gradient-to-r from-[var(--color-laranja)] to-[#ff9062] hover:opacity-90 text-white font-semibold text-lg shadow-[0_8px_32px_rgba(252,142,96,0.3)]"
            >
              Entrar no Le Cercle <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-surface)] flex flex-col">
      {/* Header with progress */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold tracking-widest text-[var(--color-rosa)]">
            PASSO {String(step + 1).padStart(2, '0')} DE {String(totalSteps).padStart(2, '0')}
          </span>
          <span className="text-xs text-muted-foreground">
            {Math.round(progress)}%
          </span>
        </div>
        <Progress value={progress} className="h-1 bg-[var(--color-surface-low)]" />
      </div>

      {/* Question Content */}
      <div className="flex-1 flex flex-col px-6 py-8 max-w-lg mx-auto w-full">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-azul-escuro)] leading-tight">
            {currentQuestion.question}
          </h2>
          {currentQuestion.subtitle && (
            <p className="text-muted-foreground mt-3">{currentQuestion.subtitle}</p>
          )}
        </div>

        {/* Options or Text Input */}
        {currentQuestion.type === 'select' && (
          <div className="space-y-3 flex-1">
            {currentQuestion.options?.map((option) => {
              const isSelected = answers[currentQuestion.id] === option.value
              return (
                <button
                  key={String(option.value)}
                  onClick={() => handleSelect(currentQuestion.id, option.value)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all ${
                    isSelected
                      ? 'bg-[var(--color-rosa-light)] ring-2 ring-[var(--color-rosa)]'
                      : 'bg-white shadow-[0_2px_12px_rgba(48,51,66,0.04)] hover:bg-[var(--color-surface-low)]'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-[var(--color-rosa)]' : 'bg-[var(--color-surface-low)]'
                  }`}>
                    <span className="text-lg">{option.icon}</span>
                  </div>
                  <span className={`font-medium ${
                    isSelected ? 'text-[var(--color-azul-escuro)]' : 'text-[var(--color-azul-escuro)]'
                  }`}>
                    {option.label}
                  </span>
                  <div className={`ml-auto w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    isSelected
                      ? 'border-[var(--color-rosa)] bg-[var(--color-rosa)]'
                      : 'border-gray-200'
                  }`}>
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                        <path d="M10 3L4.5 8.5 2 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
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
            className="bg-white border-none rounded-2xl min-h-[160px] shadow-[0_2px_12px_rgba(48,51,66,0.04)] focus-visible:ring-[var(--color-rosa)] text-base p-4"
          />
        )}

        {/* Navigation */}
        <div className="mt-8 space-y-3">
          <Button
            onClick={handleNext}
            disabled={!canProceed || loading}
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-[var(--color-laranja)] to-[#ff9062] hover:opacity-90 text-white font-semibold text-lg shadow-[0_8px_32px_rgba(252,142,96,0.3)] disabled:opacity-40"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 animate-pulse" /> Calculando seu nível...
              </span>
            ) : step === totalSteps - 1 ? (
              'Descobrir meu nível'
            ) : (
              <>Próxima <ArrowRight className="ml-2 h-5 w-5" /></>
            )}
          </Button>

          {step > 0 && (
            <button
              onClick={handleBack}
              className="w-full text-center text-sm text-muted-foreground hover:text-[var(--color-azul-escuro)] flex items-center justify-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" /> Voltar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
