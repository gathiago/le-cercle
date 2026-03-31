import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })

  const subscribers = await prisma.newsletterSubscriber.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(subscribers)
}

export async function DELETE(request: Request) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })

  try {
    const { id } = await request.json()

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 })
    }

    await prisma.newsletterSubscriber.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Admin Newsletter] Erro ao deletar:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
