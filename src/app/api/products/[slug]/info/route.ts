import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const product = await prisma.digitalProduct.findUnique({
    where: { slug },
    select: { title: true, price: true, description: true, slug: true },
  })

  if (!product || !(await prisma.digitalProduct.findUnique({ where: { slug }, select: { isActive: true } }))?.isActive) {
    return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 })
  }

  return NextResponse.json(product)
}
