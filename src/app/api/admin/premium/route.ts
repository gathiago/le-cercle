import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
  }

  const data = await request.json()
  const event = await prisma.premiumEvent.create({
    data: {
      title: data.title,
      description: data.description,
      city: data.city,
      date: new Date(data.date),
      maxSpots: data.maxSpots,
      spotsLeft: data.maxSpots,
      imageUrl: data.imageUrl || null,
    },
  })
  return NextResponse.json(event, { status: 201 })
}
