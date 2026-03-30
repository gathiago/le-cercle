export type { Plan, PlanId } from '@/lib/plans'

export interface OnboardingAnswers {
  q1: number
  q2: number
  q3: number
  q4: number
  q5: number
  q6: number
  blockReason: string
  openAnswer: string
}

export type UserLevel = 'INICIANTE' | 'INTERMEDIARIO' | 'AVANCADO'
export type UserRole = 'MEMBER' | 'ADMIN'
export type SubscriptionStatus = 'ACTIVE' | 'INACTIVE' | 'PAST_DUE' | 'CANCELED'

export interface SessionUser {
  id: string
  email: string
  name: string
  level: UserLevel
  role: UserRole
  subscriptionStatus: SubscriptionStatus
  subscriptionPlan: string | null
  onboardingDone: boolean
  avatarUrl: string | null
}
