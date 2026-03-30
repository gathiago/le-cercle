import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })

  const data = await request.json()
  const meeting = await prisma.meeting.create({
    data: {
      title: data.title,
      level: data.level,
      scheduledAt: new Date(data.scheduledAt),
      duration: data.duration,
      meetingUrl: data.meetingUrl,
      maxParticipants: data.maxParticipants,
      description: data.description || null,
      isPremiumOnly: data.isPremiumOnly,
      city: data.city || null,
      address: data.address || null,
    },
  })
  return NextResponse.json(meeting, { status: 201 })
}
