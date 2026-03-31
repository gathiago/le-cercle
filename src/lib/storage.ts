import { writeFile, mkdir } from 'fs/promises'
import { join, dirname } from 'path'

async function saveLocal(file: Buffer, folder: string, fileName: string): Promise<string> {
  const safeName = fileName.replace(/[^a-zA-Z0-9._\-\/]/g, '_')
  const filePath = join(process.cwd(), 'public', 'uploads', folder, safeName)

  // Create nested directories if fileName contains /
  await mkdir(dirname(filePath), { recursive: true })
  await writeFile(filePath, file)

  return `/api/uploads/${folder}/${safeName}`
}

export async function uploadAudio(file: Buffer, fileName: string): Promise<string> {
  return saveLocal(file, 'audios', fileName)
}

export async function uploadImage(file: Buffer, fileName: string): Promise<string> {
  return saveLocal(file, 'images', fileName)
}
