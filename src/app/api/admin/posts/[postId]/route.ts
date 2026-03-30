import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
  }

  const { postId } = await params
  const { action } = await request.json()

  const post = await prisma.post.findUnique({ where: { id: postId } })
  if (!post) return NextResponse.json({ error: 'Post não encontrado' }, { status: 404 })

  switch (action) {
    case 'togglePin':
      await prisma.post.update({ where: { id: postId }, data: { isPinned: !post.isPinned } })
      break
    case 'toggleFeatured':
      await prisma.post.update({ where: { id: postId }, data: { isFeatured: !post.isFeatured } })
      break
    case 'toggleChallenge':
      await prisma.post.update({ where: { id: postId }, data: { isChallenge: !post.isChallenge } })
      break
  }

  return NextResponse.json({ success: true })
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
  }

  const { postId } = await params
  await prisma.post.delete({ where: { id: postId } })
  return NextResponse.json({ success: true })
}
