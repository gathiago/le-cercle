export type PlanId = 'monthly' | 'quarterly' | 'yearly' | 'premium'

export interface Plan {
  id: PlanId
  name: string
  price: number
  priceMonthly: number
  interval: 'month' | 'quarter' | 'year'
  intervalCount: number
  features: string[]
  isPremium: boolean
  badge?: string
  savings?: string
}

export const PLANS: Plan[] = [
  {
    id: 'monthly',
    name: 'Mensal',
    price: Number(process.env.NEXT_PUBLIC_PRICE_MONTHLY) || 49.90,
    priceMonthly: Number(process.env.NEXT_PUBLIC_PRICE_MONTHLY) || 49.90,
    interval: 'month',
    intervalCount: 1,
    features: [
      'Conteúdo semanal exclusivo',
      'Comunidade Le Cercle',
      'Encontros online ao vivo',
    ],
    isPremium: false,
  },
  {
    id: 'quarterly',
    name: 'Trimestral',
    price: Number(process.env.NEXT_PUBLIC_PRICE_QUARTERLY) || 127.70,
    priceMonthly: Number(process.env.NEXT_PUBLIC_PRICE_QUARTERLY_MONTHLY) || 42.57,
    interval: 'quarter',
    intervalCount: 3,
    features: [
      'Tudo do plano Mensal',
      'Material de apoio PDF',
      'Economia de ~15%',
    ],
    isPremium: false,
    badge: 'ECONOMIZE 15%',
    savings: '15%',
  },
  {
    id: 'yearly',
    name: 'Anual',
    price: Number(process.env.NEXT_PUBLIC_PRICE_YEARLY) || 419.90,
    priceMonthly: Number(process.env.NEXT_PUBLIC_PRICE_YEARLY_MONTHLY) || 34.99,
    interval: 'year',
    intervalCount: 12,
    features: [
      'Tudo do plano Mensal',
      'Prioridade nos encontros',
      'Economia de ~30%',
    ],
    isPremium: false,
    badge: 'MAIS POPULAR',
    savings: '30%',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: Number(process.env.NEXT_PUBLIC_PRICE_PREMIUM) || 899.90,
    priceMonthly: Number(process.env.NEXT_PUBLIC_PRICE_PREMIUM_MONTHLY) || 74.99,
    interval: 'year',
    intervalCount: 12,
    features: [
      'Acesso total a tudo',
      'Encontros presenciais',
      'Experiência exclusiva',
    ],
    isPremium: true,
    badge: 'EXCLUSIVO',
  },
]

export function getPlanById(id: PlanId): Plan | undefined {
  return PLANS.find(p => p.id === id)
}
