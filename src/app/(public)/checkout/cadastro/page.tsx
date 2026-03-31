'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { getPlanById } from '@/lib/plans'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { ArrowLeft, CreditCard, ShieldCheck, CheckCircle } from '@phosphor-icons/react'

const schema = z.object({
  name: z.string().min(3, 'Mínimo 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  confirmPassword: z.string(),
  phone: z.string().optional(),
  acceptedTerms: z.literal(true, { message: 'Você precisa aceitar os termos' }),
}).refine(data => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
})

type FormData = z.infer<typeof schema>

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 2) return digits
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

function CadastroContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const planId = searchParams.get('plan') || 'yearly'
  const couponCode = searchParams.get('coupon') || ''
  const clubsParam = searchParams.get('clubs') || ''
  const plan = getPlanById(planId as any)

  const [loading, setLoading] = useState(false)
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState('')
  const [phone, setPhone] = useState('')
  const [formData, setFormData] = useState<FormData | null>(null)

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { acceptedTerms: false as any },
  })

  if (!plan) { router.push('/checkout'); return null }

  const planLabels: Record<string, string> = { monthly: 'Mensal', quarterly: 'Trimestral', yearly: 'Anual', premium: 'Premium' }

  function onSubmit(data: FormData) { setFormData(data); setPaying(true) }

  async function handleSimulatePayment() {
    if (!formData) return
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/checkout/simulate-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password, phone: formData.phone || null, plan: planId, couponCode: couponCode || null, clubs: clubsParam || null }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Erro ao processar'); setLoading(false); return }
      await signIn('credentials', { email: formData.email, password: formData.password, redirect: false })
      router.push('/checkout/sucesso')
    } catch { setError('Erro inesperado.'); setLoading(false) }
  }

  // Payment confirmation screen
  if (paying && formData) {
    return (
      <div className="max-w-md mx-auto px-4 pt-8">
        <div className="bg-[var(--color-surface-lowest)] rounded-[2rem] p-8 shadow-[0_16px_48px_-12px_rgba(48,51,66,0.06)]">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-400 flex items-center justify-center mx-auto mb-5 shadow-[0_8px_24px_-4px_rgba(16,185,129,0.3)]">
              <CreditCard className="h-7 w-7 text-white" weight="bold" />
            </div>
            <h2 className="text-xl font-bold text-[var(--color-azul-escuro)] tracking-tight">Confirmar Pagamento</h2>
            <p className="text-sm text-[var(--color-azul-escuro)]/35 mt-1">Revise e confirme</p>
          </div>

          <div className="bg-[var(--color-surface-low)] rounded-xl p-5 mb-5 space-y-3">
            {[
              ['Plano', planLabels[planId]],
              ['Valor', `R$ ${plan.price.toFixed(2)}`],
              ['Nome', formData.name],
              ['E-mail', formData.email],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between text-sm">
                <span className="text-[var(--color-azul-escuro)]/35">{k}</span>
                <span className="font-medium text-[var(--color-azul-escuro)]">{v}</span>
              </div>
            ))}
          </div>

          {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm mb-4">{error}</div>}

          <div className="bg-emerald-50 rounded-xl p-4 flex items-center gap-3 mb-5">
            <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" weight="fill" />
            <div>
              <p className="text-sm font-medium text-emerald-800">PIX - Aprovacao Instantanea</p>
              <p className="text-xs text-emerald-600">Pagamento simulado para demonstracao</p>
            </div>
          </div>

          <Button
            onClick={handleSimulatePayment}
            disabled={loading}
            className="w-full h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-semibold text-base shadow-[0_8px_24px_rgba(16,185,129,0.25)] active:scale-[0.98]"
            style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
              <><CheckCircle className="h-5 w-5 mr-2" weight="bold" /> Confirmar Pagamento</>
            )}
          </Button>

          <button onClick={() => setPaying(false)} className="w-full text-center text-sm text-[var(--color-azul-escuro)]/30 hover:text-[var(--color-azul-escuro)]/60 mt-4 transition-colors">
            Voltar
          </button>
        </div>
      </div>
    )
  }

  // Registration form
  return (
    <div className="max-w-md mx-auto px-4 pt-4">
      <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-[var(--color-azul-escuro)]/35 hover:text-[var(--color-azul-escuro)] mb-8 transition-colors">
        <ArrowLeft className="h-4 w-4" weight="bold" /> Voltar aos planos
      </button>

      <div className="bg-[var(--color-surface-lowest)] rounded-[2rem] p-8 shadow-[0_16px_48px_-12px_rgba(48,51,66,0.06)]">
        {/* Plan summary — tonal shift */}
        <div className="bg-[var(--color-surface-low)] rounded-xl p-5 mb-7">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-bold text-[var(--color-azul-escuro)]">Plano {planLabels[planId]}</p>
              {couponCode && <p className="text-xs text-emerald-600 mt-0.5 font-medium">Cupom: {couponCode}</p>}
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-[var(--color-azul-escuro)]">R$ {plan.price.toFixed(2)}</p>
              {plan.intervalCount > 1 && <p className="text-xs text-[var(--color-azul-escuro)]/30">R$ {plan.priceMonthly.toFixed(2)}/mes</p>}
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold text-[var(--color-azul-escuro)] tracking-tight mb-1">Crie sua conta</h2>
        <p className="text-sm text-[var(--color-azul-escuro)]/35 mb-7">Preencha seus dados para continuar.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">{error}</div>}

          <div className="space-y-2">
            <Label className="text-xs font-semibold text-[var(--color-azul-escuro)]/50 uppercase tracking-wider">Nome completo</Label>
            <Input placeholder="Seu nome" className="bg-[var(--color-surface-low)] h-12 rounded-xl text-[var(--color-azul-escuro)] placeholder:text-[var(--color-azul-escuro)]/20 focus-visible:ring-[var(--color-rosa)]/30 focus-visible:bg-[var(--color-surface-lowest)]" {...register('name')} />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold text-[var(--color-azul-escuro)]/50 uppercase tracking-wider">E-mail</Label>
            <Input type="email" placeholder="seu@email.com" className="bg-[var(--color-surface-low)] h-12 rounded-xl text-[var(--color-azul-escuro)] placeholder:text-[var(--color-azul-escuro)]/20 focus-visible:ring-[var(--color-rosa)]/30 focus-visible:bg-[var(--color-surface-lowest)]" {...register('email')} />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold text-[var(--color-azul-escuro)]/50 uppercase tracking-wider">Senha</Label>
            <Input type="password" placeholder="Mínimo 6 caracteres" className="bg-[var(--color-surface-low)] h-12 rounded-xl text-[var(--color-azul-escuro)] placeholder:text-[var(--color-azul-escuro)]/20 focus-visible:ring-[var(--color-rosa)]/30 focus-visible:bg-[var(--color-surface-lowest)]" {...register('password')} />
            {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold text-[var(--color-azul-escuro)]/50 uppercase tracking-wider">Confirmar senha</Label>
            <Input type="password" placeholder="Repita a senha" className="bg-[var(--color-surface-low)] h-12 rounded-xl text-[var(--color-azul-escuro)] placeholder:text-[var(--color-azul-escuro)]/20 focus-visible:ring-[var(--color-rosa)]/30 focus-visible:bg-[var(--color-surface-lowest)]" {...register('confirmPassword')} />
            {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold text-[var(--color-azul-escuro)]/50 uppercase tracking-wider">Telefone / WhatsApp <span className="text-[var(--color-azul-escuro)]/20">(opcional)</span></Label>
            <Input
              type="tel" placeholder="(11) 99999-9999" value={phone}
              onChange={(e) => { const f = formatPhone(e.target.value); setPhone(f); setValue('phone', f) }}
              className="bg-[var(--color-surface-low)] h-12 rounded-xl text-[var(--color-azul-escuro)] placeholder:text-[var(--color-azul-escuro)]/20 focus-visible:ring-[var(--color-rosa)]/30 focus-visible:bg-[var(--color-surface-lowest)]"
            />
          </div>

          <div className="flex items-start gap-3 pt-1">
            <input type="checkbox" id="terms" className="mt-1 h-4 w-4 rounded accent-[var(--color-rosa)]" {...register('acceptedTerms')} />
            <label htmlFor="terms" className="text-sm text-[var(--color-azul-escuro)]/40 leading-tight">
              Li e aceito os <a href="/termos" target="_blank" className="text-[var(--color-laranja)] font-medium underline">Termos de Uso</a> e <a href="/privacidade" target="_blank" className="text-[var(--color-laranja)] font-medium underline">Politica de Privacidade</a>
            </label>
          </div>
          {errors.acceptedTerms && <p className="text-xs text-red-500">{errors.acceptedTerms.message}</p>}

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

export default function CadastroPage() {
  return (
    <Suspense fallback={<div className="min-h-[100dvh] bg-[var(--color-surface)] flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-[var(--color-laranja)]" /></div>}>
      <CadastroContent />
    </Suspense>
  )
}
