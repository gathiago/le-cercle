import { prisma } from '@/lib/prisma'
import { AdminWeeksManager } from '@/components/admin/weeks-manager'

export default async function AdminSemanasPage() {
  const weeks = await prisma.weekContent.findMany({
    orderBy: { weekNumber: 'desc' },
  })

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--color-azul-escuro)] mb-6">Gerenciar Semanas</h1>
      <AdminWeeksManager initialWeeks={JSON.parse(JSON.stringify(weeks))} />
    </div>
  )
}
