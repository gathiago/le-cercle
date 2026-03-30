import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { getPlanById, type PlanId } from '@/lib/plans'

export async function POST(request: Request) {
  try {
    const { name, email, password, phone, plan, couponCode, acceptedTerms } = await request.json()

    if (!name || !email || !password || !plan || !acceptedTerms) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 })
    }

    // Check if email already exists in User
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: 'Este e-mail já possui uma conta. Faça login.' }, { status: 409 })
    }

    const planData = getPlanById(plan as PlanId)
    if (!planData) {
      return NextResponse.json({ error: 'Plano inválido' }, { status: 400 })
    }

    let originalPrice = planData.price
    let finalPrice = planData.price

    // Validate and apply coupon
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: couponCode.toUpperCase() } })
      if (coupon && coupon.isActive) {
        const now = new Date()
        const notExpired = !coupon.validUntil || coupon.validUntil > now
        const hasUses = !coupon.maxUses || coupon.currentUses < coupon.maxUses

        if (notExpired && hasUses) {
          if (coupon.discountType === 'PERCENTAGE') {
            finalPrice = originalPrice * (1 - coupon.discountValue / 100)
          } else {
            finalPrice = Math.max(0, originalPrice - coupon.discountValue)
          }
          finalPrice = Math.round(finalPrice * 100) / 100
        }
      }
    }

    const passwordHash = await bcrypt.hash(password, 10)

    // Delete any existing pending user with same email
    await prisma.pendingUser.deleteMany({ where: { email } })

    const pendingUser = await prisma.pendingUser.create({
      data: {
        name,
        email,
        phone: phone || null,
        passwordHash,
        plan,
        couponCode: couponCode ? couponCode.toUpperCase() : null,
        originalPrice,
        finalPrice,
        acceptedTerms: true,
        acceptedTermsAt: new Date(),
      },
    })

    return NextResponse.json({ id: pendingUser.id }, { status: 201 })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
