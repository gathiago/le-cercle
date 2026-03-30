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

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
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
    <div className="bg-white rounded-2xl p-8 shadow-[0_4px_24px_rgba(48,51,66,0.06)]">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-[var(--color-azul-escuro)]">
          Bon retour!
        </h2>
        <p className="text-muted-foreground mt-2">
          Entre na sua conta para continuar sua jornada.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {error && (
          <div className="bg-[var(--color-rosa-light)] text-[var(--color-azul-escuro)] px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            className="bg-[var(--color-surface-low)] border-none h-12 rounded-xl focus-visible:ring-[var(--color-rosa)]"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Senha</Label>
            <Link
              href="/forgot-password"
              className="text-sm text-[var(--color-laranja)] hover:text-[var(--color-laranja-hover)]"
            >
              Esqueceu a senha?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            className="bg-[var(--color-surface-low)] border-none h-12 rounded-xl focus-visible:ring-[var(--color-rosa)]"
            {...register('password')}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-xl bg-[var(--color-laranja)] hover:bg-[var(--color-laranja-hover)] text-white font-semibold text-base"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Entrar'}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Ainda não é membro?{' '}
        <a href="/checkout" className="text-[var(--color-laranja)] font-medium hover:text-[var(--color-laranja-hover)]">
          Assine agora
        </a>
      </p>
    </div>
  )
}
