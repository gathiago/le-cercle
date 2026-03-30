import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user) return null

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        )

        if (!passwordMatch) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          level: user.level,
          subscriptionStatus: user.subscriptionStatus,
          subscriptionPlan: user.subscriptionPlan,
          onboardingDone: user.onboardingDone,
          avatarUrl: user.avatarUrl,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
        token.level = (user as any).level
        token.subscriptionStatus = (user as any).subscriptionStatus
        token.subscriptionPlan = (user as any).subscriptionPlan
        token.onboardingDone = (user as any).onboardingDone
        token.avatarUrl = (user as any).avatarUrl
      }

      if (trigger === 'update' && session) {
        token.level = session.level ?? token.level
        token.subscriptionStatus = session.subscriptionStatus ?? token.subscriptionStatus
        token.subscriptionPlan = session.subscriptionPlan ?? token.subscriptionPlan
        token.onboardingDone = session.onboardingDone ?? token.onboardingDone
        token.avatarUrl = session.avatarUrl ?? token.avatarUrl
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.level = token.level as string
        session.user.subscriptionStatus = token.subscriptionStatus as string
        session.user.subscriptionPlan = token.subscriptionPlan as string | null
        session.user.onboardingDone = token.onboardingDone as boolean
        session.user.avatarUrl = token.avatarUrl as string | null
      }
      return session
    },
  },
})
