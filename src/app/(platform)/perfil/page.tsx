import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { ProfileForm } from '@/components/perfil/profile-form'
import { SignOutButton } from '@/components/perfil/sign-out-button'
import { Crown, CreditCard } from 'lucide-react'

export default async function PerfilPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      level: true,
      subscriptionPlan: true,
      subscriptionStatus: true,
      subscriptionEnd: true,
      createdAt: true,
    },
  })

  if (!user) redirect('/login')

  const levelLabels: Record<string, string> = {
    INICIANTE: 'Iniciante',
    INTERMEDIARIO: 'Intermediário',
    AVANCADO: 'Avançado',
  }

  const planLabels: Record<string, string> = {
    monthly: 'Mensal',
    quarterly: 'Trimestral',
    yearly: 'Anual',
    premium: 'Premium',
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-[var(--color-azul-escuro)] mb-8">Meu Perfil</h1>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl p-6 shadow-[0_4px_24px_rgba(48,51,66,0.06)] mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-[var(--color-rosa)] flex items-center justify-center text-white text-2xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[var(--color-azul-escuro)]">{user.name}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-block bg-[var(--color-rosa-light)] text-[var(--color-azul-escuro)] text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
                {levelLabels[user.level] || user.level}
              </span>
              {user.subscriptionPlan === 'premium' && (
                <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
                  <Crown className="h-3 w-3" /> Premium
                </span>
              )}
            </div>
          </div>
        </div>

        <ProfileForm user={{ id: user.id, name: user.name }} />
      </div>

      {/* Subscription */}
      <div className="bg-white rounded-2xl p-6 shadow-[0_4px_24px_rgba(48,51,66,0.06)]">
        <h3 className="font-semibold text-[var(--color-azul-escuro)] mb-4 flex items-center gap-2">
          <CreditCard className="h-5 w-5" /> Assinatura
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Plano</span>
            <span className="font-medium text-[var(--color-azul-escuro)]">
              {planLabels[user.subscriptionPlan || ''] || 'Nenhum'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status</span>
            <span className={`font-medium ${
              user.subscriptionStatus === 'ACTIVE' ? 'text-green-600' : 'text-red-500'
            }`}>
              {user.subscriptionStatus === 'ACTIVE' ? 'Ativo' : user.subscriptionStatus}
            </span>
          </div>
          {user.subscriptionEnd && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Próxima cobrança</span>
              <span className="font-medium text-[var(--color-azul-escuro)]">
                {new Date(user.subscriptionEnd).toLocaleDateString('pt-BR')}
              </span>
            </div>
          )}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Para alterar ou cancelar sua assinatura, entre em contato pelo Instagram{' '}
          <a href="https://instagram.com/idiomascommardia" target="_blank" rel="noopener noreferrer" className="text-[var(--color-laranja)] font-medium">
            @idiomascommardia
          </a>
        </p>
      </div>

      {/* Sign Out */}
      <div className="mt-6">
        <SignOutButton />
      </div>
    </div>
  )
}
