'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Mic, Square, Send, Loader2, Image as ImageIcon } from 'lucide-react'

export function CreatePost({ userLevel }: { userLevel: string }) {
  const router = useRouter()
  const [content, setContent] = useState('')
  const [postType, setPostType] = useState('PRATICA')
  const [loading, setLoading] = useState(false)
  const [recording, setRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const mediaRecorder = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/mp4'

      mediaRecorder.current = new MediaRecorder(stream, { mimeType })
      chunksRef.current = []

      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      mediaRecorder.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType })
        setAudioBlob(blob)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.current.start()
      setRecording(true)

      // Auto-stop after 2 minutes
      setTimeout(() => {
        if (mediaRecorder.current?.state === 'recording') {
          mediaRecorder.current.stop()
          setRecording(false)
        }
      }, 120000)
    } catch (err) {
      console.error('Microphone access denied:', err)
    }
  }

  function stopRecording() {
    if (mediaRecorder.current?.state === 'recording') {
      mediaRecorder.current.stop()
      setRecording(false)
    }
  }

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  async function handleSubmit() {
    if (!content.trim() && !audioBlob && !imageFile) return
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('content', content)
      formData.append('type', postType)
      formData.append('level', userLevel)
      if (audioBlob) formData.append('audio', audioBlob, 'recording.webm')
      if (imageFile) formData.append('image', imageFile)

      await fetch('/api/posts', {
        method: 'POST',
        body: formData,
      })

      setContent('')
      setAudioBlob(null)
      setImageFile(null)
      setImagePreview(null)
      router.refresh()
    } catch (error) {
      console.error('Post error:', error)
    }
    setLoading(false)
  }

  return (
    <div className="bg-[var(--color-surface-lowest)] rounded-2xl p-5 shadow-[0_4px_24px_rgba(48,51,66,0.06)] mb-6">
      <div className="flex gap-2 mb-3">
        {[
          { value: 'PRATICA', label: 'Prática' },
          { value: 'DUVIDA', label: 'Dúvida' },
          { value: 'DISCUSSAO', label: 'Discussão' },
          { value: 'DESAFIO', label: 'Desafio' },
        ].map(t => (
          <button
            key={t.value}
            type="button"
            onClick={() => setPostType(t.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              postType === t.value
                ? 'bg-[var(--color-laranja)] text-white'
                : 'bg-[var(--color-surface-low)] text-muted-foreground hover:text-[var(--color-azul-escuro)]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Compartilhe algo com a comunidade..."
        className="bg-[var(--color-surface-low)] border-none rounded-xl min-h-[80px] resize-none focus-visible:ring-[var(--color-rosa)] mb-3"
      />

      {imagePreview && (
        <div className="relative rounded-xl overflow-hidden mb-3">
          <img src={imagePreview} alt="Preview" className="w-full max-h-48 object-cover rounded-xl" />
          <button
            onClick={() => { setImageFile(null); setImagePreview(null) }}
            className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 text-xs hover:bg-black/70"
          >
            &#x2715;
          </button>
        </div>
      )}

      {audioBlob && (
        <div className="bg-[var(--color-rosa-light)] rounded-xl p-3 mb-3 flex items-center gap-3">
          <audio controls className="flex-1 h-8">
            <source src={URL.createObjectURL(audioBlob)} />
          </audio>
          <button
            onClick={() => setAudioBlob(null)}
            className="text-xs text-muted-foreground hover:text-red-500"
          >
            Remover
          </button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {!recording ? (
            <button
              onClick={startRecording}
              className="p-2 rounded-xl hover:bg-[var(--color-rosa-light)] transition-colors text-[var(--color-rosa)]"
              title="Gravar áudio"
            >
              <Mic className="h-5 w-5" />
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="p-2 rounded-xl bg-red-50 text-red-500 animate-pulse"
              title="Parar gravação"
            >
              <Square className="h-5 w-5" />
            </button>
          )}
          <label className="p-2 rounded-xl hover:bg-[var(--color-laranja-light)] transition-colors text-[var(--color-laranja)] cursor-pointer">
            <ImageIcon className="h-5 w-5" />
            <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
          </label>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={loading || (!content.trim() && !audioBlob && !imageFile)}
          className="bg-[var(--color-laranja)] hover:bg-[var(--color-laranja-hover)] text-white rounded-xl px-6"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="h-4 w-4 mr-2" /> Publicar</>}
        </Button>
      </div>
    </div>
  )
}
