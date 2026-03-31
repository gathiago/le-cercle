'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Pencil, Loader2, Package, DollarSign, Upload } from 'lucide-react'

interface Product {
  id: string
  title: string
  slug: string
  description: string
  price: number
  imageUrl: string | null
  fileUrl: string | null
  fileName: string | null
  isActive: boolean
  purchaseCount: number
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

export function AdminProductsManager({ initialProducts }: { initialProducts: Product[] }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    price: '',
    fileUrl: '',
    fileName: '',
    isActive: true,
  })

  function resetForm() {
    setForm({ title: '', slug: '', description: '', price: '', fileUrl: '', fileName: '', isActive: true })
    setEditingId(null)
  }

  function editProduct(product: Product) {
    setForm({
      title: product.title,
      slug: product.slug,
      description: product.description,
      price: String(product.price),
      fileUrl: product.fileUrl || '',
      fileName: product.fileName || '',
      isActive: product.isActive,
    })
    setEditingId(product.id)
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
    const url = editingId ? `/api/admin/products/${editingId}` : '/api/admin/products'
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        price: Number(form.price),
        fileUrl: form.fileUrl || null,
        fileName: form.fileName || null,
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
            <Plus className="h-4 w-4" /> Novo Produto
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Editar Produto' : 'Novo Produto'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Titulo</Label>
                <Input
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Ex: Resumos Verbais em PDF"
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
                  <Label>Preco (R$)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                    className="bg-[var(--color-surface-low)] border-none rounded-xl"
                  />
                </div>
                <div>
                  <Label>Nome do Arquivo</Label>
                  <Input
                    value={form.fileName}
                    onChange={(e) => setForm((f) => ({ ...f, fileName: e.target.value }))}
                    placeholder="resumos-verbais.pdf"
                    className="bg-[var(--color-surface-low)] border-none rounded-xl"
                  />
                </div>
              </div>
              <div>
                <Label>Arquivo para download</Label>
                <div className="flex gap-2">
                  <Input
                    value={form.fileUrl}
                    onChange={(e) => setForm((f) => ({ ...f, fileUrl: e.target.value }))}
                    placeholder="URL ou faça upload..."
                    className="bg-[var(--color-surface-low)] border-none rounded-xl flex-1"
                  />
                  <label className="inline-flex items-center justify-center gap-1.5 bg-[var(--color-rosa)] hover:bg-[var(--color-rosa-hover)] text-white rounded-xl px-3 py-2 text-xs font-medium cursor-pointer transition-colors shrink-0">
                    {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                    Upload
                    <input
                      type="file"
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
                          setForm(f => ({ ...f, fileUrl: data.fileUrl, fileName: data.fileName }))
                        }
                        setUploading(false)
                      }}
                    />
                  </label>
                </div>
                {form.fileUrl && <p className="text-xs text-green-600 mt-1">Arquivo: {form.fileName || form.fileUrl}</p>}
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
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : editingId ? 'Salvar Alteracoes' : 'Criar Produto'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {initialProducts.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          Nenhum produto criado ainda.
        </div>
      ) : (
        <div className="space-y-3">
          {initialProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl p-5 shadow-[0_4px_24px_rgba(48,51,66,0.06)] flex items-center justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-[var(--color-azul-escuro)]">{product.title}</h3>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      product.isActive
                        ? 'bg-green-50 text-green-600'
                        : 'bg-red-50 text-red-500'
                    }`}
                  >
                    {product.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" /> R$ {product.price.toFixed(2)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Package className="h-3 w-3" /> {product.purchaseCount} vendas
                  </span>
                  <span className="font-mono text-[10px]">/{product.slug}</span>
                </div>
              </div>
              <button
                onClick={() => editProduct(product)}
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
