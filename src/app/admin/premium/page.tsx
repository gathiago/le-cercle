import { prisma } from '@/lib/prisma'
import { AdminPremiumManager } from '@/components/admin/premium-manager'

export default async function AdminPremiumPage() {
  const events = await prisma.premiumEvent.findMany({ orderBy: { date: 'desc' } })

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--color-azul-escuro)] mb-6">Eventos Premium</h1>
      <AdminPremiumManager initialEvents={JSON.parse(JSON.stringify(events))} />
    </div>
  )
}
