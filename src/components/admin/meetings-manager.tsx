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
import { format } from 'date-fns'

interface Meeting {
  id: string
  title: string
  level: string
  scheduledAt: string
  duration: number
  meetingUrl: string
  maxParticipants: number
  description: string | null
  isPremiumOnly: boolean
  city: string | null
  address: string | null
}

export function AdminMeetingsManager({ initialMeetings }: { initialMeetings: Meeting[] }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    title: '', level: 'INICIANTE', scheduledAt: '', duration: '60',
    meetingUrl: '', maxParticipants: '8', description: '',
    isPremiumOnly: false, city: '', address: '',
  })

  function resetForm() {
    setForm({ title: '', level: 'INICIANTE', scheduledAt: '', duration: '60', meetingUrl: '', maxParticipants: '8', description: '', isPremiumOnly: false, city: '', address: '' })
    setEditingId(null)
  }

  async function handleSave() {
    setLoading(true)
    const method = editingId ? 'PUT' : 'POST'
    const url = editingId ? `/api/admin/meetings/${editingId}` : '/api/admin/meetings'
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        duration: Number(form.duration),
        maxParticipants: Number(form.maxParticipants),
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
            <Plus className="h-4 w-4" /> Novo Encontro
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Editar Encontro' : 'Novo Encontro'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div><Label>Título</Label><Input value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} className="bg-[var(--color-surface-low)] border-none rounded-xl" /></div>
              <div className="grid grid-cols-2 gap-4">
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
                <div><Label>Duração (min)</Label><Input type="number" value={form.duration} onChange={e => setForm(f => ({...f, duration: e.target.value}))} className="bg-[var(--color-surface-low)] border-none rounded-xl" /></div>
              </div>
              <div><Label>Data/Hora</Label><Input type="datetime-local" value={form.scheduledAt} onChange={e => setForm(f => ({...f, scheduledAt: e.target.value}))} className="bg-[var(--color-surface-low)] border-none rounded-xl" /></div>
              <div><Label>URL da Sala</Label><Input value={form.meetingUrl} onChange={e => setForm(f => ({...f, meetingUrl: e.target.value}))} className="bg-[var(--color-surface-low)] border-none rounded-xl" /></div>
              <div><Label>Máx. Participantes</Label><Input type="number" value={form.maxParticipants} onChange={e => setForm(f => ({...f, maxParticipants: e.target.value}))} className="bg-[var(--color-surface-low)] border-none rounded-xl" /></div>
              <div><Label>Descrição</Label><Textarea value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} className="bg-[var(--color-surface-low)] border-none rounded-xl" /></div>
              <div className="flex items-center gap-2"><Switch checked={form.isPremiumOnly} onCheckedChange={v => setForm(f => ({...f, isPremiumOnly: v}))} /><Label>Encontro Presencial (Premium)</Label></div>
              {form.isPremiumOnly && (
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Cidade</Label><Input value={form.city} onChange={e => setForm(f => ({...f, city: e.target.value}))} className="bg-[var(--color-surface-low)] border-none rounded-xl" /></div>
                  <div><Label>Endereço</Label><Input value={form.address} onChange={e => setForm(f => ({...f, address: e.target.value}))} className="bg-[var(--color-surface-low)] border-none rounded-xl" /></div>
                </div>
              )}
              <Button onClick={handleSave} disabled={loading} className="w-full bg-[var(--color-laranja)] hover:bg-[var(--color-laranja-hover)] text-white rounded-xl">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Salvar'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {initialMeetings.map((meeting) => (
          <div key={meeting.id} className="bg-white rounded-2xl p-5 shadow-[0_4px_24px_rgba(48,51,66,0.06)] flex items-center justify-between">
            <div>
              <p className="font-medium text-[var(--color-azul-escuro)]">{meeting.title}</p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(meeting.scheduledAt), 'dd/MM/yyyy HH:mm')} • {meeting.level}
                {meeting.isPremiumOnly ? ' • Presencial' : ''}
              </p>
            </div>
            <button onClick={() => { setEditingId(meeting.id); setForm({ title: meeting.title, level: meeting.level, scheduledAt: meeting.scheduledAt.slice(0, 16), duration: String(meeting.duration), meetingUrl: meeting.meetingUrl, maxParticipants: String(meeting.maxParticipants), description: meeting.description || '', isPremiumOnly: meeting.isPremiumOnly, city: meeting.city || '', address: meeting.address || '' }); setOpen(true) }} className="p-2 rounded-xl hover:bg-[var(--color-surface-low)]">
              <Pencil className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        ))}
      </div>
    </>
  )
}
