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
  const event = await prisma.premiumEvent.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      city: data.city,
      date: new Date(data.date),
      maxSpots: data.maxSpots,
      imageUrl: data.imageUrl || null,
    },
  })
  return NextResponse.json(event)
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
  await prisma.premiumEvent.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
