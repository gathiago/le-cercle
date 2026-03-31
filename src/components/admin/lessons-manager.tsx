'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Pencil, Trash2, Loader2, PlayCircle, Clock, Upload, FileText } from 'lucide-react'

interface Lesson {
  id: string
  title: string
  slug: string
  description: string | null
  videoUrl: string | null
  materialUrl: string | null
  materialName: string | null
  content: string | null
  duration: number | null
  sortOrder: number
  isPublished: boolean
  createdAt: string
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function AdminLessonsManager({
  courseId,
  initialLessons,
}: {
  courseId: string
  initialLessons: Lesson[]
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    videoUrl: '',
    materialUrl: '',
    materialName: '',
    content: '',
    duration: '',
    sortOrder: '',
    isPublished: false,
  })

  function resetForm() {
    setForm({
      title: '',
      slug: '',
      description: '',
      videoUrl: '',
      materialUrl: '',
      materialName: '',
      content: '',
      duration: '',
      sortOrder: String(initialLessons.length + 1),
      isPublished: false,
    })
    setEditingId(null)
  }

  function editLesson(lesson: Lesson) {
    setForm({
      title: lesson.title,
      slug: lesson.slug,
      description: lesson.description || '',
      videoUrl: lesson.videoUrl || '',
      materialUrl: lesson.materialUrl || '',
      materialName: lesson.materialName || '',
      content: lesson.content || '',
      duration: lesson.duration != null ? String(lesson.duration) : '',
      sortOrder: String(lesson.sortOrder),
      isPublished: lesson.isPublished,
    })
    setEditingId(lesson.id)
    setOpen(true)
  }

  function handleTitleChange(value: string) {
    setForm((f) => ({
      ...f,
      title: value,
      slug: editingId ? f.slug : slugify(value),
    }))
  }

  async function handleSave() {
    setLoading(true)
    const method = editingId ? 'PUT' : 'POST'
    const url = editingId
      ? `/api/admin/courses/${courseId}/lessons/${editingId}`
      : `/api/admin/courses/${courseId}/lessons`
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        duration: form.duration ? Number(form.duration) : null,
        sortOrder: form.sortOrder ? Number(form.sortOrder) : 0,
        videoUrl: form.videoUrl || null,
        materialUrl: form.materialUrl || null,
        materialName: form.materialName || null,
        content: form.content || null,
        description: form.description || null,
      }),
    })
    setLoading(false)
    setOpen(false)
    resetForm()
    router.refresh()
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir esta aula?')) return
    await fetch(`/api/admin/courses/${courseId}/lessons/${id}`, { method: 'DELETE' })
    router.refresh()
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm() }}>
          <DialogTrigger className="inline-flex items-center justify-center gap-2 bg-[var(--color-laranja)] hover:bg-[var(--color-laranja-hover)] text-white rounded-xl px-4 py-2 text-sm font-medium">
            <Plus className="h-4 w-4" /> Nova Aula
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Editar Aula' : 'Nova Aula'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Titulo</Label>
                <Input
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Ex: Introducao ao Passe Compose"
                  className="bg-[var(--color-surface-low)] border-none rounded-xl"
                />
              </div>
              <div>
                <Label>Slug</Label>
                <Input
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  className="bg-[var(--color-surface-low)] border-none rounded-xl"
                />
              </div>
              <div>
                <Label>Descricao</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="bg-[var(--color-surface-low)] border-none rounded-xl"
                />
              </div>
              <div>
                <Label>URL do Video (YouTube/Vimeo)</Label>
                <Input
                  value={form.videoUrl}
                  onChange={(e) => setForm((f) => ({ ...f, videoUrl: e.target.value }))}
                  placeholder="https://www.youtube.com/embed/..."
                  className="bg-[var(--color-surface-low)] border-none rounded-xl"
                />
              </div>
              <div>
                <Label>Material da aula (PDF)</Label>
                <div className="flex gap-2">
                  <Input
                    value={form.materialUrl}
                    onChange={(e) => setForm((f) => ({ ...f, materialUrl: e.target.value }))}
                    placeholder="URL ou faça upload..."
                    className="bg-[var(--color-surface-low)] border-none rounded-xl flex-1"
                  />
                  <label className="inline-flex items-center justify-center gap-1.5 bg-[var(--color-rosa)] hover:bg-[var(--color-rosa-hover)] text-white rounded-xl px-3 py-2 text-xs font-medium cursor-pointer transition-colors shrink-0">
                    {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                    Upload
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        setUploading(true)
                        const fd = new FormData()
                        fd.append('file', file)
                        const res = await fetch('/api/admin/products/upload', { method: 'POST', body: fd })
                        if (res.ok) {
                          const data = await res.json()
                          setForm(f => ({ ...f, materialUrl: data.fileUrl, materialName: data.fileName }))
                        }
                        setUploading(false)
                      }}
                    />
                  </label>
                </div>
                {form.materialUrl && <p className="text-xs text-green-600 mt-1 flex items-center gap-1"><FileText className="h-3 w-3" /> {form.materialName || form.materialUrl}</p>}
              </div>
              <div>
                <Label>Conteúdo da Aula (notas)</Label>
                <Textarea
                  value={form.content}
                  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                  rows={6}
                  placeholder="Conteúdo em texto da aula, notas, exercícios..."
                  className="bg-[var(--color-surface-low)] border-none rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Duracao (minutos)</Label>
                  <Input
                    type="number"
                    value={form.duration}
                    onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
                    className="bg-[var(--color-surface-low)] border-none rounded-xl"
                  />
                </div>
                <div>
                  <Label>Ordem</Label>
                  <Input
                    type="number"
                    value={form.sortOrder}
                    onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value }))}
                    className="bg-[var(--color-surface-low)] border-none rounded-xl"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label>Publicada</Label>
                <Switch
                  checked={form.isPublished}
                  onCheckedChange={(v) => setForm((f) => ({ ...f, isPublished: v }))}
                />
              </div>
              <Button
                onClick={handleSave}
                disabled={loading}
                className="w-full bg-[var(--color-laranja)] hover:bg-[var(--color-laranja-hover)] text-white rounded-xl"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : editingId ? 'Salvar Alteracoes' : 'Criar Aula'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {initialLessons.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          Nenhuma aula criada ainda.
        </div>
      ) : (
        <div className="space-y-3">
          {initialLessons.map((lesson) => (
            <div
              key={lesson.id}
              className="bg-white rounded-2xl p-5 shadow-[0_4px_24px_rgba(48,51,66,0.06)] flex items-center justify-between"
            >
              <div className="flex items-center gap-4 flex-1">
                <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-[var(--color-surface-low)] text-sm font-bold text-[var(--color-azul-escuro)]">
                  {lesson.sortOrder}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-[var(--color-azul-escuro)]">{lesson.title}</h3>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        lesson.isPublished
                          ? 'bg-green-50 text-green-600'
                          : 'bg-amber-50 text-amber-600'
                      }`}
                    >
                      {lesson.isPublished ? 'Publicada' : 'Rascunho'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                    {lesson.duration && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {lesson.duration} min
                      </span>
                    )}
                    {lesson.videoUrl && (
                      <span className="flex items-center gap-1">
                        <PlayCircle className="h-3 w-3" /> Video
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => editLesson(lesson)}
                  className="p-2 rounded-xl hover:bg-[var(--color-surface-low)] text-muted-foreground"
                  title="Editar"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(lesson.id)}
                  className="p-2 rounded-xl hover:bg-red-50 text-muted-foreground hover:text-red-500"
                  title="Excluir"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
