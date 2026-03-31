import { prisma } from '@/lib/prisma'
import { AdminClubsManager } from '@/components/admin/clubs-manager'

export default async function AdminClubesPage() {
  const clubs = await prisma.club.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      _count: { select: { courses: true, members: true } },
    },
  })

  const formatted = clubs.map((c) => ({
    ...c,
    courseCount: c._count.courses,
    memberCount: c._count.members,
  }))

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--color-azul-escuro)] mb-6">Clubes</h1>
      <AdminClubsManager initialClubs={JSON.parse(JSON.stringify(formatted))} />
    </div>
  )
}
