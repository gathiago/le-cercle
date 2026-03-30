'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Loader2, Pencil, Power } from 'lucide-react'

interface Coupon {
  id: string; code: string; discountType: string; discountValue: number;
  maxUses: number | null; currentUses: number; minPlanInterval: string | null;
  validUntil: string | null; isActive: boolean; createdAt: string;
}

export function AdminCouponsManager({ initialCoupons }: { initialCoupons: Coupon[] }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    code: '', discountType: 'PERCENTAGE', discountValue: '',
    maxUses: '', minPlanInterval: '', validUntil: '',
  })

  function editCoupon(coupon: Coupon) {
    setEditingId(coupon.id)
    setForm({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: String(coupon.discountValue),
      maxUses: coupon.maxUses ? String(coupon.maxUses) : '',
      minPlanInterval: coupon.minPlanInterval || '',
      validUntil: coupon.validUntil ? coupon.validUntil.slice(0, 10) : '',
    })
    setOpen(true)
  }

  async function toggleCoupon(id: string, isActive: boolean) {
    setLoading(true)
    await fetch(`/api/coupons/${id}`, {
      method: isActive ? 'DELETE' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      ...(!isActive ? { body: JSON.stringify({ isActive: true }) } : {}),
    })
    setLoading(false)
    router.refresh()
  }

  async function handleCreate() {
    setLoading(true)
    const payload = {
      ...form,
      discountValue: Number(form.discountValue),
      maxUses: form.maxUses ? Number(form.maxUses) : null,
      minPlanInterval: form.minPlanInterval || null,
      validUntil: form.validUntil || null,
    }

    if (editingId) {
      await fetch(`/api/coupons/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    } else {
      await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    }

    setLoading(false)
    setOpen(false)
    setEditingId(null)
    setForm({ code: '', discountType: 'PERCENTAGE', discountValue: '', maxUses: '', minPlanInterval: '', validUntil: '' })
    router.refresh()
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setEditingId(null); setForm({ code: '', discountType: 'PERCENTAGE', discountValue: '', maxUses: '', minPlanInterval: '', validUntil: '' }); } }}>
          <DialogTrigger className="inline-flex items-center justify-center gap-2 bg-[var(--color-laranja)] hover:bg-[var(--color-laranja-hover)] text-white rounded-xl px-4 py-2 text-sm font-medium">
            <Plus className="h-4 w-4" /> Novo Cupom
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editingId ? 'Editar Cupom' : 'Criar Cupom'}</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-4">
              <div><Label>Código</Label><Input value={form.code} onChange={e => setForm(f => ({...f, code: e.target.value.toUpperCase()}))} placeholder="BONJOUR20" className="bg-[var(--color-surface-low)] border-none rounded-xl" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tipo</Label>
                  <Select value={form.discountType} onValueChange={v => setForm(f => ({...f, discountType: v ?? 'PERCENTAGE'}))}>
                    <SelectTrigger className="bg-[var(--color-surface-low)] border-none rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PERCENTAGE">Percentual (%)</SelectItem>
                      <SelectItem value="FIXED">Valor Fixo (R$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Valor</Label><Input type="number" value={form.discountValue} onChange={e => setForm(f => ({...f, discountValue: e.target.value}))} className="bg-[var(--color-surface-low)] border-none rounded-xl" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Limite de Usos</Label><Input type="number" value={form.maxUses} onChange={e => setForm(f => ({...f, maxUses: e.target.value}))} placeholder="Ilimitado" className="bg-[var(--color-surface-low)] border-none rounded-xl" /></div>
                <div><Label>Válido até</Label><Input type="date" value={form.validUntil} onChange={e => setForm(f => ({...f, validUntil: e.target.value}))} className="bg-[var(--color-surface-low)] border-none rounded-xl" /></div>
              </div>
              <Button onClick={handleCreate} disabled={loading} className="w-full bg-[var(--color-laranja)] hover:bg-[var(--color-laranja-hover)] text-white rounded-xl">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : editingId ? 'Salvar Alterações' : 'Criar Cupom'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(48,51,66,0.06)] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[var(--color-surface-low)]">
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Código</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Desconto</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Usos</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Validade</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Ações</th>
            </tr>
          </thead>
          <tbody>
            {initialCoupons.map((coupon) => (
              <tr key={coupon.id} className="hover:bg-[var(--color-surface)]">
                <td className="px-4 py-3 text-sm font-mono font-bold text-[var(--color-azul-escuro)]">{coupon.code}</td>
                <td className="px-4 py-3 text-sm">{coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}%` : `R$ ${coupon.discountValue}`}</td>
                <td className="px-4 py-3 text-sm">{coupon.currentUses}/{coupon.maxUses || '\u221E'}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{coupon.validUntil ? new Date(coupon.validUntil).toLocaleDateString('pt-BR') : 'Sem limite'}</td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${coupon.isActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                    {coupon.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button onClick={() => editCoupon(coupon)} className="p-1.5 rounded-lg hover:bg-[var(--color-surface-low)] text-muted-foreground" title="Editar">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => toggleCoupon(coupon.id, coupon.isActive)} className={`p-1.5 rounded-lg ${coupon.isActive ? 'hover:bg-red-50 text-muted-foreground hover:text-red-500' : 'hover:bg-green-50 text-muted-foreground hover:text-green-500'}`} title={coupon.isActive ? 'Desativar' : 'Ativar'}>
                      <Power className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
