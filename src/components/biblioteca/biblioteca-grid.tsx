'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BookOpen, Search } from 'lucide-react'

interface Week {
  id: string
  weekNumber: number
  title: string
  description: string
  level: string
  isActive: boolean
}

const levelColors: Record<string, string> = {
  INICIANTE: 'bg-green-100 text-green-700',
  INTERMEDIARIO: 'bg-[var(--color-laranja-light)] text-[var(--color-laranja)]',
  AVANCADO: 'bg-[var(--color-rosa-light)] text-[var(--color-rosa)]',
}

export function BibliotecaGrid({ weeks }: { weeks: Week[] }) {
  const [search, setSearch] = useState('')
  const [filterLevel, setFilterLevel] = useState<string>('all')

  const filtered = weeks.filter(w => {
    const matchSearch = w.title.toLowerCase().includes(search.toLowerCase()) ||
      w.description.toLowerCase().includes(search.toLowerCase())
    const matchLevel = filterLevel === 'all' || w.level === filterLevel
    return matchSearch && matchLevel
  })

  return (
    <>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por título ou descrição..."
            className="pl-9 bg-white border-none rounded-xl shadow-[0_2px_12px_rgba(48,51,66,0.04)]"
          />
        </div>
        <Select value={filterLevel} onValueChange={v => setFilterLevel(v ?? 'all')}>
          <SelectTrigger className="w-[160px] bg-white border-none rounded-xl shadow-[0_2px_12px_rgba(48,51,66,0.04)]">
            <SelectValue placeholder="Nível" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os níveis</SelectItem>
            <SelectItem value="INICIANTE">Iniciante</SelectItem>
            <SelectItem value="INTERMEDIARIO">Intermediário</SelectItem>
            <SelectItem value="AVANCADO">Avançado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p>Nenhum conteúdo encontrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((week) => (
            <Link
              key={week.id}
              href={`/semana/${week.weekNumber}`}
              className="bg-white rounded-2xl p-6 shadow-[0_4px_24px_rgba(48,51,66,0.06)] hover:shadow-[0_8px_32px_rgba(48,51,66,0.1)] transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                  Semana {String(week.weekNumber).padStart(2, '0')}
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${levelColors[week.level]}`}>
                  {week.level === 'INTERMEDIARIO' ? 'Intermediário' : week.level === 'AVANCADO' ? 'Avançado' : 'Iniciante'}
                </span>
              </div>
              <h3 className="font-bold text-[var(--color-azul-escuro)] mb-2">{week.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{week.description}</p>
              {week.isActive && (
                <span className="inline-block mt-3 text-xs font-semibold text-[var(--color-laranja)]">
                  Semana atual →
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
