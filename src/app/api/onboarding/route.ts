import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const { answers, blockReason, openAnswer, level } = await request.json()

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        level: level,
        blockReason: blockReason || null,
        onboardingAnswer: openAnswer || null,
        onboardingDone: true,
      },
    })

    return NextResponse.json({ success: true, level })
  } catch (error) {
    console.error('Onboarding error:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
