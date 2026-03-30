import { prisma } from '@/lib/prisma'
import { AdminMembersTable } from '@/components/admin/members-table'
import { Users, Crown, TrendingDown } from 'lucide-react'
import { subDays } from 'date-fns'

export default async function AdminMembrosPage() {
  const now = new Date()
  const thirtyDaysAgo = subDays(now, 30)

  const [members, totalActive, premiumCount, canceledRecently, totalMembers] = await Promise.all([
    prisma.user.findMany({
      where: { role: 'MEMBER' },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, name: true, email: true, level: true,
        subscriptionPlan: true, subscriptionStatus: true,
        createdAt: true, onboardingDone: true,
        blockReason: true, onboardingAnswer: true,
        couponUsed: true, avatarUrl: true,
      },
    }),
    prisma.user.count({ where: { role: 'MEMBER', subscriptionStatus: 'ACTIVE' } }),
    prisma.user.count({ where: { role: 'MEMBER', subscriptionPlan: 'premium', subscriptionStatus: 'ACTIVE' } }),
    prisma.user.count({ where: { role: 'MEMBER', subscriptionStatus: 'CANCELED', updatedAt: { gte: thirtyDaysAgo } } }),
    prisma.user.count({ where: { role: 'MEMBER' } }),
  ])

  const churnRate = totalMembers > 0 ? ((canceledRecently / totalMembers) * 100).toFixed(1) : '0'

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--color-azul-escuro)] mb-6">Gestão de Membros</h1>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Total Active - gradient card */}
        <div className="bg-gradient-to-br from-[var(--color-rosa)] to-[#c97080] rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-8 translate-x-8" />
          <p className="text-xs font-semibold tracking-widest uppercase opacity-80">Total de Membros Ativos</p>
          <p className="text-4xl font-bold mt-2">{totalActive.toLocaleString('pt-BR')}</p>
        </div>

        {/* Premium */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-3">
            <Crown className="h-5 w-5 text-amber-500" />
          </div>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Membros Premium</p>
          <p className="text-3xl font-bold text-[var(--color-azul-escuro)] mt-1">{premiumCount}</p>
        </div>

        {/* Churn */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mb-3">
            <TrendingDown className="h-5 w-5 text-gray-500" />
          </div>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Churn Rate</p>
          <p className="text-3xl font-bold text-[var(--color-azul-escuro)] mt-1">{churnRate}%</p>
        </div>
      </div>

      <AdminMembersTable initialMembers={JSON.parse(JSON.stringify(members))} />
    </div>
  )
}
