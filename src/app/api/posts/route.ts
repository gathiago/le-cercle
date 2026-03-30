import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const content = formData.get('content') as string
    const type = (formData.get('type') as string) || 'PRATICA'
    const level = formData.get('level') as string
    const audio = formData.get('audio') as File | null

    const image = formData.get('image') as File | null

    let audioUrl: string | null = null
    let imageUrl: string | null = null

    if (audio) {
      // Upload audio to Supabase Storage
      const { uploadAudio } = await import('@/lib/storage')
      const buffer = Buffer.from(await audio.arrayBuffer())
      const fileName = `${session.user.id}/${Date.now()}-${audio.name}`
      audioUrl = await uploadAudio(buffer, fileName)
    }

    if (image) {
      const { uploadImage } = await import('@/lib/storage')
      const buffer = Buffer.from(await image.arrayBuffer())
      const fileName = `${session.user.id}/${Date.now()}-${image.name}`
      imageUrl = await uploadImage(buffer, fileName)
    }

    const post = await prisma.post.create({
      data: {
        content: content || '',
        type: type as any,
        level: level as any,
        audioUrl,
        imageUrl,
        authorId: session.user.id,
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Create post error:', error)
    return NextResponse.json({ error: 'Erro ao criar post' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const level = searchParams.get('level')
  const type = searchParams.get('type')

  const posts = await prisma.post.findMany({
    take: 20,
    orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
    where: {
      ...(level ? { level: level as any } : {}),
      ...(type ? { type: type as any } : {}),
    },
    include: {
      author: { select: { id: true, name: true, avatarUrl: true, level: true } },
      _count: { select: { reactions: true, comments: true } },
    },
  })

  return NextResponse.json(posts)
}
