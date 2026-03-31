import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

const publicRoutes = ['/checkout', '/login', '/forgot-password', '/termos', '/privacidade', '/resumos-verbais']
const apiPublicRoutes = ['/api/auth', '/api/webhooks', '/api/coupons/validate', '/api/checkout']

export default auth((req) => {
  const { nextUrl } = req
  const session = req.auth
  const pathname = nextUrl.pathname

  // Allow public routes
  if (publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))) {
    return NextResponse.next()
  }

  // Allow public API routes
  if (apiPublicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Allow static files and Next.js internals
  if (pathname.startsWith('/_next') || pathname.startsWith('/fonts') || pathname.includes('.')) {
    return NextResponse.next()
  }

  // Root: landing page for visitors, dashboard for logged-in
  if (pathname === '/') {
    if (session?.user) {
      return NextResponse.redirect(new URL('/dashboard', nextUrl))
    }
    return NextResponse.next()
  }

  // No session -> login
  if (!session?.user) {
    return NextResponse.redirect(new URL('/login', nextUrl))
  }

  const user = session.user

  // Admin bypass: admins skip subscription and onboarding checks
  if (pathname.startsWith('/admin')) {
    if (user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', nextUrl))
    }
    return NextResponse.next()
  }

  // Subscription check (members only)
  if (user.subscriptionStatus !== 'ACTIVE') {
    if (!pathname.startsWith('/api')) {
      return NextResponse.redirect(new URL('/checkout', nextUrl))
    }
    return NextResponse.next()
  }

  // Onboarding check (members only)
  if (!user.onboardingDone) {
    if (!pathname.startsWith('/onboarding') && !pathname.startsWith('/api')) {
      return NextResponse.redirect(new URL('/onboarding', nextUrl))
    }
    return NextResponse.next()
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|fonts|images).*)'],
}
