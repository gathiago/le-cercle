import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const token = request.nextUrl.searchParams.get('token')

  if (!token) {
    return NextResponse.json(
      { error: 'Token de download não fornecido' },
      { status: 400 }
    )
  }

  const product = await prisma.digitalProduct.findUnique({
    where: { slug },
  })

  if (!product) {
    return NextResponse.json(
      { error: 'Produto não encontrado' },
      { status: 404 }
    )
  }

  const purchase = await prisma.productPurchase.findUnique({
    where: { downloadToken: token },
  })

  if (!purchase) {
    return NextResponse.json(
      { error: 'Token de download inválido' },
      { status: 404 }
    )
  }

  if (purchase.status !== 'PAID') {
    return NextResponse.json(
      { error: 'Pagamento não confirmado' },
      { status: 403 }
    )
  }

  if (purchase.digitalProductId !== product.id) {
    return NextResponse.json(
      { error: 'Token não corresponde ao produto' },
      { status: 403 }
    )
  }

  // Increment download count
  await prisma.productPurchase.update({
    where: { id: purchase.id },
    data: { downloadCount: { increment: 1 } },
  })

  if (!product.fileUrl) {
    return NextResponse.json(
      { error: 'Arquivo não disponível' },
      { status: 404 }
    )
  }

  redirect(product.fileUrl)
}
