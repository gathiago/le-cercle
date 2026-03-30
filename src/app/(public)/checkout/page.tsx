'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PLANS, type Plan } from '@/lib/plans'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Check, Loader2, Sparkles, ArrowRight } from 'lucide-react'

export default function CheckoutPage() {
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState<string>('yearly')
  const [couponCode, setCouponCode] = useState('')
  const [couponValid, setCouponValid] = useState<boolean | null>(null)
  const [couponDiscount, setCouponDiscount] = useState<{ type: string; value: number } | null>(null)
  const [validatingCoupon, setValidatingCoupon] = useState(false)

  async function validateCoupon() {
    if (!couponCode.trim()) return
    setValidatingCoupon(true)
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, planId: selectedPlan }),
      })
      const data = await res.json()
      if (res.ok && data.valid) {
        setCouponValid(true)
        setCouponDiscount({ type: data.discountType, value: data.discountValue })
      } else {
        setCouponValid(false)
        setCouponDiscount(null)
      }
    } catch {
      setCouponValid(false)
    }
    setValidatingCoupon(false)
  }

  function handleContinue() {
    const params = new URLSearchParams({ plan: selectedPlan })
    if (couponValid && couponCode) params.set('coupon', couponCode)
    router.push(`/checkout/cadastro?${params.toString()}`)
  }

  function getDiscountedPrice(plan: Plan) {
    if (!couponDiscount || selectedPlan !== plan.id) return null
    if (couponDiscount.type === 'PERCENTAGE') {
      return plan.price * (1 - couponDiscount.value / 100)
    }
    return Math.max(0, plan.price - couponDiscount.value)
  }

  function getDiscountedMonthly(plan: Plan) {
    if (!couponDiscount || selectedPlan !== plan.id) return null
    const discountedTotal = getDiscountedPrice(plan)
    if (discountedTotal === null) return null
    return discountedTotal / plan.intervalCount
  }

  return (
    <div className="max-w-5xl mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-azul-escuro)] mb-3">
          Escolha seu plano
        </h2>
        <p className="text-muted-foreground text-lg">
          Torne-se parte da nossa curadoria exclusiva.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {PLANS.map((plan) => {
          const isSelected = selectedPlan === plan.id
          const isPopular = plan.id === 'yearly'
          const isPremium = plan.isPremium
          const discountedMonthly = getDiscountedMonthly(plan)
          const discountedTotal = getDiscountedPrice(plan)

          return (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative rounded-2xl p-6 cursor-pointer transition-all duration-300 ${
                isPremium
                  ? 'bg-[var(--color-azul-escuro)] text-white'
                  : 'bg-white'
              } ${
                isSelected && !isPremium
                  ? 'ring-2 ring-[var(--color-laranja)] shadow-[0_8px_32px_rgba(252,142,96,0.15)]'
                  : isSelected && isPremium
                  ? 'ring-2 ring-[var(--color-laranja)] shadow-[0_8px_32px_rgba(252,142,96,0.25)]'
                  : 'shadow-[0_4px_24px_rgba(48,51,66,0.06)]'
              }`}
            >
              {plan.badge && (
                <div className={`absolute -top-3 right-4 px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${
                  isPopular
                    ? 'bg-[var(--color-laranja)] text-white'
                    : isPremium
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-white'
                    : 'bg-[var(--color-rosa-light)] text-[var(--color-azul-escuro)]'
                }`}>
                  {plan.badge}
                </div>
              )}

              <p className={`text-xs font-semibold tracking-widest uppercase mb-4 ${
                isPremium ? 'text-[var(--color-laranja)]' : 'text-[var(--color-rosa)]'
              }`}>
                {plan.name}
              </p>

              <div className="mb-1">
                <span className={`text-sm ${isPremium ? 'text-white/60' : 'text-muted-foreground'}`}>R$</span>
                <span className={`text-4xl font-bold ${isPremium ? 'text-white' : 'text-[var(--color-azul-escuro)]'}`}>
                  {discountedMonthly !== null ? discountedMonthly.toFixed(2) : plan.priceMonthly.toFixed(2)}
                </span>
                <span className={`text-sm ${isPremium ? 'text-white/60' : 'text-muted-foreground'}`}>/mês</span>
              </div>

              {discountedMonthly !== null && (
                <p className="text-sm line-through text-muted-foreground">R$ {plan.priceMonthly.toFixed(2)}/mês</p>
              )}

              {plan.intervalCount > 1 && (
                <p className={`text-xs mt-1 ${isPremium ? 'text-white/50' : 'text-muted-foreground'}`}>
                  R$ {discountedTotal !== null ? discountedTotal.toFixed(2) : plan.price.toFixed(2)} cobrados{' '}
                  {plan.interval === 'quarter' ? 'a cada 3 meses' : 'anualmente'}
                </p>
              )}

              <ul className="mt-6 space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className={`h-4 w-4 mt-0.5 shrink-0 ${
                      isPremium ? 'text-[var(--color-laranja)]' : 'text-[var(--color-rosa)]'
                    }`} />
                    <span className={isPremium ? 'text-white/90' : ''}>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full mt-6 h-11 rounded-xl font-semibold ${
                  isPremium || isSelected
                    ? 'bg-[var(--color-laranja)] hover:bg-[var(--color-laranja-hover)] text-white'
                    : 'bg-[var(--color-surface-low)] text-[var(--color-azul-escuro)] hover:bg-[var(--color-rosa-light)]'
                }`}
                onClick={(e) => { e.stopPropagation(); setSelectedPlan(plan.id) }}
              >
                {isSelected ? 'Selecionado' : 'Selecionar'}
              </Button>
            </div>
          )
        })}
      </div>

      <div className="max-w-md mx-auto mb-8">
        <div className="flex gap-3">
          <Input
            placeholder="Tem cupom de desconto?"
            value={couponCode}
            onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponValid(null) }}
            className="bg-white border-none h-12 rounded-xl flex-1 shadow-[0_2px_12px_rgba(48,51,66,0.04)]"
          />
          <Button onClick={validateCoupon} disabled={validatingCoupon || !couponCode.trim()}
            variant="outline" className="h-12 rounded-xl px-6 bg-white border-none shadow-[0_2px_12px_rgba(48,51,66,0.04)]">
            {validatingCoupon ? <Loader2 className="h-4 w-4 animate-spin" /> : 'APLICAR'}
          </Button>
        </div>
        {couponValid === true && (
          <p className="text-sm text-green-600 mt-2 flex items-center gap-1"><Sparkles className="h-3 w-3" /> Cupom aplicado com sucesso!</p>
        )}
        {couponValid === false && (
          <p className="text-sm text-red-500 mt-2">Cupom inválido ou expirado.</p>
        )}
      </div>

      <div className="max-w-md mx-auto text-center">
        <Button
          onClick={handleContinue}
          className="h-14 px-12 rounded-2xl bg-gradient-to-r from-[var(--color-laranja)] to-[#ff9062] hover:opacity-90 text-white font-semibold text-lg shadow-[0_8px_32px_rgba(252,142,96,0.3)] w-full"
        >
          Continuar <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        <p className="text-xs text-muted-foreground mt-3">
          Já tem uma conta? <a href="/login" className="text-[var(--color-laranja)] font-medium">Entrar</a>
        </p>
      </div>
    </div>
  )
}
