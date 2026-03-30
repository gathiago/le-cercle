import { prisma } from '@/lib/prisma'
import { AdminMeetingsManager } from '@/components/admin/meetings-manager'

export default async function AdminEncontrosPage() {
  const meetings = await prisma.meeting.findMany({
    orderBy: { scheduledAt: 'desc' },
  })

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--color-azul-escuro)] mb-6">Gerenciar Encontros</h1>
      <AdminMeetingsManager initialMeetings={JSON.parse(JSON.stringify(meetings))} />
    </div>
  )
}
