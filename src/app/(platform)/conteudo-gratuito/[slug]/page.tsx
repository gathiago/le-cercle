'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, PlayCircle, FileText, DownloadSimple, Spinner } from '@phosphor-icons/react'

interface Lesson {
  id: string
  title: string
  videoUrl: string | null
  materialUrl: string | null
  materialName: string | null
  content: string | null
  duration: number | null
  sortOrder: number
}

interface CourseData {
  id: string
  title: string
  description: string
  lessons: Lesson[]
}

export default function CursoGratuitoPlayerPage() {
  const params = useParams()
  const slug = params.slug as string
  const [course, setCourse] = useState<CourseData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    fetch(`/api/courses/${slug}`)
      .then(r => r.json())
      .then(data => { setCourse(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="h-8 w-8 text-[var(--color-rosa)] animate-spin" />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="text-center py-20">
        <p className="text-[var(--color-azul-escuro)]/40">Curso não encontrado.</p>
        <Link href="/conteudo-gratuito" className="text-[var(--color-rosa)] text-sm mt-4 inline-block">Voltar</Link>
      </div>
    )
  }

  const activeLesson = course.lessons[activeIndex]
  const isCanva = activeLesson?.videoUrl?.includes('canva.com')

  return (
    <div className="relative min-h-full">
      {/* Background pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url(/Estampa-Formas.png)', backgroundSize: '600px', backgroundRepeat: 'repeat' }} />

      <div className="relative z-10">
        {/* Header */}
        <div className="px-6 md:px-10 pt-6 pb-4">
          <Link href="/conteudo-gratuito" className="inline-flex items-center gap-1.5 text-sm text-[var(--color-azul-escuro)]/35 hover:text-[var(--color-azul-escuro)] mb-4 transition-colors">
            <ArrowLeft className="h-4 w-4" weight="bold" /> Conteúdo Gratuito
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              Gratuito
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-[var(--color-azul-escuro)] tracking-tight">
            {course.title}
          </h1>
          <p className="text-[var(--color-azul-escuro)]/40 text-sm mt-1 max-w-[60ch]">{course.description}</p>
        </div>

        {/* Player + Sidebar */}
        <div className="px-6 md:px-10 pb-10 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          {/* Video */}
          <div>
            <div className="bg-[var(--color-surface-lowest)] rounded-[1.5rem] overflow-hidden shadow-[0_8px_32px_rgba(48,51,66,0.04)]">
              {isCanva || (!activeLesson?.videoUrl && activeLesson?.materialUrl) ? (
                /* Link externo (Canva, PDF, etc.) — não tenta embed */
                <div className="flex flex-col items-center justify-center py-16 px-8 bg-gradient-to-br from-[var(--color-rosa-light)] to-[var(--color-laranja-light)]">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-rosa)] flex items-center justify-center mb-6 shadow-[0_12px_32px_rgba(147,70,85,0.2)]">
                    <FileText className="h-10 w-10 text-white" weight="bold" />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--color-azul-escuro)] mb-2 text-center">{activeLesson?.title}</h3>
                  <p className="text-sm text-[var(--color-azul-escuro)]/40 mb-6 text-center max-w-md">
                    {activeLesson?.content || 'Clique no botão abaixo para abrir o material em uma nova aba.'}
                  </p>
                  <a
                    href={activeLesson?.videoUrl || activeLesson?.materialUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 h-12 px-8 rounded-xl bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-laranja)] text-white font-semibold shadow-[0_8px_24px_rgba(252,142,96,0.25)] active:scale-[0.98] transition-all"
                    style={{ borderTop: '1px solid rgba(255,255,255,0.2)' }}
                  >
                    <ArrowLeft className="h-4 w-4 rotate-[135deg]" weight="bold" />
                    Abrir material
                  </a>
                </div>
              ) : activeLesson?.videoUrl ? (
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    key={activeLesson.id}
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${extractYouTubeId(activeLesson.videoUrl)}?rel=0`}
                    title={activeLesson.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center py-20 bg-[var(--color-surface-low)]">
                  <p className="text-[var(--color-azul-escuro)]/30">Sem conteúdo disponível</p>
                </div>
              )}

              <div className="p-5 md:p-6">
                <p className="text-[10px] text-[var(--color-rosa)] font-semibold tracking-[2.5px] uppercase mb-1.5">
                  Aula {activeIndex + 1} de {course.lessons.length}
                </p>
                <h2 className="text-lg font-bold text-[var(--color-azul-escuro)] tracking-tight">{activeLesson?.title}</h2>

                {activeLesson?.content && (
                  <p className="text-sm text-[var(--color-azul-escuro)]/45 mt-3 leading-relaxed whitespace-pre-wrap">{activeLesson.content}</p>
                )}

                {/* Material download */}
                {activeLesson?.materialUrl && (
                  <a
                    href={activeLesson.materialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 bg-[var(--color-rosa)]/10 text-[var(--color-rosa)] px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[var(--color-rosa)]/20 transition-colors"
                  >
                    <DownloadSimple className="h-4 w-4" weight="bold" />
                    {activeLesson.materialName || 'Material da aula'}
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Lesson list */}
          <div className="bg-[var(--color-surface-lowest)] rounded-[1.5rem] p-5 shadow-[0_8px_32px_rgba(48,51,66,0.04)] h-fit lg:sticky lg:top-24">
            <p className="text-[10px] font-bold text-[var(--color-azul-escuro)]/30 uppercase tracking-[2px] mb-4">
              Aulas do curso
            </p>
            <div className="space-y-1.5">
              {course.lessons.map((lesson, i) => {
                const isActive = i === activeIndex
                const hasMaterial = !!lesson.materialUrl
                return (
                  <button
                    key={lesson.id}
                    onClick={() => setActiveIndex(i)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                      isActive
                        ? 'bg-[var(--color-rosa)]/10'
                        : 'hover:bg-[var(--color-surface-low)]'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                      isActive
                        ? 'bg-[var(--color-rosa)] text-white'
                        : 'bg-[var(--color-surface-low)] text-[var(--color-azul-escuro)]/40'
                    }`}>
                      {isActive ? <PlayCircle className="h-4 w-4" weight="fill" /> : i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${isActive ? 'text-[var(--color-rosa)]' : 'text-[var(--color-azul-escuro)]/70'}`}>
                        {lesson.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {lesson.duration && <span className="text-[10px] text-[var(--color-azul-escuro)]/25">{lesson.duration} min</span>}
                        {hasMaterial && (
                          <span className="text-[10px] text-[var(--color-rosa)]/60 flex items-center gap-0.5">
                            <FileText className="h-2.5 w-2.5" /> PDF
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function extractYouTubeId(url: string): string {
  // Handle youtu.be/ID, youtube.com/watch?v=ID, youtube.com/embed/ID
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?/]+)/)
  return match ? match[1] : url
}
