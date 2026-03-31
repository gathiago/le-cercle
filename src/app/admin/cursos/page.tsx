import { prisma } from '@/lib/prisma'
import { AdminCoursesManager } from '@/components/admin/courses-manager'

export default async function AdminCursosPage() {
  const courses = await prisma.course.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      club: { select: { id: true, name: true } },
      _count: { select: { lessons: true } },
    },
  })

  const clubs = await prisma.club.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    select: { id: true, name: true },
  })

  const formatted = courses.map((c) => ({
    ...c,
    lessonCount: c._count.lessons,
    clubName: c.club?.name || null,
  }))

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--color-azul-escuro)] mb-6">Cursos</h1>
      <AdminCoursesManager
        initialCourses={JSON.parse(JSON.stringify(formatted))}
        clubs={clubs}
      />
    </div>
  )
}
