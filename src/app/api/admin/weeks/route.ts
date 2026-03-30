import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
  }

  const data = await request.json()

  // If activating this week, deactivate others
  if (data.isActive) {
    await prisma.weekContent.updateMany({ data: { isActive: false } })
  }

  const week = await prisma.weekContent.create({
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

  return NextResponse.json(week, { status: 201 })
}
