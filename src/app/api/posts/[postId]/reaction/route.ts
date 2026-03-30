import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  const { postId } = await params

  const existing = await prisma.reaction.findUnique({
    where: {
      userId_postId: {
        userId: session.user.id,
        postId,
      },
    },
  })

  if (existing) {
    await prisma.reaction.delete({ where: { id: existing.id } })
    return NextResponse.json({ liked: false })
  }

  await prisma.reaction.create({
    data: {
      userId: session.user.id,
      postId,
    },
  })

  return NextResponse.json({ liked: true })
}
