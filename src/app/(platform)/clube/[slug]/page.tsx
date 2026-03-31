import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, BookOpen, Play, Lock, Clock } from 'lucide-react'

const clubSubtitles: Record<string, string> = {
  'Premiers Pas Club': 'Clube para iniciantes no francês',
  'Club Intermédiaire': 'Clube para nível intermediário',
  'Fluent Club': 'Clube para nível avançado',
  'Nuit Club': 'Clube de música francesa',
  'Noir Lecture Club': 'Clube de leitura em francês',
  'Ciné Noir Club': 'Clube de cinema francês',
}

export default async function ClubDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  // Check subscription is active
  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { subscriptionStatus: true },
  })
  if (!currentUser || currentUser.subscriptionStatus !== 'ACTIVE') {
    redirect('/checkout')
  }

  const { slug } = await params

  const club = await prisma.club.findUnique({
    where: { slug },
    include: {
      courses: {
        where: { isPublished: true },
        orderBy: { sortOrder: 'asc' },
        include: {
          lessons: {
            where: { isPublished: true },
            orderBy: { sortOrder: 'asc' },
            select: { id: true, title: true, duration: true },
          },
        },
      },
      members: {
        where: { userId: session.user.id },
        select: { id: true },
      },
    },
  })

  if (!club) notFound()

  const isMember = club.members.length > 0
  const subtitle = clubSubtitles[club.name] || club.description

  // If not a member, show locked page
  if (!isMember) {
    return (
      <div className="max-w-3xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[var(--color-azul-escuro)] mb-6">
          <ArrowLeft className="h-4 w-4" /> Voltar ao Dashboard
        </Link>

        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-2xl bg-[var(--color-surface-low)] flex items-center justify-center mx-auto mb-6">
            <Lock className="h-8 w-8 text-[var(--color-azul-escuro)]/20" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-azul-escuro)] mb-3">{club.name}</h1>
          <p className="text-muted-foreground mb-6">{subtitle}</p>
          <p className="text-sm text-[var(--color-azul-escuro)]/40 mb-8">
            Esse clube não está incluso no seu plano atual.
          </p>
          <Link
            href="/checkout"
            className="inline-flex items-center gap-2 bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-laranja)] text-white px-6 py-3 rounded-xl font-semibold shadow-[0_8px_24px_rgba(252,142,96,0.2)]"
          >
            Ver planos para desbloquear
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back */}
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[var(--color-azul-escuro)] mb-6">
        <ArrowLeft className="h-4 w-4" /> Voltar ao Dashboard
      </Link>

      {/* Club Header */}
      <div className="mb-8">
        {club.imageUrl && (
          <div className="w-full h-48 rounded-2xl overflow-hidden mb-6">
            <img
              src={club.imageUrl.startsWith('/uploads/') ? `/api${club.imageUrl}` : club.imageUrl}
              alt={club.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <h1 className="text-3xl font-bold text-[var(--color-azul-escuro)] mb-2">{club.name}</h1>
        <p className="text-muted-foreground text-lg">{subtitle}</p>
      </div>

      {/* Courses */}
      {club.courses.length > 0 ? (
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-6 rounded-full bg-[var(--color-rosa)]" />
            <h2 className="text-xl font-bold text-[var(--color-azul-escuro)]">Conteúdos</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {club.courses.map((course) => {
              const totalLessons = course.lessons.length
              const totalDuration = course.lessons.reduce((sum, l) => sum + (l.duration || 0), 0)

              return (
                <Link
                  key={course.id}
                  href={`/clube/${club.slug}/curso/${course.slug}`}
                  className="bg-[var(--color-surface-lowest)] rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(48,51,66,0.06)] hover:shadow-[0_8px_32px_rgba(48,51,66,0.1)] transition-shadow group"
                >
                  {course.imageUrl && (
                    <div className="w-full h-36 overflow-hidden">
                      <img
                        src={course.imageUrl.startsWith('/uploads/') ? `/api${course.imageUrl}` : course.imageUrl}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-bold text-[var(--color-azul-escuro)] mb-1">{course.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{course.description}</p>
                    <div className="flex items-center gap-4 text-xs text-[var(--color-azul-escuro)]/40">
                      <span className="flex items-center gap-1">
                        <Play className="h-3.5 w-3.5" /> {totalLessons} aula{totalLessons !== 1 ? 's' : ''}
                      </span>
                      {totalDuration > 0 && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" /> {totalDuration} min
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-16">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-[var(--color-azul-escuro)]/10" />
          <p className="text-muted-foreground">Conteúdos em breve.</p>
          <p className="text-sm text-[var(--color-azul-escuro)]/30 mt-1">Estamos preparando materiais incríveis para este clube!</p>
        </div>
      )}
    </div>
  )
}
