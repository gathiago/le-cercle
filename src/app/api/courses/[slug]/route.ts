import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      lessons: {
        where: { isPublished: true },
        orderBy: { sortOrder: 'asc' },
        select: {
          id: true,
          title: true,
          videoUrl: true,
          materialUrl: true,
          materialName: true,
          content: true,
          duration: true,
          sortOrder: true,
        },
      },
    },
  })

  if (!course || !course.isPublished) {
    return NextResponse.json({ error: 'Curso não encontrado' }, { status: 404 })
  }

  return NextResponse.json(course)
}
