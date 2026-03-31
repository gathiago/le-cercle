import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { uploadAudio, uploadImage } from '@/lib/storage'

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string || 'image'

    if (!file) {
      return NextResponse.json({ error: 'Arquivo obrigatorio' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const fileName = `${session.user.id}/${Date.now()}-${file.name}`

    let url: string

    if (type === 'audio') {
      url = await uploadAudio(buffer, fileName)
    } else {
      url = await uploadImage(buffer, fileName)
    }

    return NextResponse.json({ url })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Erro no upload' }, { status: 500 })
  }
}
