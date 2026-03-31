import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'E-mail obrigatório' }, { status: 400 })
    }

    const normalizedEmail = email.trim().toLowerCase()

    await prisma.newsletterSubscriber.upsert({
      where: { email: normalizedEmail },
      update: { name: name || undefined },
      create: {
        email: normalizedEmail,
        name: name || null,
        source: 'website',
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Newsletter] Erro ao inscrever:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
