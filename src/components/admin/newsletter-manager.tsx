'use client'

import { useState } from 'react'
import { MagnifyingGlass, DownloadSimple, Trash, EnvelopeSimple } from '@phosphor-icons/react'

interface Subscriber {
  id: string
  email: string
  name: string | null
  source: string | null
  createdAt: string
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function NewsletterManager({ initialSubscribers }: { initialSubscribers: Subscriber[] }) {
  const [subscribers, setSubscribers] = useState(initialSubscribers)
  const [search, setSearch] = useState('')

  const filtered = subscribers.filter((s) =>
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    (s.name && s.name.toLowerCase().includes(search.toLowerCase()))
  )

  function exportCSV() {
    const header = 'Email,Nome,Fonte,Data'
    const rows = subscribers.map(
      (s) =>
        `"${s.email}","${s.name || ''}","${s.source || ''}","${formatDate(s.createdAt)}"`
    )
    const csv = [header, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `newsletter-subscribers-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  async function handleDelete(id: string) {
    if (!confirm('Remover este inscrito?')) return

    try {
      const res = await fetch('/api/admin/newsletter', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })

      if (res.ok) {
        setSubscribers((prev) => prev.filter((s) => s.id !== id))
      }
    } catch (err) {
      console.error('Erro ao remover inscrito:', err)
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats + Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-rosa)]/10 flex items-center justify-center">
            <EnvelopeSimple className="h-5 w-5 text-[var(--color-rosa)]" weight="bold" />
          </div>
          <div>
            <p className="text-2xl font-bold text-[var(--color-azul-escuro)]">{subscribers.length}</p>
            <p className="text-xs text-[var(--color-azul-escuro)]/40">inscritos</p>
          </div>
        </div>

        <button
          onClick={exportCSV}
          className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-[var(--color-surface-low)] text-sm font-medium text-[var(--color-azul-escuro)] hover:bg-[var(--color-rosa)]/10 hover:text-[var(--color-rosa)] transition-colors"
        >
          <DownloadSimple className="h-4 w-4" weight="bold" />
          Exportar CSV
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-azul-escuro)]/30" weight="bold" />
        <input
          type="text"
          placeholder="Buscar por e-mail ou nome..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-11 pl-11 pr-4 rounded-xl bg-[var(--color-surface-lowest)] text-sm text-[var(--color-azul-escuro)] placeholder:text-[var(--color-azul-escuro)]/25 outline-none focus:ring-2 focus:ring-[var(--color-rosa)]/30 transition-shadow"
        />
      </div>

      {/* Table */}
      <div className="bg-[var(--color-surface-lowest)] rounded-[2rem] overflow-hidden shadow-[0_8px_32px_rgba(48,51,66,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--color-surface-low)]">
                <th className="text-left px-6 py-3.5 font-semibold text-[var(--color-azul-escuro)]/60">Email</th>
                <th className="text-left px-6 py-3.5 font-semibold text-[var(--color-azul-escuro)]/60">Nome</th>
                <th className="text-left px-6 py-3.5 font-semibold text-[var(--color-azul-escuro)]/60">Fonte</th>
                <th className="text-left px-6 py-3.5 font-semibold text-[var(--color-azul-escuro)]/60">Data</th>
                <th className="w-12 px-6 py-3.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-surface-low)]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[var(--color-azul-escuro)]/30">
                    {search ? 'Nenhum resultado encontrado.' : 'Nenhum inscrito ainda.'}
                  </td>
                </tr>
              ) : (
                filtered.map((sub) => (
                  <tr key={sub.id} className="hover:bg-[var(--color-surface-low)]/50 transition-colors">
                    <td className="px-6 py-3.5 text-[var(--color-azul-escuro)] font-medium">{sub.email}</td>
                    <td className="px-6 py-3.5 text-[var(--color-azul-escuro)]/50">{sub.name || '—'}</td>
                    <td className="px-6 py-3.5">
                      <span className="inline-flex px-2.5 py-0.5 rounded-lg bg-[var(--color-rosa)]/[0.08] text-[var(--color-rosa)] text-xs font-medium">
                        {sub.source || 'website'}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-[var(--color-azul-escuro)]/40">{formatDate(sub.createdAt)}</td>
                    <td className="px-6 py-3.5">
                      <button
                        onClick={() => handleDelete(sub.id)}
                        className="p-1.5 rounded-lg text-[var(--color-azul-escuro)]/25 hover:text-red-500 hover:bg-red-50 transition-colors"
                        title="Remover inscrito"
                      >
                        <Trash className="h-4 w-4" weight="bold" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
