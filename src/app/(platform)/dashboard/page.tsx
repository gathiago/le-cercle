import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { ArrowRight, Music, Play, BookText, Heart, MessageCircle } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Link from 'next/link'

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const user = session.user

  const [activeWeek, userClubs, recentPosts] = await Promise.all([
    prisma.weekContent.findFirst({
      where: { isActive: true },
      orderBy: { weekNumber: 'desc' },
    }),
    prisma.clubMember.findMany({
      where: { userId: user.id },
      include: {
        club: {
          include: {
            courses: {
              where: { isPublished: true },
              include: {
                _count: { select: { lessons: true } },
                lessons: {
                  select: { id: true },
                },
              },
            },
          },
        },
      },
    }),
    prisma.post.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { name: true, avatarUrl: true } },
        _count: { select: { reactions: true, comments: true } },
      },
    }),
  ])

  // Get user progress for lesson completion
  const userProgress = await prisma.userProgress.findMany({
    where: { userId: user.id, completed: true },
    select: { lessonId: true },
  })
  const completedLessonIds = new Set(userProgress.map(p => p.lessonId))

  // Club name mapping (FR → PT subtitle)
  const clubSubtitles: Record<string, string> = {
    'Premiers Pas Club': 'Clube Iniciantes',
    'Club Intermédiaire': 'Clube Intermediários',
    'Fluent Club': 'Clube Avançados',
    'Nuit Club': 'Clube de Música',
    'Noir Lecture Club': 'Clube de Leitura',
    'Ciné Noir Club': 'Clube de Cinema',
  }

  const clubColors = [
    'from-[var(--color-primary)] to-[var(--color-rosa)]',
    'from-[var(--color-secondary)] to-[var(--color-laranja)]',
    'from-emerald-600 to-emerald-400',
    'from-violet-600 to-violet-400',
    'from-amber-600 to-amber-400',
    'from-sky-600 to-sky-400',
  ]

  return (
    <div className="max-w-6xl mx-auto">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-azul-escuro)]">
          Bonjour, {user.name?.split(' ')[0]}!
        </h1>
        <p className="text-muted-foreground mt-1">
          Pronta para o seu salão literário de hoje?
        </p>
      </div>

      {/* Meus Clubes */}
      {userClubs.length > 0 ? (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[var(--color-azul-escuro)]">Meus Clubes</h3>
            <Link href="/conteudo-gratuito" className="text-sm text-[var(--color-laranja)] font-medium hover:text-[var(--color-laranja-hover)]">
              Ver todos
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {userClubs.map((membership, i) => {
              const club = membership.club
              const totalLessons = club.courses.reduce((acc, c) => acc + c._count.lessons, 0)
              const completedInClub = club.courses.reduce((acc, c) => {
                return acc + c.lessons.filter(l => completedLessonIds.has(l.id)).length
              }, 0)
              const progress = totalLessons > 0 ? Math.round((completedInClub / totalLessons) * 100) : 0
              const color = clubColors[i % clubColors.length]

              return (
                <Link
                  key={club.id}
                  href={`/conteudo-gratuito`}
                  className="bg-[var(--color-surface-lowest)] rounded-[1.5rem] p-5 shadow-[0_4px_16px_rgba(48,51,66,0.04)] hover:shadow-[0_8px_24px_rgba(48,51,66,0.08)] transition-all group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl overflow-hidden shrink-0 ${club.imageUrl ? '' : `bg-gradient-to-br ${color} flex items-center justify-center`}`}>
                      {club.imageUrl ? (
                        <img src={club.imageUrl} alt={club.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-white text-sm font-bold">{club.name.charAt(0)}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-[var(--color-azul-escuro)] text-sm truncate group-hover:text-[var(--color-rosa)] transition-colors">
                        {club.name}
                      </h4>
                      <p className="text-[10px] text-[var(--color-azul-escuro)]/35">
                        {clubSubtitles[club.name] || club.description?.split('—')[0]}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-[var(--color-surface-low)] rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${color} rounded-full transition-all`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-semibold text-[var(--color-azul-escuro)]/30">{progress}%</span>
                  </div>
                  {totalLessons > 0 && (
                    <p className="text-[10px] text-[var(--color-azul-escuro)]/25 mt-2">
                      {completedInClub}/{totalLessons} aulas concluídas
                    </p>
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="bg-[var(--color-rosa-light)] rounded-2xl p-6 mb-6">
          <h3 className="font-bold text-[var(--color-azul-escuro)] mb-2">Escolha seus clubes</h3>
          <p className="text-sm text-[var(--color-azul-escuro)]/60 mb-4">Você ainda não selecionou seus clubes. Explore o conteúdo disponível!</p>
          <Link href="/meu-plano" className="inline-flex items-center gap-2 bg-[var(--color-azul-escuro)] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:opacity-90">
            Escolher clubes <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {/* Weekly Theme + Challenge */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Weekly Theme */}
        <div className="bg-[var(--color-surface-lowest)] rounded-2xl p-6 shadow-[0_4px_24px_rgba(48,51,66,0.04)]">
          {activeWeek ? (
            <div>
              <span className="inline-block bg-[var(--color-rosa-light)] text-[var(--color-azul-escuro)] text-[10px] font-semibold px-3 py-1 rounded-full tracking-widest uppercase mb-3">
                Tema da Semana
              </span>
              <h2 className="text-xl font-bold text-[var(--color-azul-escuro)] mb-2">{activeWeek.title}</h2>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{activeWeek.description}</p>
              <Link href="/semana" className="inline-flex items-center gap-2 text-[var(--color-laranja)] font-medium text-sm hover:text-[var(--color-laranja-hover)]">
                Ver conteúdo <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">Conteúdo semanal em breve.</p>
          )}
        </div>

        {/* Challenge */}
        <div className="bg-gradient-to-br from-[var(--color-laranja-light)] to-[var(--color-surface-lowest)] rounded-2xl p-6">
          <h3 className="font-bold text-[var(--color-laranja)] mb-2">Desafio: Gravação de Áudio</h3>
          <p className="text-sm text-[var(--color-azul-escuro)]/60 mb-4">
            {activeWeek?.challengeText || 'Compartilhe algo em francês com a comunidade!'}
          </p>
          <Link href="/comunidade" className="inline-flex items-center gap-2 bg-[var(--color-azul-escuro)] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:opacity-90">
            Participar
          </Link>
        </div>
      </div>

      {/* Support Materials */}
      <div className="bg-[var(--color-surface-lowest)] rounded-2xl p-6 shadow-[0_4px_24px_rgba(48,51,66,0.04)] mb-6">
        <h3 className="font-semibold text-[var(--color-azul-escuro)] mb-4">Materiais de Apoio</h3>
        <div className="grid grid-cols-3 gap-4">
          <Link href="/semana" className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-[var(--color-surface-low)] transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[var(--color-rosa-light)] flex items-center justify-center">
              <Music className="h-5 w-5 text-[var(--color-rosa)]" />
            </div>
            <span className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">Playlist</span>
          </Link>
          <Link href="/semana" className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-[var(--color-surface-low)] transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[var(--color-laranja-light)] flex items-center justify-center">
              <Play className="h-5 w-5 text-[var(--color-laranja)]" />
            </div>
            <span className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">Vídeos</span>
          </Link>
          <Link href="/semana" className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-[var(--color-surface-low)] transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[var(--color-surface-low)] flex items-center justify-center">
              <BookText className="h-5 w-5 text-[var(--color-azul-escuro)]" />
            </div>
            <span className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">Vocab</span>
          </Link>
        </div>
      </div>

      {/* Community Mini Feed */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-[var(--color-azul-escuro)]">Comunidade</h3>
          <Link href="/comunidade" className="text-sm text-[var(--color-laranja)] font-medium hover:text-[var(--color-laranja-hover)]">
            Ver tudo
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recentPosts.length > 0 ? recentPosts.map((post) => (
            <div key={post.id} className="bg-[var(--color-surface-lowest)] rounded-2xl p-5 shadow-[0_4px_24px_rgba(48,51,66,0.04)]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-rosa)] flex items-center justify-center text-white text-xs font-bold">
                  {post.author.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--color-azul-escuro)]">{post.author.name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {format(post.createdAt, "d 'de' MMM", { locale: ptBR })}
                  </p>
                </div>
              </div>
              <p className="text-sm text-[var(--color-azul-escuro)]/70 line-clamp-3 mb-3">{post.content}</p>
              <div className="flex items-center gap-4 text-muted-foreground text-xs">
                <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5" /> {post._count.reactions}</span>
                <span className="flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" /> {post._count.comments}</span>
              </div>
            </div>
          )) : (
            <div className="col-span-3 text-center py-8 text-muted-foreground">
              Nenhum post ainda. Seja a primeira a compartilhar!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
