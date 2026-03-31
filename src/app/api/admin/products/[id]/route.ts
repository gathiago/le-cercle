import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })

  const { id } = await params
  const data = await request.json()
  const product = await prisma.digitalProduct.update({
    where: { id },
    data: {
      slug: data.slug,
      title: data.title,
      description: data.description,
      price: data.price,
      imageUrl: data.imageUrl || null,
      fileUrl: data.fileUrl || null,
      fileName: data.fileName || null,
      isActive: data.isActive,
    },
  })
  return NextResponse.json(product)
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })

  const { id } = await params
  const product = await prisma.digitalProduct.update({
    where: { id },
    data: { isActive: false },
  })
  return NextResponse.json(product)
}
