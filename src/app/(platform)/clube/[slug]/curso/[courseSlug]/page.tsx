import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Play, Clock, FileText, CheckCircle2 } from 'lucide-react'

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string; courseSlug: string }>
}) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const { slug, courseSlug } = await params

  // Verify club membership
  const club = await prisma.club.findUnique({
    where: { slug },
    include: {
      members: {
        where: { userId: session.user.id },
        select: { id: true },
      },
    },
  })

  if (!club || club.members.length === 0) {
    redirect(`/clube/${slug}`)
  }

  const course = await prisma.course.findFirst({
    where: { slug: courseSlug, clubId: club.id, isPublished: true },
    include: {
      lessons: {
        where: { isPublished: true },
        orderBy: { sortOrder: 'asc' },
        include: {
          progress: {
            where: { userId: session.user.id },
            select: { completed: true },
          },
        },
      },
    },
  })

  if (!course) notFound()

  const completedCount = course.lessons.filter(l => l.progress[0]?.completed).length
  const totalLessons = course.lessons.length
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back */}
      <Link href={`/clube/${slug}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[var(--color-azul-escuro)] mb-6">
        <ArrowLeft className="h-4 w-4" /> Voltar ao {club.name}
      </Link>

      {/* Course Header */}
      <div className="mb-8">
        {course.imageUrl && (
          <div className="w-full h-48 rounded-2xl overflow-hidden mb-6">
            <img
              src={course.imageUrl.startsWith('/uploads/') ? `/api${course.imageUrl}` : course.imageUrl}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <h1 className="text-3xl font-bold text-[var(--color-azul-escuro)] mb-2">{course.title}</h1>
        <p className="text-muted-foreground leading-relaxed">{course.description}</p>
      </div>

      {/* Progress bar */}
      {totalLessons > 0 && (
        <div className="bg-[var(--color-surface-lowest)] rounded-2xl p-5 mb-8 shadow-[0_4px_24px_rgba(48,51,66,0.04)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-[var(--color-azul-escuro)]">Progresso</span>
            <span className="text-xs text-[var(--color-azul-escuro)]/40">{completedCount}/{totalLessons} aulas</span>
          </div>
          <div className="h-2 bg-[var(--color-surface-low)] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[var(--color-rosa)] to-[var(--color-laranja)] rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Lessons */}
      <div className="space-y-3">
        {course.lessons.map((lesson, i) => {
          const isCompleted = lesson.progress[0]?.completed

          return (
            <Link
              key={lesson.id}
              href={`/clube/${slug}/curso/${courseSlug}/aula/${lesson.slug}`}
              className="flex items-center gap-4 bg-[var(--color-surface-lowest)] rounded-2xl p-5 shadow-[0_4px_16px_rgba(48,51,66,0.04)] hover:shadow-[0_8px_24px_rgba(48,51,66,0.08)] transition-shadow group"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                isCompleted
                  ? 'bg-emerald-100'
                  : 'bg-[var(--color-surface-low)] group-hover:bg-gradient-to-br group-hover:from-[var(--color-primary)] group-hover:to-[var(--color-rosa)]'
              }`}>
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                ) : (
                  <Play className="h-4 w-4 text-[var(--color-azul-escuro)]/30 group-hover:text-white ml-0.5" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold tracking-widest uppercase text-[var(--color-azul-escuro)]/30 mb-0.5">
                  Aula {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="font-bold text-sm text-[var(--color-azul-escuro)] truncate">{lesson.title}</h3>
              </div>
              <div className="flex items-center gap-3 text-xs text-[var(--color-azul-escuro)]/30 shrink-0">
                {lesson.duration && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {lesson.duration} min
                  </span>
                )}
                {lesson.materialUrl && (
                  <FileText className="h-3.5 w-3.5" />
                )}
              </div>
            </Link>
          )
        })}
      </div>

      {totalLessons === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p>Aulas em preparação.</p>
        </div>
      )}
    </div>
  )
}
