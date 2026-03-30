import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') return NextResponse.json({ error: 'Nao autorizado' }, { status: 403 })

  const { id } = await params
  const data = await request.json()
  const meeting = await prisma.meeting.update({
    where: { id },
    data: {
      title: data.title, level: data.level,
      scheduledAt: new Date(data.scheduledAt), duration: data.duration,
      meetingUrl: data.meetingUrl, maxParticipants: data.maxParticipants,
      description: data.description || null, isPremiumOnly: data.isPremiumOnly,
      city: data.city || null, address: data.address || null,
    },
  })
  return NextResponse.json(meeting)
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') return NextResponse.json({ error: 'Nao autorizado' }, { status: 403 })
  const { id } = await params
  await prisma.meeting.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
