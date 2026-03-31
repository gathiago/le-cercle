import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, FileDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { LessonCompleteButton } from '@/components/clube/lesson-complete-button'
import DOMPurify from 'isomorphic-dompurify'

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; courseSlug: string; lessonSlug: string }>
}) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { subscriptionStatus: true },
  })
  if (!currentUser || currentUser.subscriptionStatus !== 'ACTIVE') {
    redirect('/checkout')
  }

  const { slug, courseSlug, lessonSlug } = await params

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
      },
    },
  })

  if (!course) notFound()

  const lessonIndex = course.lessons.findIndex(l => l.slug === lessonSlug)
  if (lessonIndex === -1) notFound()

  const lesson = course.lessons[lessonIndex]
  const prevLesson = lessonIndex > 0 ? course.lessons[lessonIndex - 1] : null
  const nextLesson = lessonIndex < course.lessons.length - 1 ? course.lessons[lessonIndex + 1] : null

  const progress = await prisma.userProgress.findUnique({
    where: { userId_lessonId: { userId: session.user.id, lessonId: lesson.id } },
  })

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back */}
      <Link href={`/clube/${slug}/curso/${courseSlug}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[var(--color-azul-escuro)] mb-6">
        <ArrowLeft className="h-4 w-4" /> Voltar ao curso
      </Link>

      {/* Lesson Header */}
      <div className="mb-6">
        <p className="text-[10px] font-semibold tracking-widest uppercase text-[var(--color-rosa)] mb-2">
          Aula {String(lessonIndex + 1).padStart(2, '0')} de {course.lessons.length}
        </p>
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-azul-escuro)] mb-2">{lesson.title}</h1>
        {lesson.description && (
          <p className="text-muted-foreground leading-relaxed">{lesson.description}</p>
        )}
      </div>

      {/* Video */}
      {lesson.videoUrl && (
        <div className="bg-[var(--color-azul-escuro)] rounded-2xl overflow-hidden mb-6 aspect-video relative">
          <iframe
            src={lesson.videoUrl}
            title={lesson.title}
            className="w-full h-full absolute inset-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {/* Content */}
      {lesson.content && (
        <div className="bg-[var(--color-surface-lowest)] rounded-2xl p-6 mb-6 shadow-[0_4px_24px_rgba(48,51,66,0.04)]">
          <div
            className="prose prose-sm max-w-none text-[var(--color-azul-escuro)]"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(lesson.content) }}
          />
        </div>
      )}

      {/* Material download */}
      {lesson.materialUrl && (
        <a
          href={lesson.materialUrl.startsWith('/uploads/') ? `/api${lesson.materialUrl}` : lesson.materialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-[var(--color-surface-lowest)] rounded-2xl p-5 mb-6 shadow-[0_4px_16px_rgba(48,51,66,0.04)] hover:shadow-[0_8px_24px_rgba(48,51,66,0.08)] transition-shadow"
        >
          <div className="w-10 h-10 rounded-xl bg-[var(--color-laranja-light)] flex items-center justify-center shrink-0">
            <FileDown className="h-5 w-5 text-[var(--color-laranja)]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-[var(--color-azul-escuro)]">
              {lesson.materialName || 'Material da aula'}
            </p>
            <p className="text-xs text-[var(--color-azul-escuro)]/30">Clique para baixar</p>
          </div>
        </a>
      )}

      {/* Mark complete */}
      <div className="mb-8">
        <LessonCompleteButton
          lessonId={lesson.id}
          completed={progress?.completed || false}
        />
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-[var(--color-surface-low)]">
        {prevLesson ? (
          <Link
            href={`/clube/${slug}/curso/${courseSlug}/aula/${prevLesson.slug}`}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-[var(--color-azul-escuro)]"
          >
            <ChevronLeft className="h-4 w-4" /> Aula anterior
          </Link>
        ) : <div />}
        {nextLesson ? (
          <Link
            href={`/clube/${slug}/curso/${courseSlug}/aula/${nextLesson.slug}`}
            className="flex items-center gap-2 text-sm text-[var(--color-laranja)] font-medium hover:text-[var(--color-laranja-hover)]"
          >
            Próxima aula <ChevronRight className="h-4 w-4" />
          </Link>
        ) : (
          <Link
            href={`/clube/${slug}/curso/${courseSlug}`}
            className="flex items-center gap-2 text-sm text-emerald-600 font-medium"
          >
            Voltar ao curso
          </Link>
        )}
      </div>
    </div>
  )
}
