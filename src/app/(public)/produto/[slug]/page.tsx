'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { ArrowLeft, CreditCard, CheckCircle, DownloadSimple, ShieldCheck } from '@phosphor-icons/react'

function ProdutoContent() {
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string

  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'form' | 'payment' | 'success'>('form')
  const [error, setError] = useState('')
  const [downloadUrl, setDownloadUrl] = useState('')
  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [product, setProduct] = useState<{ title: string; price: number; description: string } | null>(null)

  useEffect(() => {
    fetch(`/api/products/${slug}/info`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setProduct(data) })
      .catch(() => {})
  }, [slug])

  function formatPhone(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 11)
    if (digits.length <= 2) return digits
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  }

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.email.includes('@')) return
    setStep('payment')
  }

  async function handlePurchase() {
    setLoading(true)
    setError('')

    try {
      const res = await fetch(`/api/products/${slug}/purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Erro ao processar compra')
        setLoading(false)
        return
      }

      setDownloadUrl(data.downloadUrl)
      setStep('success')
    } catch {
      setError('Erro inesperado. Tente novamente.')
    }
    setLoading(false)
  }

  // Success screen
  if (step === 'success') {
    return (
      <div className="max-w-md mx-auto px-4 pt-12">
        <div className="bg-[var(--color-surface-lowest)] rounded-[2rem] p-8 shadow-[0_16px_48px_-12px_rgba(48,51,66,0.06)] text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-400 flex items-center justify-center mx-auto mb-6 shadow-[0_12px_32px_-8px_rgba(16,185,129,0.3)]">
            <CheckCircle className="h-8 w-8 text-white" weight="bold" />
          </div>
          <h2 className="text-xl font-bold text-[var(--color-azul-escuro)] tracking-tight mb-2">Compra confirmada!</h2>
          <p className="text-sm text-[var(--color-azul-escuro)]/40 mb-8">Seu produto está pronto para download.</p>

          <a
            href={downloadUrl}
            className="group inline-flex items-center h-14 px-10 rounded-xl bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-laranja)] text-white font-semibold text-base transition-all active:scale-[0.98] shadow-[0_12px_32px_rgba(252,142,96,0.25)]"
            style={{ borderTop: '1px solid rgba(255,255,255,0.2)' }}
          >
            <DownloadSimple className="h-5 w-5 mr-2" weight="bold" />
            Baixar agora
          </a>

          <p className="text-xs text-[var(--color-azul-escuro)]/25 mt-6">
            Enviamos o link de download para <strong>{form.email}</strong>
          </p>
        </div>
      </div>
    )
  }

  // Payment confirmation
  if (step === 'payment') {
    return (
      <div className="max-w-md mx-auto px-4 pt-8">
        <div className="bg-[var(--color-surface-lowest)] rounded-[2rem] p-8 shadow-[0_16px_48px_-12px_rgba(48,51,66,0.06)]">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-400 flex items-center justify-center mx-auto mb-5 shadow-[0_8px_24px_-4px_rgba(16,185,129,0.3)]">
              <CreditCard className="h-7 w-7 text-white" weight="bold" />
            </div>
            <h2 className="text-xl font-bold text-[var(--color-azul-escuro)] tracking-tight">Confirmar Pagamento</h2>
          </div>

          <div className="bg-[var(--color-surface-low)] rounded-xl p-5 mb-5 space-y-3">
            {product && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-azul-escuro)]/35">Produto</span>
                  <span className="font-medium text-[var(--color-azul-escuro)]">{product.title}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-azul-escuro)]/35">Valor</span>
                  <span className="font-bold text-[var(--color-azul-escuro)]">R$ {product.price.toFixed(2)}</span>
                </div>
              </>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-[var(--color-azul-escuro)]/35">Nome</span>
              <span className="font-medium text-[var(--color-azul-escuro)]">{form.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--color-azul-escuro)]/35">E-mail</span>
              <span className="font-medium text-[var(--color-azul-escuro)]">{form.email}</span>
            </div>
          </div>

          {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm mb-4">{error}</div>}

          <div className="bg-emerald-50 rounded-xl p-4 flex items-center gap-3 mb-5">
            <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" weight="fill" />
            <div>
              <p className="text-sm font-medium text-emerald-800">PIX - Aprovação Instantânea</p>
              <p className="text-xs text-emerald-600">Pagamento simulado para demonstração</p>
            </div>
          </div>

          <Button
            onClick={handlePurchase}
            disabled={loading}
            className="w-full h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-semibold text-base shadow-[0_8px_24px_rgba(16,185,129,0.25)] active:scale-[0.98]"
            style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
              <><CheckCircle className="h-5 w-5 mr-2" weight="bold" /> Confirmar Pagamento</>
            )}
          </Button>

          <button onClick={() => setStep('form')} className="w-full text-center text-sm text-[var(--color-azul-escuro)]/30 hover:text-[var(--color-azul-escuro)]/60 mt-4 transition-colors">
            Voltar
          </button>
        </div>
      </div>
    )
  }

  // Form
  return (
    <div className="max-w-md mx-auto px-4 pt-8">
      <div className="bg-[var(--color-surface-lowest)] rounded-[2rem] p-8 shadow-[0_16px_48px_-12px_rgba(48,51,66,0.06)]">
        {product && (
          <div className="bg-[var(--color-surface-low)] rounded-xl p-4 mb-6 flex justify-between items-center">
            <div>
              <p className="font-bold text-[var(--color-azul-escuro)] text-sm">{product.title}</p>
              <p className="text-xs text-[var(--color-azul-escuro)]/35">Produto digital</p>
            </div>
            <p className="text-lg font-bold text-[var(--color-azul-escuro)]">R$ {product.price.toFixed(2)}</p>
          </div>
        )}
        <h2 className="text-xl font-bold text-[var(--color-azul-escuro)] tracking-tight mb-1">Finalizar compra</h2>
        <p className="text-sm text-[var(--color-azul-escuro)]/35 mb-7">Preencha seus dados para continuar.</p>

        <form onSubmit={handleFormSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-[var(--color-azul-escuro)]/50 uppercase tracking-wider">Nome completo</Label>
            <Input
              required
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Seu nome"
              className="bg-[var(--color-surface-low)] h-12 rounded-xl text-[var(--color-azul-escuro)] placeholder:text-[var(--color-azul-escuro)]/20"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold text-[var(--color-azul-escuro)]/50 uppercase tracking-wider">E-mail</Label>
            <Input
              required
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="seu@email.com"
              className="bg-[var(--color-surface-low)] h-12 rounded-xl text-[var(--color-azul-escuro)] placeholder:text-[var(--color-azul-escuro)]/20"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold text-[var(--color-azul-escuro)]/50 uppercase tracking-wider">WhatsApp <span className="text-[var(--color-azul-escuro)]/20">(opcional)</span></Label>
            <Input
              type="tel"
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: formatPhone(e.target.value) }))}
              placeholder="(11) 99999-9999"
              className="bg-[var(--color-surface-low)] h-12 rounded-xl text-[var(--color-azul-escuro)] placeholder:text-[var(--color-azul-escuro)]/20"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-14 rounded-xl bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-laranja)] text-white font-semibold text-base shadow-[0_12px_32px_rgba(252,142,96,0.25)] active:scale-[0.98] mt-2"
            style={{ borderTop: '1px solid rgba(255,255,255,0.2)' }}
          >
            <CreditCard className="h-4 w-4 mr-2" weight="bold" />
            Ir para pagamento
          </Button>

          <div className="flex items-center justify-center gap-2 text-xs text-[var(--color-azul-escuro)]/20 pt-1">
            <ShieldCheck className="h-3.5 w-3.5" weight="bold" /> Pagamento seguro
          </div>
        </form>
      </div>
    </div>
  )
}

export default function ProdutoPage() {
  return (
    <Suspense fallback={<div className="min-h-[100dvh] flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-[var(--color-laranja)]" /></div>}>
      <ProdutoContent />
    </Suspense>
  )
}
