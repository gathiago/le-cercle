'use client'

import { signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/login' })}
      className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-medium text-red-500 bg-red-50/50 hover:bg-red-50 transition-colors"
    >
      <LogOut className="h-4 w-4" />
      Sair da conta
    </button>
  )
}
