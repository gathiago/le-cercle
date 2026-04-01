import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { VocabularyCards } from '@/components/semana/vocabulary-cards'
import { Play, Music } from 'lucide-react'

export default async function SemanaPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const week = await prisma.weekContent.findFirst({
    where: { isActive: true },
    orderBy: { weekNumber: 'desc' },
  })

  if (!week) {
    return (
      <div className="max-w-3xl mx-auto text-center py-16">
        <p className="text-muted-foreground text-lg">Conteúdo semanal em preparação.</p>
      </div>
    )
  }

  const vocabulary = week.vocabulary as Array<{ word: string; translation: string; example?: string }>
  const prompts = week.prompts as string[]

  return (
    <div className="max-w-3xl mx-auto">
      {/* Module Header */}
      <div className="mb-8">
        <span className="inline-block bg-[var(--color-rosa-light)] text-[var(--color-azul-escuro)] text-[10px] font-semibold px-3 py-1 rounded-full tracking-widest uppercase mb-3">
          Módulo {String(week.weekNumber).padStart(2, '0')} — {week.level === 'INICIANTE' ? 'Iniciante' : week.level === 'INTERMEDIARIO' ? 'Intermediário' : 'Avançado'}
        </span>
        <h1 className="text-3xl font-bold text-[var(--color-azul-escuro)] mb-3">
          {week.title}
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed">
          {week.description}
        </p>
      </div>

      {/* Music Section */}
      {week.musicUrl && (
        <div className="bg-gradient-to-r from-[#934655] to-[var(--color-rosa)] rounded-2xl p-5 mb-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--color-surface-lowest)]/20 flex items-center justify-center shrink-0">
            <Music className="h-6 w-6 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white/60 text-[10px] font-semibold tracking-widest uppercase">
              Música da Semana
            </p>
            <p className="text-white font-medium truncate">
              {week.title}
            </p>
          </div>
          <a
            href={week.musicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-[var(--color-laranja)] flex items-center justify-center shrink-0 hover:scale-105 transition-transform shadow-[0_4px_16px_rgba(252,142,96,0.4)]"
          >
            <Play className="h-5 w-5 text-white ml-0.5" fill="white" />
          </a>
        </div>
      )}

      {/* Video Section */}
      {week.videoUrl && (
        <div className="bg-[var(--color-azul-escuro)] rounded-2xl overflow-hidden mb-6 aspect-video relative">
          <iframe
            src={week.videoUrl}
            className="w-full h-full absolute inset-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {/* Vocabulary */}
      {vocabulary.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 rounded-full bg-[var(--color-laranja)]" />
            <h2 className="text-xl font-bold text-[var(--color-azul-escuro)]">
              Vocabulário Essencial
            </h2>
          </div>
          <VocabularyCards vocabulary={vocabulary} />
          <p className="text-center text-xs text-muted-foreground mt-3 tracking-widest uppercase">
            Toque nos cards para ver a tradução
          </p>
        </div>
      )}

      {/* Conversation Prompts */}
      {prompts.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 rounded-full bg-[var(--color-rosa)]" />
            <h2 className="text-xl font-bold text-[var(--color-azul-escuro)]">
              Pratique sua Fala
            </h2>
          </div>
          <div className="space-y-3">
            {prompts.map((prompt, i) => (
              <div key={i} className="bg-[var(--color-rosa-light)] rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--color-surface-lowest)]/60 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-[var(--color-azul-escuro)]">&#x1F4AC;</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold tracking-widest uppercase text-[var(--color-azul-escuro)]/60 mb-1">
                      Prompt de Conversação #{String(i + 1).padStart(2, '0')}
                    </p>
                    <p className="text-[var(--color-azul-escuro)] italic">
                      &ldquo;{prompt}&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Exercise */}
      {week.exercise && (
        <div className="bg-[var(--color-surface-lowest)] rounded-2xl p-6 shadow-[0_4px_24px_rgba(48,51,66,0.06)] mb-6">
          <h2 className="text-xl font-bold text-[var(--color-azul-escuro)] mb-3">Exercício</h2>
          <p className="text-[var(--color-azul-escuro)] leading-relaxed">{week.exercise}</p>
        </div>
      )}

      {/* Weekly Challenge */}
      <div className="bg-gradient-to-br from-[var(--color-laranja-light)] to-white rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-laranja)]/20 flex items-center justify-center shrink-0">
            <span className="text-lg">&#x1F3AF;</span>
          </div>
          <div>
            <h3 className="font-bold text-[var(--color-laranja)]">Le Defi de la Semaine</h3>
            <p className="text-sm text-[var(--color-azul-escuro)] mt-2">{week.challengeText}</p>
            <a
              href="/comunidade"
              className="inline-block mt-4 bg-[var(--color-laranja)] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[var(--color-laranja-hover)] transition-colors"
            >
              Aceitar Desafio
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
