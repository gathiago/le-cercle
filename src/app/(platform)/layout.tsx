import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { PlatformSidebar } from '@/components/layout/platform-sidebar'
import { PlatformMobileNav } from '@/components/layout/platform-mobile-nav'
import { PlatformHeader } from '@/components/layout/platform-header'

export default async function PlatformLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-[220px] hidden lg:flex flex-col bg-[var(--color-azul-escuro)] z-40">
        <PlatformSidebar user={session.user} />
      </aside>

      {/* Main Content */}
      <div className="lg:ml-[220px] min-h-screen flex flex-col">
        <PlatformHeader user={session.user} />
        <main className="flex-1 px-4 md:px-8 py-6 pb-24 lg:pb-6">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40">
        <PlatformMobileNav />
      </div>
    </div>
  )
}
