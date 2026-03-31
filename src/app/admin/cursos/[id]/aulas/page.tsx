import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { AdminLessonsManager } from '@/components/admin/lessons-manager'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function AdminAulasPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      lessons: { orderBy: { sortOrder: 'asc' } },
    },
  })

  if (!course) notFound()

  return (
    <div>
      <Link
        href="/admin/cursos"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-[var(--color-azul-escuro)] mb-4 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar para Cursos
      </Link>
      <h1 className="text-2xl font-bold text-[var(--color-azul-escuro)] mb-1">Aulas</h1>
      <p className="text-sm text-muted-foreground mb-6">{course.title}</p>
      <AdminLessonsManager
        courseId={course.id}
        initialLessons={JSON.parse(JSON.stringify(course.lessons))}
      />
    </div>
  )
}
