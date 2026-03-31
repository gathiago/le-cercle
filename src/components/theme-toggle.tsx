'use client'

import { useState, useEffect } from 'react'
import { Moon, Sun } from '@phosphor-icons/react'

export function ThemeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('le-cercle-theme')
    if (saved === 'dark') {
      setDark(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  function toggle() {
    const next = !dark
    setDark(next)
    if (next) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('le-cercle-theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('le-cercle-theme', 'light')
    }
  }

  return (
    <button
      onClick={toggle}
      className="relative p-2 rounded-xl hover:bg-[var(--color-surface-low)] transition-colors"
      title={dark ? 'Modo claro' : 'Modo escuro'}
    >
      {dark ? (
        <Sun className="h-5 w-5 text-[var(--color-laranja)]" weight="bold" />
      ) : (
        <Moon className="h-5 w-5 text-[var(--color-azul-escuro)]/40" weight="bold" />
      )}
    </button>
  )
}
