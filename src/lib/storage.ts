import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export async function uploadAudio(file: Buffer, fileName: string): Promise<string> {
  const { data, error } = await supabaseAdmin.storage
    .from('audios')
    .upload(fileName, file, {
      contentType: 'audio/webm',
      upsert: false,
    })

  if (error) throw error

  const { data: urlData } = supabaseAdmin.storage
    .from('audios')
    .getPublicUrl(data.path)

  return urlData.publicUrl
}

export async function uploadImage(file: Buffer, fileName: string): Promise<string> {
  const { data, error } = await supabaseAdmin.storage
    .from('images')
    .upload(fileName, file, {
      contentType: 'image/webp',
      upsert: false,
    })

  if (error) throw error

  const { data: urlData } = supabaseAdmin.storage
    .from('images')
    .getPublicUrl(data.path)

  return urlData.publicUrl
}
