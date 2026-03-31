import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })

  const { id } = await params
  const data = await request.json()
  const course = await prisma.course.update({
    where: { id },
    data: {
      slug: data.slug,
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrl || null,
      level: data.level,
      clubId: data.clubId || null,
      isPublished: data.isPublished,
      sortOrder: data.sortOrder,
    },
  })
  return NextResponse.json(course)
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })

  const { id } = await params
  await prisma.course.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
