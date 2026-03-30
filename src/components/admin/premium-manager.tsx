'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Pencil, Trash2, Loader2, MapPin, Calendar, Users } from 'lucide-react'
import { format } from 'date-fns'

interface PremiumEvent {
  id: string
  title: string
  description: string
  city: string
  date: string
  maxSpots: number
  spotsLeft: number
  imageUrl: string | null
}

export function AdminPremiumManager({ initialEvents }: { initialEvents: PremiumEvent[] }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    title: '', description: '', city: '', date: '',
    maxSpots: '20', imageUrl: '',
  })

  function resetForm() {
    setForm({ title: '', description: '', city: '', date: '', maxSpots: '20', imageUrl: '' })
    setEditingId(null)
  }

  function editEvent(event: PremiumEvent) {
    setForm({
      title: event.title,
      description: event.description,
      city: event.city,
      date: event.date.slice(0, 16),
      maxSpots: String(event.maxSpots),
      imageUrl: event.imageUrl || '',
    })
    setEditingId(event.id)
    setOpen(true)
  }

  async function handleSave() {
    setLoading(true)
    const method = editingId ? 'PUT' : 'POST'
    const url = editingId ? `/api/admin/premium/${editingId}` : '/api/admin/premium'
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        maxSpots: Number(form.maxSpots),
      }),
    })
    setLoading(false)
    setOpen(false)
    resetForm()
    router.refresh()
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir este evento?')) return
    await fetch(`/api/admin/premium/${id}`, { method: 'DELETE' })
    router.refresh()
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm() }}>
          <DialogTrigger className="inline-flex items-center justify-center gap-2 bg-[var(--color-laranja)] hover:bg-[var(--color-laranja-hover)] text-white rounded-xl px-4 py-2 text-sm font-medium">
            <Plus className="h-4 w-4" /> Novo Evento
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Editar Evento' : 'Novo Evento Premium'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Título</Label>
                <Input value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} className="bg-[var(--color-surface-low)] border-none rounded-xl" />
              </div>
              <div>
                <Label>Descrição</Label>
                <Textarea value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} className="bg-[var(--color-surface-low)] border-none rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Cidade</Label>
                  <Input value={form.city} onChange={e => setForm(f => ({...f, city: e.target.value}))} className="bg-[var(--color-surface-low)] border-none rounded-xl" />
                </div>
                <div>
                  <Label>Vagas</Label>
                  <Input type="number" value={form.maxSpots} onChange={e => setForm(f => ({...f, maxSpots: e.target.value}))} className="bg-[var(--color-surface-low)] border-none rounded-xl" />
                </div>
              </div>
              <div>
                <Label>Data/Hora</Label>
                <Input type="datetime-local" value={form.date} onChange={e => setForm(f => ({...f, date: e.target.value}))} className="bg-[var(--color-surface-low)] border-none rounded-xl" />
              </div>
              <div>
                <Label>URL da Imagem (opcional)</Label>
                <Input value={form.imageUrl} onChange={e => setForm(f => ({...f, imageUrl: e.target.value}))} placeholder="https://..." className="bg-[var(--color-surface-low)] border-none rounded-xl" />
              </div>
              <Button onClick={handleSave} disabled={loading} className="w-full bg-[var(--color-laranja)] hover:bg-[var(--color-laranja-hover)] text-white rounded-xl">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Salvar'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {initialEvents.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          Nenhum evento criado ainda.
        </div>
      ) : (
        <div className="space-y-3">
          {initialEvents.map((event) => (
            <div key={event.id} className="bg-white rounded-2xl p-5 shadow-[0_4px_24px_rgba(48,51,66,0.06)] flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-[var(--color-azul-escuro)]">{event.title}</h3>
                <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {format(new Date(event.date), 'dd/MM/yyyy HH:mm')}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {event.city}</span>
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {event.spotsLeft}/{event.maxSpots} vagas</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => editEvent(event)} className="p-2 rounded-xl hover:bg-[var(--color-surface-low)] text-muted-foreground">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(event.id)} className="p-2 rounded-xl hover:bg-red-50 text-muted-foreground hover:text-red-500">
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
