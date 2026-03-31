import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  const { lessonId, completed } = await request.json()

  if (!lessonId) {
    return NextResponse.json({ error: 'lessonId obrigatório' }, { status: 400 })
  }

  // Verify the lesson exists and the user is a member of the club
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      course: {
        include: {
          club: {
            include: {
              members: { where: { userId: session.user.id }, select: { id: true } },
            },
          },
        },
      },
    },
  })

  if (!lesson || !lesson.course?.club?.members?.length) {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
  }

  await prisma.userProgress.upsert({
    where: {
      userId_lessonId: { userId: session.user.id, lessonId },
    },
    update: {
      completed,
      completedAt: completed ? new Date() : null,
    },
    create: {
      userId: session.user.id,
      lessonId,
      completed,
      completedAt: completed ? new Date() : null,
    },
  })

  return NextResponse.json({ success: true })
}
