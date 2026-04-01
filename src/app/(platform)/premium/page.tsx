import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Crown, Calendar, MapPin, Users, ArrowRight } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Link from 'next/link'

export default async function PremiumPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const isPremium = session.user.subscriptionPlan === 'premium'

  if (!isPremium) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="bg-[var(--color-surface-lowest)] rounded-3xl p-10 shadow-[0_4px_24px_rgba(48,51,66,0.06)]">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center mx-auto mb-6">
            <Crown className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-azul-escuro)] mb-3">
            Experiência Premium
          </h1>
          <p className="text-muted-foreground mb-6">
            Desbloqueie eventos presenciais exclusivos, networking high-end e concierge francophone.
          </p>
          <Link
            href="/checkout"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[var(--color-laranja)] to-[#ff9062] text-white px-8 py-3 rounded-2xl font-semibold hover:opacity-90 transition-opacity shadow-[0_8px_32px_rgba(252,142,96,0.3)]"
          >
            Fazer Upgrade <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    )
  }

  const events = await prisma.premiumEvent.findMany({
    where: { date: { gte: new Date() } },
    orderBy: { date: 'asc' },
  })

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Crown className="h-5 w-5 text-amber-500" />
          <span className="text-[10px] font-semibold tracking-widest uppercase text-amber-500">Premium</span>
        </div>
        <h1 className="text-2xl font-bold text-[var(--color-azul-escuro)]">Eventos Exclusivos</h1>
        <p className="text-muted-foreground mt-1">Experiências presenciais e networking.</p>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Calendar className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p>Nenhum evento premium agendado no momento.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="bg-[var(--color-surface-lowest)] rounded-2xl p-6 shadow-[0_4px_24px_rgba(48,51,66,0.06)]">
              <div className="flex flex-col md:flex-row gap-4">
                {event.imageUrl && (
                  <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden shrink-0">
                    <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-[var(--color-azul-escuro)]">{event.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-3">{event.description}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {format(event.date, "dd 'de' MMMM, HH:mm", { locale: ptBR })}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {event.city}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {event.spotsLeft} vagas restantes
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
