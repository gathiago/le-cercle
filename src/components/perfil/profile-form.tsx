'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Camera } from 'lucide-react'

export function ProfileForm({ user }: { user: { id: string; name: string; avatarUrl?: string | null } }) {
  const router = useRouter()
  const [name, setName] = useState(user.name)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user.avatarUrl || null)

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setAvatarPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  async function handleSave() {
    setLoading(true)

    // Upload avatar first if changed
    let avatarUrl: string | undefined
    if (avatarFile) {
      const formData = new FormData()
      formData.append('file', avatarFile)
      formData.append('type', 'image')
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
      if (uploadRes.ok) {
        const { url } = await uploadRes.json()
        avatarUrl = url
      }
    }

    await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, ...(avatarUrl ? { avatarUrl } : {}) }),
    })
    setLoading(false)
    setSaved(true)
    setAvatarFile(null)
    setTimeout(() => setSaved(false), 2000)
    router.refresh()
  }

  return (
    <div className="space-y-4">
      {/* Avatar Upload */}
      <div className="flex items-center gap-4 mb-4">
        <label className="relative cursor-pointer group">
          <div className="w-16 h-16 rounded-full bg-[var(--color-rosa)] flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              user.name.charAt(0).toUpperCase()
            )}
          </div>
          <div className="absolute inset-0 rounded-full bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="h-5 w-5 text-white" />
          </div>
          <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
        </label>
        <div>
          <p className="text-sm font-medium text-[var(--color-azul-escuro)]">Foto de perfil</p>
          <p className="text-xs text-muted-foreground">Clique para alterar</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Nome</Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-[var(--color-surface-low)] border-none h-11 rounded-xl"
        />
      </div>
      <Button
        onClick={handleSave}
        disabled={loading || (name === user.name && !avatarFile)}
        className="bg-[var(--color-laranja)] hover:bg-[var(--color-laranja-hover)] text-white rounded-xl px-6"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? 'Salvo!' : 'Salvar alterações'}
      </Button>
    </div>
  )
}
