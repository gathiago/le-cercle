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
