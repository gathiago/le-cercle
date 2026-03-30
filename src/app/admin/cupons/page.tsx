import { prisma } from '@/lib/prisma'
import { AdminCouponsManager } from '@/components/admin/coupons-manager'

export default async function AdminCuponsPage() {
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } })
  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--color-azul-escuro)] mb-6">Gerenciar Cupons</h1>
      <AdminCouponsManager initialCoupons={JSON.parse(JSON.stringify(coupons))} />
    </div>
  )
}
