import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { PlatformSidebar } from '@/components/layout/platform-sidebar'
import { PlatformMobileNav } from '@/components/layout/platform-mobile-nav'
import { PlatformHeader } from '@/components/layout/platform-header'

export default async function PlatformLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  return (
    <div className="min-h-[100dvh] bg-[var(--color-surface)]">
      {/* Desktop Sidebar — azul escuro, no borders */}
      <aside className="fixed left-0 top-0 bottom-0 w-[240px] hidden lg:flex flex-col bg-[#303342] dark:bg-[#111115] z-40">
        <PlatformSidebar user={session.user} />
      </aside>

      <div className="lg:ml-[240px] min-h-[100dvh] flex flex-col">
        <PlatformHeader user={session.user} />
        <main className="flex-1 px-5 md:px-8 py-6 pb-28 lg:pb-8">
          {children}
        </main>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40">
        <PlatformMobileNav />
      </div>
    </div>
  )
}
