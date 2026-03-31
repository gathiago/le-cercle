'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { ArrowRight } from '@phosphor-icons/react'

const loginSchema = z.object({
  email: z.string().email('E-mail invalido'),
  password: z.string().min(6, 'Minimo 6 caracteres'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginForm) {
    setLoading(true)
    setError('')

    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    })

    if (result?.error) {
      setError('E-mail ou senha incorretos')
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[var(--color-azul-escuro)] tracking-tight">
          Bon retour!
        </h2>
        <p className="text-[var(--color-azul-escuro)]/40 mt-2">
          Entre na sua conta para continuar sua jornada.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {error && (
          <div className="bg-[var(--color-rosa-light)] text-[var(--color-primary)] px-4 py-3 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label className="text-xs font-semibold text-[var(--color-azul-escuro)]/50 uppercase tracking-wider">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            className="bg-[var(--color-surface-low)] h-12 rounded-xl text-[var(--color-azul-escuro)] placeholder:text-[var(--color-azul-escuro)]/20 focus-visible:ring-[var(--color-rosa)]/30 focus-visible:bg-[var(--color-surface-lowest)]"
            {...register('email')}
          />
          {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold text-[var(--color-azul-escuro)]/50 uppercase tracking-wider">Senha</Label>
            <Link href="/forgot-password" className="text-xs text-[var(--color-laranja)] font-medium hover:text-[var(--color-laranja-hover)] transition-colors">
              Esqueceu a senha?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="Sua senha"
            className="bg-[var(--color-surface-low)] h-12 rounded-xl text-[var(--color-azul-escuro)] placeholder:text-[var(--color-azul-escuro)]/20 focus-visible:ring-[var(--color-rosa)]/30 focus-visible:bg-[var(--color-surface-lowest)]"
            {...register('password')}
          />
          {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-13 rounded-xl bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-laranja)] text-white font-semibold text-base shadow-[0_12px_32px_rgba(252,142,96,0.25)] active:scale-[0.98] transition-all"
          style={{ borderTop: '1px solid rgba(255,255,255,0.2)' }}
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
            <>Entrar <ArrowRight className="ml-2 h-4 w-4" weight="bold" /></>
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-[var(--color-azul-escuro)]/30 mt-8">
        Ainda nao e membro?{' '}
        <Link href="/checkout" className="text-[var(--color-laranja)] font-semibold hover:text-[var(--color-laranja-hover)] transition-colors">
          Assine agora
        </Link>
      </p>
    </div>
  )
}
