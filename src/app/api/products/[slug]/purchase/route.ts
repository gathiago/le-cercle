import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const data = await request.json()

  if (!data.email || !data.name) {
    return NextResponse.json(
      { error: 'Email e nome são obrigatórios' },
      { status: 400 }
    )
  }

  const product = await prisma.digitalProduct.findUnique({
    where: { slug },
  })

  if (!product || !product.isActive) {
    return NextResponse.json(
      { error: 'Produto não encontrado' },
      { status: 404 }
    )
  }

  const downloadToken = crypto.randomBytes(32).toString('hex')

  // Create the purchase with PENDING status
  const purchase = await prisma.productPurchase.create({
    data: {
      email: data.email,
      name: data.name,
      phone: data.phone || null,
      digitalProductId: product.id,
      amountPaid: product.price,
      status: 'PENDING',
      downloadToken,
    },
  })

  // Simulate payment: set status to PAID
  await prisma.productPurchase.update({
    where: { id: purchase.id },
    data: { status: 'PAID' },
  })

  // If a User exists with that email, create a UserProduct
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  })

  if (existingUser) {
    await prisma.userProduct.upsert({
      where: {
        userId_digitalProductId: {
          userId: existingUser.id,
          digitalProductId: product.id,
        },
      },
      update: {},
      create: {
        userId: existingUser.id,
        digitalProductId: product.id,
        amountPaid: product.price,
        paymentMethod: 'simulated',
      },
    })
  }

  const downloadUrl = `/api/products/${slug}/download?token=${downloadToken}`

  return NextResponse.json({
    success: true,
    downloadToken,
    downloadUrl,
  })
}
