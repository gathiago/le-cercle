import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { BookOpen, PlayCircle, FileText, ArrowRight } from 'lucide-react'

export default async function ConteudoGratuitoPage() {
  const freeCourses = await prisma.course.findMany({
    where: { isFree: true, isPublished: true },
    orderBy: { sortOrder: 'asc' },
    include: {
      _count: { select: { lessons: true } },
      lessons: {
        where: { isPublished: true },
        select: { materialUrl: true },
      },
    },
  })

  const freeProducts = await prisma.digitalProduct.findMany({
    where: { isActive: true, price: 0 },
    orderBy: { createdAt: 'desc' },
  })

  const hasContent = freeCourses.length > 0 || freeProducts.length > 0

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-600 text-xs font-semibold px-3 py-1 rounded-full mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          100% Gratuito
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-azul-escuro)] tracking-tight">
          Conteúdo Gratuito
        </h1>
        <p className="text-[var(--color-azul-escuro)]/40 mt-2 max-w-[50ch]">
          Recursos criados pela Mardia para acelerar seu aprendizado do francês. Sem custo, sem cadastro extra.
        </p>
      </div>

      {!hasContent && (
        <div className="text-center py-20 text-[var(--color-azul-escuro)]/30">
          <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p>Nenhum conteúdo gratuito disponível ainda.</p>
        </div>
      )}

      {/* Cursos gratuitos */}
      {freeCourses.length > 0 && (
        <div className="mb-10">
          <h2 className="text-sm font-bold text-[var(--color-azul-escuro)]/40 uppercase tracking-[2px] mb-5">Cursos em vídeo</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {freeCourses.map((course) => {
              const materialCount = course.lessons.filter(l => l.materialUrl).length
              return (
                <Link
                  key={course.id}
                  href={`/conteudo-gratuito/${course.slug}`}
                  className="bg-[var(--color-surface-lowest)] rounded-[1.5rem] p-6 shadow-[0_4px_24px_rgba(48,51,66,0.04)] hover:shadow-[0_8px_32px_rgba(48,51,66,0.08)] transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-400 flex items-center justify-center shrink-0 shadow-[0_4px_12px_rgba(16,185,129,0.2)]">
                      <PlayCircle className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-[var(--color-azul-escuro)] tracking-tight group-hover:text-[var(--color-rosa)] transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-sm text-[var(--color-azul-escuro)]/40 mt-1 line-clamp-2">{course.description}</p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-[var(--color-azul-escuro)]/30">
                        <span className="flex items-center gap-1">
                          <PlayCircle className="h-3.5 w-3.5" /> {course._count.lessons} aulas
                        </span>
                        {materialCount > 0 && (
                          <span className="flex items-center gap-1">
                            <FileText className="h-3.5 w-3.5" /> {materialCount} materiais
                          </span>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-[var(--color-azul-escuro)]/15 group-hover:text-[var(--color-rosa)] group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Materiais gratuitos (produtos digitais com preço 0) */}
      {freeProducts.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-[var(--color-azul-escuro)]/40 uppercase tracking-[2px] mb-5">Materiais para download</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {freeProducts.map((product) => (
              <a
                key={product.id}
                href={product.fileUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[var(--color-surface-lowest)] rounded-[1.5rem] p-6 shadow-[0_4px_24px_rgba(48,51,66,0.04)] hover:shadow-[0_8px_32px_rgba(48,51,66,0.08)] transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-rosa)] flex items-center justify-center shrink-0 shadow-[0_4px_12px_rgba(147,70,85,0.2)]">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[var(--color-azul-escuro)] tracking-tight group-hover:text-[var(--color-rosa)] transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-sm text-[var(--color-azul-escuro)]/40 mt-1 line-clamp-2">{product.description}</p>
                    <p className="text-xs text-emerald-600 font-semibold mt-3">Download gratuito</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-[var(--color-azul-escuro)]/15 group-hover:text-[var(--color-rosa)] group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
