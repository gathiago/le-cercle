'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, ArrowLeft, CheckCircle } from 'lucide-react'

const emailSchema = z.object({
  email: z.string().email('E-mail inválido'),
})

const resetSchema = z.object({
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
})

function ForgotPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [resetDone, setResetDone] = useState(false)
  const [error, setError] = useState('')

  const emailForm = useForm({ resolver: zodResolver(emailSchema) })
  const resetForm = useForm({ resolver: zodResolver(resetSchema) })

  async function onRequestReset(data: { email: string }) {
    setLoading(true)
    await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    setSent(true)
    setLoading(false)
  }

  async function onResetPassword(data: { password: string }) {
    setLoading(true)
    setError('')
    const res = await fetch('/api/auth/forgot-password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password: data.password }),
    })
    if (res.ok) {
      setResetDone(true)
    } else {
      const body = await res.json()
      setError(body.error || 'Erro ao redefinir senha')
    }
    setLoading(false)
  }

  // Reset done
  if (resetDone) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-[0_4px_24px_rgba(48,51,66,0.06)] text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-8 w-8 text-green-500" />
        </div>
        <h2 className="text-2xl font-semibold text-[var(--color-azul-escuro)] mb-3">Senha redefinida!</h2>
        <p className="text-muted-foreground mb-6">Sua senha foi alterada com sucesso.</p>
        <Link href="/login" className="inline-flex items-center justify-center h-12 px-8 rounded-xl bg-[var(--color-laranja)] hover:bg-[var(--color-laranja-hover)] text-white font-semibold">
          Fazer login
        </Link>
      </div>
    )
  }

  // Has token: show reset form
  if (token) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-[0_4px_24px_rgba(48,51,66,0.06)]">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-[var(--color-azul-escuro)]">Nova senha</h2>
          <p className="text-muted-foreground mt-2">Escolha sua nova senha.</p>
        </div>

        <form onSubmit={resetForm.handleSubmit(onResetPassword)} className="space-y-5">
          {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">{error}</div>}

          <div className="space-y-2">
            <Label>Nova senha</Label>
            <Input type="password" placeholder="Mínimo 6 caracteres" className="bg-[var(--color-surface-low)] border-none h-12 rounded-xl" {...resetForm.register('password')} />
            {resetForm.formState.errors.password && <p className="text-xs text-red-500">{resetForm.formState.errors.password.message?.toString()}</p>}
          </div>

          <div className="space-y-2">
            <Label>Confirmar nova senha</Label>
            <Input type="password" placeholder="Repita a senha" className="bg-[var(--color-surface-low)] border-none h-12 rounded-xl" {...resetForm.register('confirmPassword')} />
            {resetForm.formState.errors.confirmPassword && <p className="text-xs text-red-500">{resetForm.formState.errors.confirmPassword.message?.toString()}</p>}
          </div>

          <Button type="submit" disabled={loading} className="w-full h-12 rounded-xl bg-[var(--color-laranja)] hover:bg-[var(--color-laranja-hover)] text-white font-semibold text-base">
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Redefinir senha'}
          </Button>
        </form>
      </div>
    )
  }

  // Email sent
  if (sent) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-[0_4px_24px_rgba(48,51,66,0.06)] text-center">
        <div className="w-16 h-16 bg-[var(--color-rosa-light)] rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[var(--color-rosa)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-[var(--color-azul-escuro)] mb-3">E-mail enviado!</h2>
        <p className="text-muted-foreground mb-6">Se existe uma conta com esse e-mail, você receberá um link para redefinir sua senha.</p>
        <Link href="/login" className="text-[var(--color-laranja)] font-medium hover:text-[var(--color-laranja-hover)]">
          Voltar para o login
        </Link>
      </div>
    )
  }

  // Request form
  return (
    <div className="bg-white rounded-2xl p-8 shadow-[0_4px_24px_rgba(48,51,66,0.06)]">
      <Link href="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[var(--color-azul-escuro)] mb-6">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-[var(--color-azul-escuro)]">Esqueceu sua senha?</h2>
        <p className="text-muted-foreground mt-2">Informe seu e-mail e enviaremos um link de recuperação.</p>
      </div>

      <form onSubmit={emailForm.handleSubmit(onRequestReset)} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="seu@email.com" className="bg-[var(--color-surface-low)] border-none h-12 rounded-xl focus-visible:ring-[var(--color-rosa)]" {...emailForm.register('email')} />
          {emailForm.formState.errors.email && <p className="text-sm text-red-500">{emailForm.formState.errors.email.message?.toString()}</p>}
        </div>
        <Button type="submit" disabled={loading} className="w-full h-12 rounded-xl bg-[var(--color-laranja)] hover:bg-[var(--color-laranja-hover)] text-white font-semibold text-base">
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Enviar link'}
        </Button>
      </form>
    </div>
  )
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={
      <div className="bg-white rounded-2xl p-8 shadow-[0_4px_24px_rgba(48,51,66,0.06)] flex justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[var(--color-laranja)]" />
      </div>
    }>
      <ForgotPasswordContent />
    </Suspense>
  )
}
