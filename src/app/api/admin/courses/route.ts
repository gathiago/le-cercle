import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })

  const courses = await prisma.course.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      club: { select: { id: true, name: true } },
      _count: { select: { lessons: true } },
    },
  })
  return NextResponse.json(courses)
}

export async function POST(request: Request) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })

  const data = await request.json()
  const course = await prisma.course.create({
    data: {
      slug: data.slug,
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrl || null,
      level: data.level ?? 'INICIANTE',
      clubId: data.clubId || null,
      isPublished: data.isPublished ?? false,
      sortOrder: data.sortOrder ?? 0,
    },
  })
  return NextResponse.json(course, { status: 201 })
}
