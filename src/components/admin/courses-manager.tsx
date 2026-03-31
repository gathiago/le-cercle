'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Pencil, Loader2, BookOpen, BarChart3 } from 'lucide-react'

interface Course {
  id: string
  title: string
  slug: string
  description: string
  level: string
  clubId: string | null
  clubName: string | null
  isPublished: boolean
  sortOrder: number
  lessonCount: number
  createdAt: string
}

interface ClubOption {
  id: string
  name: string
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const LEVELS = [
  { value: 'INICIANTE', label: 'Iniciante' },
  { value: 'INTERMEDIARIO', label: 'Intermediario' },
  { value: 'AVANCADO', label: 'Avancado' },
]

export function AdminCoursesManager({
  initialCourses,
  clubs,
}: {
  initialCourses: Course[]
  clubs: ClubOption[]
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    level: 'INICIANTE',
    clubId: '',
    isFree: false,
    isPublished: false,
  })

  function resetForm() {
    setForm({ title: '', slug: '', description: '', level: 'INICIANTE', clubId: '', isFree: false, isPublished: false })
    setEditingId(null)
  }

  function editCourse(course: Course) {
    setForm({
      title: course.title,
      slug: course.slug,
      description: course.description,
      level: course.level,
      clubId: course.clubId || '',
      isFree: (course as any).isFree || false,
      isPublished: course.isPublished,
    })
    setEditingId(course.id)
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
    const url = editingId ? `/api/admin/courses/${editingId}` : '/api/admin/courses'
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        clubId: form.clubId || null,
      }),
    })
    setLoading(false)
    setOpen(false)
    resetForm()
    router.refresh()
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm() }}>
          <DialogTrigger className="inline-flex items-center justify-center gap-2 bg-[var(--color-laranja)] hover:bg-[var(--color-laranja-hover)] text-white rounded-xl px-4 py-2 text-sm font-medium">
            <Plus className="h-4 w-4" /> Novo Curso
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Editar Curso' : 'Novo Curso'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Titulo</Label>
                <Input
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Ex: Frances para Viajantes"
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nivel</Label>
                  <Select value={form.level} onValueChange={(v) => setForm((f) => ({ ...f, level: v ?? 'INICIANTE' }))}>
                    <SelectTrigger className="bg-[var(--color-surface-low)] border-none rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LEVELS.map((l) => (
                        <SelectItem key={l.value} value={l.value}>
                          {l.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Clube</Label>
                  <Select value={form.clubId} onValueChange={(v) => setForm((f) => ({ ...f, clubId: v ?? '' }))}>
                    <SelectTrigger className="bg-[var(--color-surface-low)] border-none rounded-xl">
                      <SelectValue placeholder="Nenhum" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Nenhum</SelectItem>
                      {clubs.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label>Gratuito</Label>
                <Switch
                  checked={form.isFree}
                  onCheckedChange={(v) => setForm((f) => ({ ...f, isFree: v }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Publicado</Label>
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
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : editingId ? 'Salvar Alteracoes' : 'Criar Curso'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {initialCourses.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          Nenhum curso criado ainda.
        </div>
      ) : (
        <div className="space-y-3">
          {initialCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl p-5 shadow-[0_4px_24px_rgba(48,51,66,0.06)] flex items-center justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-[var(--color-azul-escuro)]">{course.title}</h3>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      course.isPublished
                        ? 'bg-green-50 text-green-600'
                        : 'bg-amber-50 text-amber-600'
                    }`}
                  >
                    {course.isPublished ? 'Publicado' : 'Rascunho'}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <BarChart3 className="h-3 w-3" /> {course.level}
                  </span>
                  {course.clubName && (
                    <span className="flex items-center gap-1">Clube: {course.clubName}</span>
                  )}
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" /> {course.lessonCount} aulas
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Link
                  href={`/admin/cursos/${course.id}/aulas`}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium bg-[var(--color-rosa)]/10 text-[var(--color-rosa)] hover:bg-[var(--color-rosa)]/20 transition-colors"
                >
                  Gerenciar Aulas
                </Link>
                <button
                  onClick={() => editCourse(course)}
                  className="p-2 rounded-xl hover:bg-[var(--color-surface-low)] text-muted-foreground"
                  title="Editar"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
