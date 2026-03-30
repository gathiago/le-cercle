import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
  }

  const { id } = await params
  const data = await request.json()

  const coupon = await prisma.coupon.update({
    where: { id },
    data: {
      code: data.code?.toUpperCase(),
      discountType: data.discountType,
      discountValue: data.discountValue,
      maxUses: data.maxUses || null,
      minPlanInterval: data.minPlanInterval || null,
      validUntil: data.validUntil ? new Date(data.validUntil) : null,
      isActive: data.isActive,
    },
  })

  return NextResponse.json(coupon)
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
  }

  const { id } = await params

  await prisma.coupon.update({
    where: { id },
    data: { isActive: false },
  })

  return NextResponse.json({ success: true })
}
