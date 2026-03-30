'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Pencil, Loader2 } from 'lucide-react'

interface Week {
  id: string
  weekNumber: number
  title: string
  description: string
  level: string
  musicUrl: string
  videoUrl: string
  vocabulary: any
  prompts: any
  exercise: string | null
  challengeText: string
  isActive: boolean
}

export function AdminWeeksManager({ initialWeeks }: { initialWeeks: Week[] }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    weekNumber: '',
    title: '',
    description: '',
    level: 'INICIANTE',
    musicUrl: '',
    videoUrl: '',
    vocabulary: '[]',
    prompts: '[]',
    exercise: '',
    challengeText: '',
    isActive: false,
  })

  function resetForm() {
    setForm({ weekNumber: '', title: '', description: '', level: 'INICIANTE', musicUrl: '', videoUrl: '', vocabulary: '[]', prompts: '[]', exercise: '', challengeText: '', isActive: false })
    setEditingId(null)
  }

  function editWeek(week: Week) {
    setForm({
      weekNumber: String(week.weekNumber),
      title: week.title,
      description: week.description,
      level: week.level,
      musicUrl: week.musicUrl,
      videoUrl: week.videoUrl,
      vocabulary: JSON.stringify(week.vocabulary, null, 2),
      prompts: JSON.stringify(week.prompts, null, 2),
      exercise: week.exercise || '',
      challengeText: week.challengeText,
      isActive: week.isActive,
    })
    setEditingId(week.id)
    setOpen(true)
  }

  async function handleSave() {
    setLoading(true)
    const method = editingId ? 'PUT' : 'POST'
    const url = editingId ? `/api/admin/weeks/${editingId}` : '/api/admin/weeks'

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        weekNumber: Number(form.weekNumber),
        vocabulary: JSON.parse(form.vocabulary),
        prompts: JSON.parse(form.prompts),
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
            <Plus className="h-4 w-4" /> Nova Semana
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Editar Semana' : 'Nova Semana'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Número da Semana</Label>
                  <Input type="number" value={form.weekNumber} onChange={e => setForm(f => ({...f, weekNumber: e.target.value}))} className="bg-[var(--color-surface-low)] border-none rounded-xl" />
                </div>
                <div>
                  <Label>Nível</Label>
                  <Select value={form.level} onValueChange={v => setForm(f => ({...f, level: v ?? 'INICIANTE'}))}>
                    <SelectTrigger className="bg-[var(--color-surface-low)] border-none rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INICIANTE">Iniciante</SelectItem>
                      <SelectItem value="INTERMEDIARIO">Intermediário</SelectItem>
                      <SelectItem value="AVANCADO">Avançado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Título</Label>
                <Input value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} className="bg-[var(--color-surface-low)] border-none rounded-xl" />
              </div>
              <div>
                <Label>Descrição</Label>
                <Textarea value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} className="bg-[var(--color-surface-low)] border-none rounded-xl" />
              </div>
              <div>
                <Label>URL da Música</Label>
                <Input value={form.musicUrl} onChange={e => setForm(f => ({...f, musicUrl: e.target.value}))} className="bg-[var(--color-surface-low)] border-none rounded-xl" />
              </div>
              <div>
                <Label>URL do Vídeo</Label>
                <Input value={form.videoUrl} onChange={e => setForm(f => ({...f, videoUrl: e.target.value}))} className="bg-[var(--color-surface-low)] border-none rounded-xl" />
              </div>
              <div>
                <Label>Vocabulário (JSON)</Label>
                <Textarea value={form.vocabulary} onChange={e => setForm(f => ({...f, vocabulary: e.target.value}))} className="bg-[var(--color-surface-low)] border-none rounded-xl font-mono text-xs" rows={4} placeholder='[{"word":"Bonjour","translation":"Ola"}]' />
              </div>
              <div>
                <Label>Prompts (JSON array de strings)</Label>
                <Textarea value={form.prompts} onChange={e => setForm(f => ({...f, prompts: e.target.value}))} className="bg-[var(--color-surface-low)] border-none rounded-xl font-mono text-xs" rows={3} placeholder='["Comment vous appelez-vous?"]' />
              </div>
              <div>
                <Label>Exercício</Label>
                <Textarea value={form.exercise} onChange={e => setForm(f => ({...f, exercise: e.target.value}))} className="bg-[var(--color-surface-low)] border-none rounded-xl" />
              </div>
              <div>
                <Label>Texto do Desafio</Label>
                <Textarea value={form.challengeText} onChange={e => setForm(f => ({...f, challengeText: e.target.value}))} className="bg-[var(--color-surface-low)] border-none rounded-xl" />
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={form.isActive} onCheckedChange={v => setForm(f => ({...f, isActive: v}))} />
                <Label>Semana Ativa</Label>
              </div>
              <Button onClick={handleSave} disabled={loading} className="w-full bg-[var(--color-laranja)] hover:bg-[var(--color-laranja-hover)] text-white rounded-xl">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Salvar'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {initialWeeks.map((week) => (
          <div key={week.id} className="bg-white rounded-2xl p-5 shadow-[0_4px_24px_rgba(48,51,66,0.06)] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-muted-foreground w-12">#{week.weekNumber}</span>
              <div>
                <p className="font-medium text-[var(--color-azul-escuro)]">{week.title}</p>
                <p className="text-xs text-muted-foreground">{week.level} {week.isActive ? '• Ativa' : ''}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {week.isActive && <span className="w-2 h-2 rounded-full bg-green-500" />}
              <button onClick={() => editWeek(week)} className="p-2 rounded-xl hover:bg-[var(--color-surface-low)] text-muted-foreground">
                <Pencil className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
