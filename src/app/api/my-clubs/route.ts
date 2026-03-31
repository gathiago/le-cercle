import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  const clubs = await prisma.clubMember.findMany({
    where: { userId: session.user.id },
    include: { club: true },
  })

  return NextResponse.json({ clubs })
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  const { clubs } = await request.json() as { clubs: string[] }

  if (!clubs || !Array.isArray(clubs)) {
    return NextResponse.json({ error: 'Clubes inválidos' }, { status: 400 })
  }

  // Get plan limit
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { subscriptionPlan: true },
  })

  const planLimits: Record<string, number> = {
    monthly: 1,
    quarterly: 3,
    yearly: 6,
    premium: 6,
  }

  const limit = planLimits[user?.subscriptionPlan || 'monthly'] || 1

  if (clubs.length > limit) {
    return NextResponse.json({ error: `Seu plano permite no máximo ${limit} clubes` }, { status: 400 })
  }

  // Find club IDs by slug
  const clubRecords = await prisma.club.findMany({
    where: { slug: { in: clubs } },
    select: { id: true, slug: true },
  })

  // Delete existing memberships
  await prisma.clubMember.deleteMany({
    where: { userId: session.user.id },
  })

  // Create new memberships
  for (const club of clubRecords) {
    await prisma.clubMember.create({
      data: {
        userId: session.user.id,
        clubId: club.id,
      },
    })
  }

  return NextResponse.json({ success: true, count: clubRecords.length })
}
