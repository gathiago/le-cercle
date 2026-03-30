import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar, Clock, Users, MapPin, Video } from 'lucide-react'
import Link from 'next/link'

export default async function EncontrosPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const userLevel = session.user.level
  const isPremium = session.user.subscriptionPlan === 'premium'

  const meetings = await prisma.meeting.findMany({
    where: {
      scheduledAt: { gte: new Date() },
      OR: [
        { level: userLevel as any },
        ...(isPremium ? [{ isPremiumOnly: true }] : []),
      ],
    },
    orderBy: { scheduledAt: 'asc' },
    include: { weekContent: { select: { title: true } } },
  })

  const levelColors: Record<string, string> = {
    INICIANTE: 'bg-green-100 text-green-700',
    INTERMEDIARIO: 'bg-[var(--color-laranja-light)] text-[var(--color-laranja)]',
    AVANCADO: 'bg-[var(--color-rosa-light)] text-[var(--color-rosa)]',
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-azul-escuro)]">Encontros</h1>
        <p className="text-muted-foreground mt-1">Suas próximas conversas em francês.</p>
      </div>

      {meetings.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Calendar className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p>Nenhum encontro agendado para o seu nível.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {meetings.map((meeting) => {
            const isToday = format(meeting.scheduledAt, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
            const timeDiff = meeting.scheduledAt.getTime() - Date.now()
            const canJoin = timeDiff <= 5 * 60 * 1000 && timeDiff > -meeting.duration * 60 * 1000

            return (
              <div
                key={meeting.id}
                className={`bg-white rounded-2xl p-6 shadow-[0_4px_24px_rgba(48,51,66,0.06)] ${
                  isToday ? 'ring-2 ring-[var(--color-laranja)]/30' : ''
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Date */}
                  <div className="flex items-center gap-4 md:min-w-[200px]">
                    <div className="bg-[var(--color-surface-low)] rounded-xl px-4 py-3 text-center min-w-[60px]">
                      <p className="text-[10px] font-semibold text-[var(--color-rosa)] uppercase tracking-wider">
                        {format(meeting.scheduledAt, 'MMM', { locale: ptBR })}
                      </p>
                      <p className="text-2xl font-bold text-[var(--color-azul-escuro)]">
                        {format(meeting.scheduledAt, 'dd')}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--color-azul-escuro)]">{meeting.title}</p>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        {format(meeting.scheduledAt, 'HH:mm')} — {meeting.duration}min
                      </div>
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-3 flex-1">
                    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${levelColors[meeting.level]}`}>
                      {meeting.level}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="h-3.5 w-3.5" />
                      Max {meeting.maxParticipants}
                    </span>
                    {meeting.isPremiumOnly && (
                      <span className="flex items-center gap-1 text-xs text-amber-600">
                        <MapPin className="h-3.5 w-3.5" />
                        Presencial — {meeting.city}
                      </span>
                    )}
                  </div>

                  {/* Action */}
                  <div>
                    {canJoin ? (
                      <a
                        href={meeting.meetingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[var(--color-laranja)] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[var(--color-laranja-hover)] transition-colors"
                      >
                        <Video className="h-4 w-4" /> Entrar
                      </a>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        {format(meeting.scheduledAt, "dd/MM 'às' HH:mm")}
                      </span>
                    )}
                  </div>
                </div>

                {meeting.description && (
                  <p className="text-sm text-muted-foreground mt-3 pl-[76px] md:pl-0">
                    {meeting.description}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
