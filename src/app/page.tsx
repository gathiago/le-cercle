import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'

export default async function Home() {
  const session = await auth()

  if (session?.user) {
    if (session.user.subscriptionStatus !== 'ACTIVE') {
      redirect('/checkout')
    }
    if (!(session.user as any).onboardingDone) {
      redirect('/onboarding')
    }
    redirect('/dashboard')
  }

  redirect('/checkout')
}
