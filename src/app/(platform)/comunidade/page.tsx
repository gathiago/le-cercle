import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { CommunityFeed } from '@/components/community/community-feed'
import { CreatePost } from '@/components/community/create-post'

export default async function ComunidadePage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const posts = await prisma.post.findMany({
    take: 20,
    orderBy: { createdAt: 'desc' },
    include: {
      author: { select: { id: true, name: true, avatarUrl: true, level: true } },
      _count: { select: { reactions: true, comments: true } },
      reactions: {
        where: { userId: session.user.id },
        select: { id: true },
      },
    },
  })

  const formattedPosts = posts.map(post => ({
    ...post,
    hasLiked: post.reactions.length > 0,
    reactions: undefined,
  }))

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <span className="text-[10px] font-semibold tracking-widest uppercase text-[var(--color-rosa)]">
          Espace Social
        </span>
        <h1 className="text-2xl font-bold text-[var(--color-azul-escuro)]">
          La Communaute
        </h1>
      </div>

      {/* Create Post */}
      <CreatePost userLevel={session.user.level} />

      {/* Feed */}
      <CommunityFeed initialPosts={formattedPosts} userId={session.user.id} userLevel={session.user.level} />
    </div>
  )
}
