import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import { VocabularyCards } from '@/components/semana/vocabulary-cards'
import { Play, Music, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function SemanaDetailPage({ params }: { params: Promise<{ weekNumber: string }> }) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const { weekNumber } = await params
  const weekNum = parseInt(weekNumber, 10)
  if (isNaN(weekNum)) notFound()

  const week = await prisma.weekContent.findUnique({
    where: { weekNumber: weekNum },
  })

  if (!week) notFound()

  const vocabulary = week.vocabulary as Array<{ word: string; translation: string; example?: string }>
  const prompts = week.prompts as string[]

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back link */}
      <Link href="/biblioteca" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[var(--color-azul-escuro)] mb-6">
        <ArrowLeft className="h-4 w-4" /> Voltar à Biblioteca
      </Link>

      {/* Module Header */}
      <div className="mb-8">
        <span className="inline-block bg-[var(--color-rosa-light)] text-[var(--color-azul-escuro)] text-[10px] font-semibold px-3 py-1 rounded-full tracking-widest uppercase mb-3">
          Módulo {String(week.weekNumber).padStart(2, '0')} — {week.level === 'INICIANTE' ? 'Iniciante' : week.level === 'INTERMEDIARIO' ? 'Intermediário' : 'Avançado'}
        </span>
        <h1 className="text-3xl font-bold text-[var(--color-azul-escuro)] mb-3">{week.title}</h1>
        <p className="text-muted-foreground text-lg leading-relaxed">{week.description}</p>
      </div>

      {/* Music */}
      {week.musicUrl && (
        <div className="bg-gradient-to-r from-[#934655] to-[var(--color-rosa)] rounded-2xl p-5 mb-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <Music className="h-6 w-6 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white/60 text-[10px] font-semibold tracking-widest uppercase">Música da Semana</p>
            <p className="text-white font-medium truncate">{week.title}</p>
          </div>
          <a href={week.musicUrl} target="_blank" rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-[var(--color-laranja)] flex items-center justify-center shrink-0 hover:scale-105 transition-transform shadow-[0_4px_16px_rgba(252,142,96,0.4)]">
            <Play className="h-5 w-5 text-white ml-0.5" fill="white" />
          </a>
        </div>
      )}

      {/* Video */}
      {week.videoUrl && (
        <div className="bg-[var(--color-azul-escuro)] rounded-2xl overflow-hidden mb-6 aspect-video relative">
          <iframe src={week.videoUrl} className="w-full h-full absolute inset-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        </div>
      )}

      {/* Vocabulary */}
      {vocabulary.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 rounded-full bg-[var(--color-laranja)]" />
            <h2 className="text-xl font-bold text-[var(--color-azul-escuro)]">Vocabulário Essencial</h2>
          </div>
          <VocabularyCards vocabulary={vocabulary} />
          <p className="text-center text-xs text-muted-foreground mt-3 tracking-widest uppercase">Toque nos cards para ver a tradução</p>
        </div>
      )}

      {/* Prompts */}
      {prompts.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 rounded-full bg-[var(--color-rosa)]" />
            <h2 className="text-xl font-bold text-[var(--color-azul-escuro)]">Pratique sua Fala</h2>
          </div>
          <div className="space-y-3">
            {prompts.map((prompt, i) => (
              <div key={i} className="bg-[var(--color-rosa-light)] rounded-2xl p-5">
                <p className="text-[10px] font-semibold tracking-widest uppercase text-[var(--color-azul-escuro)]/60 mb-1">
                  Prompt de Conversação #{String(i + 1).padStart(2, '0')}
                </p>
                <p className="text-[var(--color-azul-escuro)] italic">&ldquo;{prompt}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Exercise */}
      {week.exercise && (
        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_24px_rgba(48,51,66,0.06)] mb-6">
          <h2 className="text-xl font-bold text-[var(--color-azul-escuro)] mb-3">Exercício</h2>
          <p className="text-[var(--color-azul-escuro)] leading-relaxed">{week.exercise}</p>
        </div>
      )}

      {/* Challenge */}
      <div className="bg-gradient-to-br from-[var(--color-laranja-light)] to-white rounded-2xl p-6">
        <h3 className="font-bold text-[var(--color-laranja)]">Le Défi de la Semaine</h3>
        <p className="text-sm text-[var(--color-azul-escuro)] mt-2">{week.challengeText}</p>
        <Link href="/comunidade" className="inline-block mt-4 bg-[var(--color-laranja)] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[var(--color-laranja-hover)] transition-colors">
          Aceitar Desafio
        </Link>
      </div>
    </div>
  )
}
