import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { Bell, Search } from 'lucide-react'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/dashboard')

  const firstName = session.user.name?.split(' ')[0] || 'Admin'
  const initial = session.user.name?.charAt(0).toUpperCase() || 'A'

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex">
      {/* Sidebar */}
      <aside className="w-[240px] bg-white shrink-0 hidden md:flex flex-col border-r border-gray-100 fixed h-screen z-10">
        <AdminSidebar userName={session.user.name || 'Admin'} />
      </aside>

      {/* Main */}
      <div className="flex-1 md:ml-[240px] flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-[var(--color-azul-escuro)]">Le Cercle</h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nome ou email..."
                className="pl-10 pr-4 py-2 bg-[#F5F5F7] rounded-xl text-sm w-[260px] border-none outline-none focus:ring-2 focus:ring-[var(--color-rosa)]/30"
              />
            </div>
            <button className="relative p-2 rounded-xl hover:bg-[#F5F5F7] transition-colors">
              <Bell className="h-5 w-5 text-gray-500" />
            </button>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--color-rosa)] to-[var(--color-laranja)] flex items-center justify-center text-white text-sm font-bold">
              {initial}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 lg:p-8">{children}</main>

        {/* Footer */}
        <footer className="px-6 py-4 border-t border-gray-100 bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-rosa)] to-[var(--color-laranja)] flex items-center justify-center text-white text-xs font-bold">
              {initial}
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--color-azul-escuro)]">{session.user.name}</p>
              <a href="/api/auth/signout" className="text-[10px] text-[var(--color-rosa)] font-semibold uppercase tracking-wider hover:underline">Sair</a>
            </div>
          </div>
          <p className="text-xs text-gray-400">&copy; 2026 LE CERCLE &mdash; IDIOMAS COM MARDIA</p>
        </footer>
      </div>
    </div>
  )
}
