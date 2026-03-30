import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { code, planId } = await request.json()

    if (!code) {
      return NextResponse.json({ valid: false, error: 'Código obrigatório' }, { status: 400 })
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    })

    if (!coupon || !coupon.isActive) {
      return NextResponse.json({ valid: false, error: 'Cupom inválido' })
    }

    // Check validity dates
    const now = new Date()
    if (coupon.validFrom && now < coupon.validFrom) {
      return NextResponse.json({ valid: false, error: 'Cupom ainda não disponível' })
    }
    if (coupon.validUntil && now > coupon.validUntil) {
      return NextResponse.json({ valid: false, error: 'Cupom expirado' })
    }

    // Check usage limit
    if (coupon.maxUses && coupon.currentUses >= coupon.maxUses) {
      return NextResponse.json({ valid: false, error: 'Cupom esgotado' })
    }

    // Check plan compatibility
    if (coupon.minPlanInterval && planId) {
      const planHierarchy = ['monthly', 'quarterly', 'yearly', 'premium']
      const minIndex = planHierarchy.indexOf(coupon.minPlanInterval)
      const planIndex = planHierarchy.indexOf(planId)
      if (planIndex < minIndex) {
        return NextResponse.json({ valid: false, error: 'Cupom não disponível para este plano' })
      }
    }

    return NextResponse.json({
      valid: true,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      code: coupon.code,
    })
  } catch (error) {
    console.error('Coupon validation error:', error)
    return NextResponse.json({ valid: false, error: 'Erro interno' }, { status: 500 })
  }
}
