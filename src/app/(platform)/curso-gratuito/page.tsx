'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { PlayCircle, CheckCircle, YoutubeLogo } from '@phosphor-icons/react'

const CANVA_EMBED = 'https://www.canva.com/design/DAFs205OVsA/q4I5cxQDRlU5zFgURJb21A/view?embed'

const lessons = [
  { title: 'Apresentação do Curso', type: 'canva' as const, videoId: '' },
  { title: 'Aula 0 — Introdução', type: 'youtube' as const, videoId: 'b6T6-fvox8I' },
  { title: 'Aula 1 — Présent de l\'indicatif', type: 'youtube' as const, videoId: 'loi51vXe3H0' },
  { title: 'Aula 2 — Verbos do 1º grupo', type: 'youtube' as const, videoId: 'SN50sYAjrd4' },
  { title: 'Aula 3 — Verbos do 2º grupo', type: 'youtube' as const, videoId: '5km6rmM-3h0' },
  { title: 'Aula 4 — Verbos do 3º grupo', type: 'youtube' as const, videoId: '7Xb-B3K7cMU' },
  { title: 'Aula 5 — Revisão e prática', type: 'youtube' as const, videoId: 'R44zqzlkK2s' },
]

const spring = { type: 'spring' as const, stiffness: 100, damping: 20 }

export default function CursoGratuitoPage() {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeLesson = lessons[activeIndex]

  return (
    <div className="relative min-h-full">
      {/* Background pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'url(/Estampa-Formas.png)',
          backgroundSize: '600px',
          backgroundRepeat: 'repeat',
        }}
      />

      <div className="relative z-10 p-6 md:p-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[2px] uppercase text-emerald-600 bg-emerald-500/10 rounded-full px-3.5 py-1">
              Gratuito
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[2px] uppercase text-[var(--color-azul-escuro)]/35">
              <YoutubeLogo className="h-4 w-4" weight="fill" />
              YouTube
            </span>
          </div>
          <h1 className="text-2xl md:text-[2rem] font-bold text-[var(--color-azul-escuro)] tracking-tight leading-tight">
            Curso Gratuito: Présent de l&apos;Indicatif
          </h1>
          <p className="text-[var(--color-azul-escuro)]/45 mt-2 max-w-[60ch]">
            Tudo que voc&ecirc; precisa saber sobre o principal tempo verbal do franc&ecirc;s.
          </p>
        </motion.div>

        {/* Player + Lesson List */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
          {/* Video Player */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.05 }}
          >
            <div className="bg-[var(--color-surface-lowest)] rounded-[1.5rem] overflow-hidden shadow-[0_8px_32px_rgba(48,51,66,0.04)]">
              <div className="relative w-full" style={{ paddingBottom: activeLesson.type === 'canva' ? '62.5%' : '56.25%' }}>
                {activeLesson.type === 'canva' ? (
                  <iframe
                    key="canva"
                    className="absolute inset-0 w-full h-full"
                    src={CANVA_EMBED}
                    title={activeLesson.title}
                    allowFullScreen
                  />
                ) : (
                  <iframe
                    key={activeLesson.videoId}
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${activeLesson.videoId}?rel=0`}
                    title={activeLesson.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </div>
              <div className="p-5 md:p-6">
                <p className="text-[10px] text-[var(--color-rosa)] font-semibold tracking-[2.5px] uppercase mb-1.5">
                  Aula {activeIndex + 1} de {lessons.length}
                </p>
                <h2 className="text-lg font-bold text-[var(--color-azul-escuro)] tracking-tight">
                  {activeLesson.title}
                </h2>
              </div>
            </div>
          </motion.div>

          {/* Lesson Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.1 }}
            className="bg-[var(--color-surface-lowest)] rounded-[1.5rem] shadow-[0_8px_32px_rgba(48,51,66,0.04)] overflow-hidden"
          >
            <div className="p-5 pb-3">
              <p className="text-xs font-semibold text-[var(--color-azul-escuro)]/40 tracking-[2px] uppercase">
                Aulas do curso
              </p>
            </div>
            <div className="px-3 pb-4 space-y-1 max-h-[520px] overflow-y-auto">
              {lessons.map((lesson, index) => {
                const isActive = index === activeIndex
                return (
                  <button
                    key={lesson.videoId}
                    onClick={() => setActiveIndex(index)}
                    className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-left transition-all ${
                      isActive
                        ? 'bg-[var(--color-rosa)]/10'
                        : 'hover:bg-[var(--color-surface-low)]'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        isActive
                          ? 'bg-[var(--color-rosa)]/15'
                          : 'bg-[var(--color-surface-low)]'
                      }`}
                    >
                      {isActive ? (
                        <PlayCircle
                          className="h-[18px] w-[18px] text-[var(--color-rosa)]"
                          weight="fill"
                        />
                      ) : (
                        <span className="text-xs font-semibold text-[var(--color-azul-escuro)]/30">
                          {index + 1}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p
                        className={`text-sm font-medium truncate transition-colors ${
                          isActive
                            ? 'text-[var(--color-rosa)]'
                            : 'text-[var(--color-azul-escuro)]/60'
                        }`}
                      >
                        {lesson.title}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
