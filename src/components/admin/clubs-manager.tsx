'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Pencil, Loader2, BookOpen, Users } from 'lucide-react'

interface Club {
  id: string
  name: string
  slug: string
  description: string
  minPlan: string
  isActive: boolean
  sortOrder: number
  courseCount: number
  memberCount: number
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

const PLAN_OPTIONS = [
  { value: 'monthly', label: 'Mensal' },
  { value: 'quarterly', label: 'Trimestral' },
  { value: 'yearly', label: 'Anual' },
  { value: 'premium', label: 'Premium' },
]

function planLabel(plan: string) {
  return PLAN_OPTIONS.find((p) => p.value === plan)?.label || plan
}

export function AdminClubsManager({ initialClubs }: { initialClubs: Club[] }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    minPlan: 'monthly',
    isActive: true,
    sortOrder: '0',
  })

  function resetForm() {
    setForm({ name: '', slug: '', description: '', minPlan: 'monthly', isActive: true, sortOrder: '0' })
    setEditingId(null)
  }

  function editClub(club: Club) {
    setForm({
      name: club.name,
      slug: club.slug,
      description: club.description,
      minPlan: club.minPlan,
      isActive: club.isActive,
      sortOrder: String(club.sortOrder),
    })
    setEditingId(club.id)
    setOpen(true)
  }

  function handleNameChange(value: string) {
    setForm((f) => ({
      ...f,
      name: value,
      slug: editingId ? f.slug : slugify(value),
    }))
  }

  async function handleSave() {
    setLoading(true)
    const method = editingId ? 'PUT' : 'POST'
    const url = editingId ? `/api/admin/clubs/${editingId}` : '/api/admin/clubs'
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        sortOrder: Number(form.sortOrder),
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
            <Plus className="h-4 w-4" /> Novo Clube
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Editar Clube' : 'Novo Clube'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Nome</Label>
                <Input
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Ex: Clube de Cinema Frances"
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
                  <Label>Plano Minimo</Label>
                  <Select value={form.minPlan} onValueChange={(v) => setForm((f) => ({ ...f, minPlan: v ?? 'monthly' }))}>
                    <SelectTrigger className="bg-[var(--color-surface-low)] border-none rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PLAN_OPTIONS.map((p) => (
                        <SelectItem key={p.value} value={p.value}>
                          {p.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                <Label>Ativo</Label>
                <Switch
                  checked={form.isActive}
                  onCheckedChange={(v) => setForm((f) => ({ ...f, isActive: v }))}
                />
              </div>
              <Button
                onClick={handleSave}
                disabled={loading}
                className="w-full bg-[var(--color-laranja)] hover:bg-[var(--color-laranja-hover)] text-white rounded-xl"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : editingId ? 'Salvar Alteracoes' : 'Criar Clube'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {initialClubs.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          Nenhum clube criado ainda.
        </div>
      ) : (
        <div className="space-y-3">
          {initialClubs.map((club) => (
            <div
              key={club.id}
              className="bg-white rounded-2xl p-5 shadow-[0_4px_24px_rgba(48,51,66,0.06)] flex items-center justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-[var(--color-azul-escuro)]">{club.name}</h3>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      club.isActive
                        ? 'bg-green-50 text-green-600'
                        : 'bg-red-50 text-red-500'
                    }`}
                  >
                    {club.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                  <span>Plano min: {planLabel(club.minPlan)}</span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" /> {club.courseCount} cursos
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" /> {club.memberCount} membros
                  </span>
                </div>
              </div>
              <button
                onClick={() => editClub(club)}
                className="p-2 rounded-xl hover:bg-[var(--color-surface-low)] text-muted-foreground"
                title="Editar"
              >
                <Pencil className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
