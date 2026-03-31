import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string; lessonId: string }> }
) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })

  const { lessonId } = await params
  const data = await request.json()
  const lesson = await prisma.lesson.update({
    where: { id: lessonId },
    data: {
      slug: data.slug,
      title: data.title,
      description: data.description || null,
      videoUrl: data.videoUrl || null,
      materialUrl: data.materialUrl || null,
      materialName: data.materialName || null,
      content: data.content || null,
      duration: data.duration || null,
      sortOrder: data.sortOrder,
      isPublished: data.isPublished,
    },
  })
  return NextResponse.json(lesson)
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; lessonId: string }> }
) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })

  const { lessonId } = await params
  await prisma.lesson.delete({ where: { id: lessonId } })
  return NextResponse.json({ success: true })
}
