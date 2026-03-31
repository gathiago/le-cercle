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
  const club = await prisma.club.update({
    where: { id },
    data: {
      slug: data.slug,
      name: data.name,
      description: data.description,
      imageUrl: data.imageUrl || null,
      minPlan: data.minPlan,
      isActive: data.isActive,
      sortOrder: data.sortOrder,
    },
  })
  return NextResponse.json(club)
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })

  const { id } = await params
  await prisma.club.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
