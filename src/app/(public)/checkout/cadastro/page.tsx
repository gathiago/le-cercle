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
import { Loader2, ArrowLeft, CreditCard, Shield, CheckCircle } from 'lucide-react'

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

  if (!plan) {
    router.push('/checkout')
    return null
  }

  const planLabels: Record<string, string> = {
    monthly: 'Mensal', quarterly: 'Trimestral', yearly: 'Anual', premium: 'Premium',
  }

  function onSubmit(data: FormData) {
    setFormData(data)
    setPaying(true)
  }

  async function handleSimulatePayment() {
    if (!formData) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/checkout/simulate-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone || null,
          plan: planId,
          couponCode: couponCode || null,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Erro ao processar pagamento')
        setLoading(false)
        return
      }

      // Auto-login after payment
      await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      router.push('/checkout/sucesso')
    } catch {
      setError('Erro inesperado. Tente novamente.')
      setLoading(false)
    }
  }

  // Payment simulation screen
  if (paying && formData) {
    return (
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white rounded-2xl p-8 shadow-[0_4px_24px_rgba(48,51,66,0.06)]">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-[var(--color-laranja-light)] flex items-center justify-center mx-auto mb-4">
              <CreditCard className="h-8 w-8 text-[var(--color-laranja)]" />
            </div>
            <h2 className="text-xl font-bold text-[var(--color-azul-escuro)]">Confirmar Pagamento</h2>
            <p className="text-sm text-muted-foreground mt-1">Revise os dados e confirme</p>
          </div>

          <div className="bg-[var(--color-surface-low)] rounded-xl p-4 mb-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Plano</span>
              <span className="font-semibold text-[var(--color-azul-escuro)]">{planLabels[planId]}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Valor</span>
              <span className="font-bold text-[var(--color-azul-escuro)]">R$ {plan.price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Nome</span>
              <span className="text-[var(--color-azul-escuro)]">{formData.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">E-mail</span>
              <span className="text-[var(--color-azul-escuro)]">{formData.email}</span>
            </div>
          </div>

          {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm mb-4">{error}</div>}

          <div className="space-y-3">
            {/* Simulated payment methods */}
            <div className="border border-green-200 bg-green-50 rounded-xl p-3 flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-green-800">PIX - Aprovação Instantânea</p>
                <p className="text-xs text-green-600">Pagamento simulado para demonstração</p>
              </div>
            </div>

            <Button
              onClick={handleSimulatePayment}
              disabled={loading}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 hover:opacity-90 text-white font-semibold text-lg shadow-[0_8px_32px_rgba(34,197,94,0.3)]"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                <>
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Confirmar Pagamento
                </>
              )}
            </Button>

            <button
              onClick={() => setPaying(false)}
              className="w-full text-center text-sm text-muted-foreground hover:text-[var(--color-azul-escuro)]"
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Registration form
  return (
    <div className="max-w-md mx-auto px-4">
      <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-[var(--color-azul-escuro)] mb-6">
        <ArrowLeft className="h-4 w-4" /> Voltar aos planos
      </button>

      <div className="bg-white rounded-2xl p-8 shadow-[0_4px_24px_rgba(48,51,66,0.06)]">
        <div className="bg-[var(--color-surface-low)] rounded-xl p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-semibold text-[var(--color-azul-escuro)]">Plano {planLabels[planId]}</p>
              {couponCode && <p className="text-xs text-green-600 mt-0.5">Cupom: {couponCode}</p>}
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-[var(--color-azul-escuro)]">R$ {plan.price.toFixed(2)}</p>
              {plan.intervalCount > 1 && (
                <p className="text-xs text-muted-foreground">R$ {plan.priceMonthly.toFixed(2)}/mês</p>
              )}
            </div>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-[var(--color-azul-escuro)] mb-1">Crie sua conta</h2>
        <p className="text-sm text-muted-foreground mb-6">Preencha seus dados para continuar.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">{error}</div>}

          <div className="space-y-2">
            <Label>Nome completo *</Label>
            <Input placeholder="Seu nome" className="bg-[var(--color-surface-low)] border-none h-12 rounded-xl" {...register('name')} />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>E-mail *</Label>
            <Input type="email" placeholder="seu@email.com" className="bg-[var(--color-surface-low)] border-none h-12 rounded-xl" {...register('email')} />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Senha *</Label>
            <Input type="password" placeholder="Mínimo 6 caracteres" className="bg-[var(--color-surface-low)] border-none h-12 rounded-xl" {...register('password')} />
            {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Confirmar senha *</Label>
            <Input type="password" placeholder="Repita a senha" className="bg-[var(--color-surface-low)] border-none h-12 rounded-xl" {...register('confirmPassword')} />
            {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Telefone / WhatsApp <span className="text-muted-foreground">(opcional)</span></Label>
            <Input
              type="tel"
              placeholder="(11) 99999-9999"
              value={phone}
              onChange={(e) => {
                const formatted = formatPhone(e.target.value)
                setPhone(formatted)
                setValue('phone', formatted)
              }}
              className="bg-[var(--color-surface-low)] border-none h-12 rounded-xl"
            />
          </div>

          <div className="flex items-start gap-3 pt-2">
            <input
              type="checkbox"
              id="terms"
              className="mt-1 h-4 w-4 rounded border-gray-300 text-[var(--color-laranja)] focus:ring-[var(--color-laranja)]"
              {...register('acceptedTerms')}
            />
            <label htmlFor="terms" className="text-sm text-muted-foreground leading-tight">
              Li e aceito os{' '}
              <a href="/termos" target="_blank" className="text-[var(--color-laranja)] underline">Termos de Uso</a>
              {' '}e{' '}
              <a href="/privacidade" target="_blank" className="text-[var(--color-laranja)] underline">Política de Privacidade</a>
            </label>
          </div>
          {errors.acceptedTerms && <p className="text-xs text-red-500">{errors.acceptedTerms.message}</p>}

          <Button
            type="submit"
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-[var(--color-laranja)] to-[#ff9062] hover:opacity-90 text-white font-semibold text-lg shadow-[0_8px_32px_rgba(252,142,96,0.3)] mt-2"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Ir para pagamento
          </Button>

          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-1">
            <Shield className="h-3 w-3" />
            Pagamento seguro
          </div>
        </form>
      </div>
    </div>
  )
}

export default function CadastroPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--color-surface)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--color-laranja)]" />
      </div>
    }>
      <CadastroContent />
    </Suspense>
  )
}
