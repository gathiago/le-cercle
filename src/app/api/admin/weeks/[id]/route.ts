import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
  }

  const { id } = await params
  const data = await request.json()

  if (data.isActive) {
    await prisma.weekContent.updateMany({ where: { id: { not: id } }, data: { isActive: false } })
  }

  const week = await prisma.weekContent.update({
    where: { id },
    data: {
      weekNumber: data.weekNumber,
      title: data.title,
      description: data.description,
      level: data.level,
      musicUrl: data.musicUrl,
      videoUrl: data.videoUrl,
      vocabulary: data.vocabulary,
      prompts: data.prompts,
      exercise: data.exercise || null,
      challengeText: data.challengeText,
      isActive: data.isActive,
      publishedAt: data.isActive ? new Date() : null,
    },
  })

  return NextResponse.json(week)
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
  }

  const { id } = await params
  await prisma.weekContent.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
