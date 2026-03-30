import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
      level: string
      subscriptionStatus: string
      subscriptionPlan: string | null
      onboardingDone: boolean
      avatarUrl: string | null
    }
  }

  interface User {
    role?: string
    level?: string
    subscriptionStatus?: string
    subscriptionPlan?: string | null
    onboardingDone?: boolean
    avatarUrl?: string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: string
    level: string
    subscriptionStatus: string
    subscriptionPlan: string | null
    onboardingDone: boolean
    avatarUrl: string | null
  }
}
