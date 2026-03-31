import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })

  const clubs = await prisma.club.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      _count: { select: { courses: true, members: true } },
    },
  })
  return NextResponse.json(clubs)
}

export async function POST(request: Request) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })

  const data = await request.json()
  const club = await prisma.club.create({
    data: {
      slug: data.slug,
      name: data.name,
      description: data.description,
      imageUrl: data.imageUrl || null,
      minPlan: data.minPlan ?? 'monthly',
      isActive: data.isActive ?? true,
      sortOrder: data.sortOrder ?? 0,
    },
  })
  return NextResponse.json(club, { status: 201 })
}
