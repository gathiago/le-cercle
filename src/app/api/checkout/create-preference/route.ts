import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { preferenceClient } from '@/lib/mercadopago'
import { getPlanById, type PlanId } from '@/lib/plans'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

const planNames: Record<string, string> = {
  monthly: 'Mensal',
  quarterly: 'Trimestral',
  yearly: 'Anual',
  premium: 'Premium',
}

export async function POST(request: Request) {
  try {
    const { pendingUserId } = await request.json()

    if (!pendingUserId) {
      return NextResponse.json({ error: 'pendingUserId obrigatório' }, { status: 400 })
    }

    const pendingUser = await prisma.pendingUser.findUnique({
      where: { id: pendingUserId },
    })

    if (!pendingUser) {
      return NextResponse.json({ error: 'Cadastro não encontrado' }, { status: 404 })
    }

    if (pendingUser.status !== 'AWAITING_PAYMENT') {
      return NextResponse.json({ error: 'Pagamento já processado' }, { status: 400 })
    }

    const preference = await preferenceClient.create({
      body: {
        items: [
          {
            id: pendingUser.plan,
            title: `Le Cercle - Plano ${planNames[pendingUser.plan] || pendingUser.plan}`,
            quantity: 1,
            unit_price: pendingUser.finalPrice,
            currency_id: 'BRL',
          },
        ],
        payer: {
          name: pendingUser.name,
          email: pendingUser.email,
          phone: {
            number: pendingUser.phone || '',
          },
        },
        back_urls: {
          success: `${APP_URL}/checkout/sucesso`,
          failure: `${APP_URL}/checkout/erro`,
          pending: `${APP_URL}/checkout/pendente`,
        },
        auto_return: 'approved',
        external_reference: pendingUser.id,
        notification_url: `${APP_URL}/api/webhooks/mercadopago`,
      },
    })

    // Save preference ID
    await prisma.pendingUser.update({
      where: { id: pendingUser.id },
      data: { mpPreferenceId: preference.id },
    })

    return NextResponse.json({
      init_point: preference.init_point,
      id: preference.id,
    })
  } catch (error) {
    console.error('Create preference error:', error)
    return NextResponse.json({ error: 'Erro ao criar pagamento' }, { status: 500 })
  }
}
