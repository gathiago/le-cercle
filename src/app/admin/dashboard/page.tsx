import { prisma } from '@/lib/prisma'
import { format, subDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { AlertTriangle, TrendingUp, Users, CreditCard, MessageCircle, Crown, Calendar } from 'lucide-react'

export default async function AdminDashboardPage() {
  const now = new Date()
  const thirtyDaysAgo = subDays(now, 30)
  const sevenDaysAgo = subDays(now, 7)

  const [
    totalMembers,
    activeMembers,
    newThisWeek,
    membersByPlan,
    membersByLevel,
    recentMembers,
    recentPosts,
    totalPosts,
    pastDueMembers,
    canceledRecently,
    upcomingMeetings,
    premiumMembers,
  ] = await Promise.all([
    prisma.user.count({ where: { role: 'MEMBER' } }),
    prisma.user.count({ where: { subscriptionStatus: 'ACTIVE', role: 'MEMBER' } }),
    prisma.user.count({ where: { role: 'MEMBER', createdAt: { gte: sevenDaysAgo } } }),
    prisma.user.groupBy({ by: ['subscriptionPlan'], where: { subscriptionStatus: 'ACTIVE', role: 'MEMBER' }, _count: true }),
    prisma.user.groupBy({ by: ['level'], where: { subscriptionStatus: 'ACTIVE', role: 'MEMBER' }, _count: true }),
    prisma.user.findMany({ where: { role: 'MEMBER' }, orderBy: { createdAt: 'desc' }, take: 5, select: { name: true, email: true, subscriptionPlan: true, createdAt: true, level: true } }),
    prisma.post.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.post.count(),
    prisma.user.findMany({ where: { subscriptionStatus: 'PAST_DUE', role: 'MEMBER' }, select: { name: true, email: true } }),
    prisma.user.count({ where: { subscriptionStatus: 'CANCELED', role: 'MEMBER', updatedAt: { gte: thirtyDaysAgo } } }),
    prisma.meeting.count({ where: { scheduledAt: { gte: now } } }),
    prisma.user.count({ where: { role: 'MEMBER', subscriptionPlan: 'premium', subscriptionStatus: 'ACTIVE' } }),
  ])

  const churnRate = totalMembers > 0 ? ((canceledRecently / totalMembers) * 100).toFixed(1) : '0'

  const metrics = [
    { label: 'Membros Ativos', value: activeMembers, icon: Users, gradient: 'from-[var(--color-rosa)] to-[#c97080]', light: false },
    { label: 'Novos (7 dias)', value: newThisWeek, icon: TrendingUp, bg: 'bg-white', iconBg: 'bg-green-50', iconColor: 'text-green-500' },
    { label: 'Posts (7 dias)', value: recentPosts, icon: MessageCircle, bg: 'bg-white', iconBg: 'bg-blue-50', iconColor: 'text-blue-500' },
    { label: 'Premium', value: premiumMembers, icon: Crown, bg: 'bg-white', iconBg: 'bg-amber-50', iconColor: 'text-amber-500' },
  ]

  const planLabels: Record<string, string> = { monthly: 'Mensal', quarterly: 'Trimestral', yearly: 'Anual', premium: 'Premium' }
  const planColors: Record<string, string> = { monthly: 'bg-blue-500', quarterly: 'bg-[var(--color-laranja)]', yearly: 'bg-[var(--color-rosa)]', premium: 'bg-amber-500' }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--color-azul-escuro)] mb-6">Dashboard</h1>

      {/* Alerts */}
      {pastDueMembers.length > 0 && (
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-6 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Pagamentos pendentes</p>
            <p className="text-xs text-amber-600 mt-0.5">
              {pastDueMembers.length} membro(s): {pastDueMembers.map(m => m.name).join(', ')}
            </p>
          </div>
        </div>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map((m, i) => {
          const Icon = m.icon
          if (i === 0) {
            return (
              <div key={m.label} className={`bg-gradient-to-br ${m.gradient} rounded-2xl p-6 text-white relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-6 translate-x-6" />
                <p className="text-xs font-semibold tracking-widest uppercase opacity-80">{m.label}</p>
                <p className="text-4xl font-bold mt-2">{m.value.toLocaleString('pt-BR')}</p>
              </div>
            )
          }
          return (
            <div key={m.label} className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className={`w-10 h-10 rounded-xl ${m.iconBg} flex items-center justify-center mb-3`}>
                <Icon className={`h-5 w-5 ${m.iconColor}`} />
              </div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">{m.label}</p>
              <p className="text-3xl font-bold text-[var(--color-azul-escuro)] mt-1">{typeof m.value === 'number' ? m.value.toLocaleString('pt-BR') : m.value}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* By Plan */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="font-bold text-[var(--color-azul-escuro)] mb-5">Membros por Plano</h3>
          <div className="space-y-4">
            {['monthly', 'quarterly', 'yearly', 'premium'].map(plan => {
              const count = membersByPlan.find(m => m.subscriptionPlan === plan)?._count || 0
              const pct = activeMembers > 0 ? (count / activeMembers) * 100 : 0
              return (
                <div key={plan}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-500 font-medium">{planLabels[plan]}</span>
                    <span className="font-bold text-[var(--color-azul-escuro)]">{count}</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${planColors[plan]} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* By Level */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="font-bold text-[var(--color-azul-escuro)] mb-5">Membros por Nível</h3>
          <div className="space-y-4">
            {['INICIANTE', 'INTERMEDIARIO', 'AVANCADO'].map(level => {
              const count = membersByLevel.find(m => m.level === level)?._count || 0
              const pct = activeMembers > 0 ? (count / activeMembers) * 100 : 0
              const labels: Record<string, string> = { INICIANTE: 'Iniciante', INTERMEDIARIO: 'Intermediário', AVANCADO: 'Avançado' }
              const colors: Record<string, string> = { INICIANTE: 'bg-green-500', INTERMEDIARIO: 'bg-[var(--color-laranja)]', AVANCADO: 'bg-[var(--color-rosa)]' }
              return (
                <div key={level}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-500 font-medium">{labels[level]}</span>
                    <span className="font-bold text-[var(--color-azul-escuro)]">{count}</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${colors[level]} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Total Membros</p>
          <p className="text-2xl font-bold text-[var(--color-azul-escuro)] mt-1">{totalMembers}</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Total Posts</p>
          <p className="text-2xl font-bold text-[var(--color-azul-escuro)] mt-1">{totalPosts}</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Encontros Futuros</p>
          <p className="text-2xl font-bold text-[var(--color-azul-escuro)] mt-1">{upcomingMeetings}</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Churn (30d)</p>
          <p className="text-2xl font-bold text-[var(--color-azul-escuro)] mt-1">{churnRate}%</p>
        </div>
      </div>

      {/* Recent Members */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h3 className="font-bold text-[var(--color-azul-escuro)] mb-4">Cadastros Recentes</h3>
        <div className="space-y-3">
          {recentMembers.map((member, i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-600 text-sm font-bold">
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--color-azul-escuro)]">{member.name}</p>
                  <p className="text-xs text-gray-400">{member.email}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-[var(--color-laranja)] capitalize">{member.subscriptionPlan || 'Sem plano'}</span>
                <p className="text-[10px] text-gray-400">
                  {format(member.createdAt, "dd 'de' MMM", { locale: ptBR })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
