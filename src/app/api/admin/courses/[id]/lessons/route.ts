import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })

  const { id } = await params
  const lessons = await prisma.lesson.findMany({
    where: { courseId: id },
    orderBy: { sortOrder: 'asc' },
  })
  return NextResponse.json(lessons)
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })

  const { id } = await params
  const data = await request.json()
  const lesson = await prisma.lesson.create({
    data: {
      slug: data.slug,
      title: data.title,
      description: data.description || null,
      videoUrl: data.videoUrl || null,
      materialUrl: data.materialUrl || null,
      materialName: data.materialName || null,
      content: data.content || null,
      duration: data.duration || null,
      sortOrder: data.sortOrder ?? 0,
      isPublished: data.isPublished ?? false,
      courseId: id,
    },
  })
  return NextResponse.json(lesson, { status: 201 })
}
