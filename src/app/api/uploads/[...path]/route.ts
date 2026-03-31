import { NextResponse } from 'next/server'
import { readFile, stat } from 'fs/promises'
import { join } from 'path'

const mimeTypes: Record<string, string> = {
  '.webm': 'audio/webm',
  '.mp4': 'audio/mp4',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg',
  '.wav': 'audio/wav',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.pdf': 'application/pdf',
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  const filePath = join(process.cwd(), 'public', 'uploads', ...path)

  try {
    const fileStats = await stat(filePath)
    const file = await readFile(filePath)
    const ext = '.' + (path[path.length - 1]?.split('.').pop() || '')
    const contentType = mimeTypes[ext] || 'application/octet-stream'
    const isAudio = contentType.startsWith('audio/')

    // Support Range requests for audio/video (required for seek in Safari/Chrome)
    const range = request.headers.get('range')

    if (range && isAudio) {
      const parts = range.replace(/bytes=/, '').split('-')
      const start = parseInt(parts[0], 10)
      const end = parts[1] ? parseInt(parts[1], 10) : fileStats.size - 1
      const chunkSize = end - start + 1

      return new NextResponse(file.subarray(start, end + 1), {
        status: 206,
        headers: {
          'Content-Type': contentType,
          'Content-Range': `bytes ${start}-${end}/${fileStats.size}`,
          'Content-Length': String(chunkSize),
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      })
    }

    return new NextResponse(file, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': String(fileStats.size),
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Arquivo n\u00e3o encontrado' }, { status: 404 })
  }
}
