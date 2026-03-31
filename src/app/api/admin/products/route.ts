import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })

  const products = await prisma.digitalProduct.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { purchases: true } } },
  })
  return NextResponse.json(products)
}

export async function POST(request: Request) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })

  const data = await request.json()
  const product = await prisma.digitalProduct.create({
    data: {
      slug: data.slug,
      title: data.title,
      description: data.description,
      price: data.price,
      imageUrl: data.imageUrl || null,
      fileUrl: data.fileUrl || null,
      fileName: data.fileName || null,
      isActive: data.isActive ?? true,
    },
  })
  return NextResponse.json(product, { status: 201 })
}
