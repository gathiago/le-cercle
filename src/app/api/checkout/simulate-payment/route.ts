import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { getPlanById, type PlanId } from '@/lib/plans'

export async function POST(request: Request) {
  try {
    const { name, email, password, phone, plan, couponCode, clubs } = await request.json()

    if (!name || !email || !password || !plan) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 })
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: 'Este e-mail já possui uma conta. Faça login.' }, { status: 409 })
    }

    const planData = getPlanById(plan as PlanId)
    if (!planData) {
      return NextResponse.json({ error: 'Plano inválido' }, { status: 400 })
    }

    let finalPrice = planData.price

    // Apply coupon if valid
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: couponCode.toUpperCase() } })
      if (coupon && coupon.isActive) {
        const now = new Date()
        const notExpired = !coupon.validUntil || coupon.validUntil > now
        const hasUses = !coupon.maxUses || coupon.currentUses < coupon.maxUses

        if (notExpired && hasUses) {
          if (coupon.discountType === 'PERCENTAGE') {
            finalPrice = planData.price * (1 - coupon.discountValue / 100)
          } else {
            finalPrice = Math.max(0, planData.price - coupon.discountValue)
          }
          finalPrice = Math.round(finalPrice * 100) / 100

          // Increment coupon usage
          await prisma.coupon.update({
            where: { id: coupon.id },
            data: { currentUses: { increment: 1 } },
          })
        }
      }
    }

    const passwordHash = await bcrypt.hash(password, 10)

    // Calculate subscription end
    const subscriptionEnd = new Date()
    switch (plan) {
      case 'monthly':
        subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1)
        break
      case 'quarterly':
        subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 3)
        break
      case 'yearly':
      case 'premium':
        subscriptionEnd.setFullYear(subscriptionEnd.getFullYear() + 1)
        break
    }

    // Create user directly (simulated payment)
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        phone: phone || null,
        subscriptionStatus: 'ACTIVE',
        subscriptionPlan: plan,
        subscriptionEnd,
        couponUsed: couponCode ? couponCode.toUpperCase() : null,
        amountPaid: finalPrice,
        acceptedTerms: true,
        acceptedTermsAt: new Date(),
      },
    })

    // Assign selected clubs
    if (clubs) {
      const clubSlugs = typeof clubs === 'string' ? clubs.split(',').filter(Boolean) : []
      if (clubSlugs.length > 0) {
        const clubRecords = await prisma.club.findMany({
          where: { slug: { in: clubSlugs } },
          select: { id: true },
        })
        await prisma.clubMember.createMany({
          data: clubRecords.map(c => ({ userId: user.id, clubId: c.id })),
          skipDuplicates: true,
        })
      }
    }

    return NextResponse.json({ success: true, userId: user.id }, { status: 201 })
  } catch (error) {
    console.error('Simulate payment error:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
