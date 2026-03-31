'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PLANS, type Plan } from '@/lib/plans'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Check, ArrowRight } from '@phosphor-icons/react'
import { Loader2 } from 'lucide-react'

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
    if (couponDiscount.type === 'PERCENTAGE') return plan.price * (1 - couponDiscount.value / 100)
    return Math.max(0, plan.price - couponDiscount.value)
  }

  function getDiscountedMonthly(plan: Plan) {
    const d = getDiscountedPrice(plan)
    return d !== null ? d / plan.intervalCount : null
  }

  return (
    <div className="max-w-5xl mx-auto px-4 pt-8">
      {/* Header */}
      <div className="mb-14">
        <p className="text-[var(--color-rosa)] text-xs font-semibold tracking-[3px] uppercase mb-4">Planos</p>
        <h1 className="text-3xl md:text-[2.75rem] font-bold text-[var(--color-azul-escuro)] tracking-tight leading-[1.1]">
          Escolha seu plano
        </h1>
        <p className="text-[var(--color-azul-escuro)]/40 mt-3 max-w-[40ch]">
          Torne-se parte da nossa curadoria exclusiva. Cancele quando quiser.
        </p>
      </div>

      {/* Plan Cards — 2x2 grid, no 3-col */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-14">
        {PLANS.map((plan) => {
          const isSelected = selectedPlan === plan.id
          const isPremium = plan.isPremium
          const isPopular = plan.id === 'yearly'
          const dm = getDiscountedMonthly(plan)
          const dt = getDiscountedPrice(plan)

          return (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative rounded-[1.5rem] p-7 cursor-pointer transition-all ${
                isPremium ? 'bg-[var(--color-azul-escuro)]' : 'bg-[var(--color-surface-lowest)]'
              } ${
                isSelected && !isPremium
                  ? 'shadow-[0_8px_40px_-8px_rgba(255,159,175,0.25)]'
                  : isSelected && isPremium
                  ? 'shadow-[0_8px_40px_-8px_rgba(252,142,96,0.3)]'
                  : 'shadow-[0_4px_24px_-8px_rgba(48,51,66,0.04)]'
              }`}
              style={isSelected ? { outline: `2px solid ${isPremium ? 'var(--color-laranja)' : 'var(--color-rosa)'}` } : undefined}
            >
              {plan.badge && (
                <div className={`absolute -top-3 right-5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wide ${
                  isPopular ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-rosa)] text-white' :
                  isPremium ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-white' :
                  'bg-[var(--color-surface-low)] text-[var(--color-azul-escuro)]/60'
                }`}>
                  {plan.badge}
                </div>
              )}

              <div className="flex items-start justify-between mb-5">
                <p className={`text-xs font-semibold tracking-[2px] uppercase ${isPremium ? 'text-amber-400' : 'text-[var(--color-rosa)]'}`}>
                  {plan.name}
                </p>
                {/* Selection indicator */}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                  isSelected
                    ? 'bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-rosa)]'
                    : isPremium ? 'bg-white/10' : 'bg-[var(--color-surface-low)]'
                }`}>
                  {isSelected && <Check className="h-3.5 w-3.5 text-white" weight="bold" />}
                </div>
              </div>

              <div className="mb-1">
                <span className={`text-sm ${isPremium ? 'text-white/40' : 'text-[var(--color-azul-escuro)]/30'}`}>R$</span>
                <span className={`text-4xl font-bold tracking-tight ${isPremium ? 'text-white' : 'text-[var(--color-azul-escuro)]'}`}>
                  {dm !== null ? dm.toFixed(2) : plan.priceMonthly.toFixed(2)}
                </span>
                <span className={`text-sm ${isPremium ? 'text-white/40' : 'text-[var(--color-azul-escuro)]/30'}`}>/mes</span>
              </div>

              {dm !== null && (
                <p className={`text-sm line-through ${isPremium ? 'text-white/20' : 'text-[var(--color-azul-escuro)]/20'}`}>R$ {plan.priceMonthly.toFixed(2)}/mes</p>
              )}

              {plan.intervalCount > 1 && (
                <p className={`text-xs mt-1 ${isPremium ? 'text-white/25' : 'text-[var(--color-azul-escuro)]/30'}`}>
                  R$ {dt !== null ? dt.toFixed(2) : plan.price.toFixed(2)} cobrados {plan.interval === 'quarter' ? 'por trimestre' : 'anualmente'}
                </p>
              )}

              <ul className="mt-6 space-y-2.5">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm">
                    <Check className={`h-4 w-4 mt-0.5 shrink-0 ${isPremium ? 'text-amber-400' : 'text-[var(--color-rosa)]'}`} weight="bold" />
                    <span className={isPremium ? 'text-white/60' : 'text-[var(--color-azul-escuro)]/55'}>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>

      {/* Coupon */}
      <div className="max-w-md mx-auto mb-10">
        <div className="flex gap-3">
          <Input
            placeholder="Tem cupom de desconto?"
            value={couponCode}
            onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponValid(null) }}
            className="bg-[var(--color-surface-lowest)] h-12 rounded-xl flex-1 shadow-[0_4px_12px_rgba(48,51,66,0.03)] placeholder:text-[var(--color-azul-escuro)]/25"
          />
          <Button onClick={validateCoupon} disabled={validatingCoupon || !couponCode.trim()}
            variant="outline" className="h-12 rounded-xl px-6 bg-[var(--color-surface-lowest)] shadow-[0_4px_12px_rgba(48,51,66,0.03)] text-[var(--color-azul-escuro)] font-semibold">
            {validatingCoupon ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Aplicar'}
          </Button>
        </div>
        {couponValid === true && <p className="text-sm text-emerald-600 mt-2 font-medium">Cupom aplicado com sucesso</p>}
        {couponValid === false && <p className="text-sm text-red-500 mt-2">Cupom inválido ou expirado.</p>}
      </div>

      {/* CTA */}
      <div className="max-w-md mx-auto text-center">
        <button
          onClick={handleContinue}
          className="group w-full inline-flex items-center justify-center h-14 rounded-xl bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-laranja)] text-white font-semibold text-lg transition-all active:scale-[0.98] shadow-[0_12px_32px_rgba(252,142,96,0.25)]"
          style={{ borderTop: '1px solid rgba(255,255,255,0.2)' }}
        >
          Continuar
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-0.5 transition-transform" weight="bold" />
        </button>
        <p className="text-xs text-[var(--color-azul-escuro)]/25 mt-4">
          Já tem uma conta? <a href="/login" className="text-[var(--color-laranja)] font-medium">Entrar</a>
        </p>
      </div>
    </div>
  )
}
