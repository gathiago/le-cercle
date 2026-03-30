import { prisma } from '@/lib/prisma'
import { AdminCommunityFeed } from '@/components/admin/community-feed'

export default async function AdminComunidadePage() {
  const posts = await prisma.post.findMany({
    take: 50,
    orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
    include: {
      author: { select: { name: true, level: true } },
      _count: { select: { reactions: true, comments: true } },
    },
  })

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--color-azul-escuro)] mb-6">Comunidade</h1>
      <AdminCommunityFeed initialPosts={JSON.parse(JSON.stringify(posts))} />
    </div>
  )
}
