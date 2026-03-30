'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Download, Eye, Search, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react'

interface Member {
  id: string; name: string; email: string; level: string;
  subscriptionPlan: string | null; subscriptionStatus: string;
  createdAt: string; onboardingDone: boolean;
  blockReason: string | null; onboardingAnswer: string | null;
  couponUsed: string | null; avatarUrl: string | null;
}

const statusConfig: Record<string, { label: string; dot: string; text: string }> = {
  ACTIVE: { label: 'Ativa', dot: 'bg-green-500', text: 'text-green-600' },
  INACTIVE: { label: 'Inativa', dot: 'bg-gray-400', text: 'text-gray-500' },
  PAST_DUE: { label: 'Pendente', dot: 'bg-amber-500', text: 'text-amber-600' },
  CANCELED: { label: 'Cancelada', dot: 'bg-red-400', text: 'text-red-500' },
}

const levelLabels: Record<string, string> = {
  INICIANTE: 'Iniciante',
  INTERMEDIARIO: 'Intermediário',
  AVANCADO: 'Avançado',
}

const planLabels: Record<string, string> = {
  monthly: 'Plano Mensal',
  quarterly: 'Plano Trimestral',
  yearly: 'Plano Anual',
  premium: 'Premium',
}

const blockLabels: Record<string, string> = {
  medo_errar: 'Medo de errar',
  vocabulario: 'Falta de vocabulário',
  falta_pratica: 'Falta de prática',
  escuta: 'Dificuldade de escuta',
}

const ITEMS_PER_PAGE = 10

export function AdminMembersTable({ initialMembers }: { initialMembers: Member[] }) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [filterLevel, setFilterLevel] = useState<string>('all')
  const [filterPlan, setFilterPlan] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [page, setPage] = useState(1)

  const filtered = initialMembers.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase())
    const matchLevel = filterLevel === 'all' || m.level === filterLevel
    const matchPlan = filterPlan === 'all' || m.subscriptionPlan === filterPlan
    const matchStatus = filterStatus === 'all' || m.subscriptionStatus === filterStatus
    return matchSearch && matchLevel && matchPlan && matchStatus
  })

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  async function handleChangeLevel(memberId: string, newLevel: string) {
    await fetch(`/api/admin/members/${memberId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ level: newLevel }),
    })
    router.refresh()
  }

  function exportCSV() {
    const headers = ['Nome', 'E-mail', 'Nível', 'Plano', 'Status', 'Cupom', 'Data Cadastro']
    const rows = filtered.map(m => [
      m.name, m.email, m.level, m.subscriptionPlan || '', m.subscriptionStatus, m.couponUsed || '', new Date(m.createdAt).toLocaleDateString('pt-BR')
    ])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'membros-lecercle.csv'
    a.click()
  }

  return (
    <>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <Select value={filterLevel} onValueChange={v => { setFilterLevel(v ?? 'all'); setPage(1) }}>
          <SelectTrigger className="w-[160px] bg-white border border-gray-200 rounded-xl text-sm">
            <span className="text-gray-400 text-xs mr-1">Nível:</span> <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="INICIANTE">Iniciante</SelectItem>
            <SelectItem value="INTERMEDIARIO">Intermediário</SelectItem>
            <SelectItem value="AVANCADO">Avançado</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterPlan} onValueChange={v => { setFilterPlan(v ?? 'all'); setPage(1) }}>
          <SelectTrigger className="w-[160px] bg-white border border-gray-200 rounded-xl text-sm">
            <span className="text-gray-400 text-xs mr-1">Plano:</span> <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="monthly">Mensal</SelectItem>
            <SelectItem value="quarterly">Trimestral</SelectItem>
            <SelectItem value="yearly">Anual</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={v => { setFilterStatus(v ?? 'all'); setPage(1) }}>
          <SelectTrigger className="w-[160px] bg-white border border-gray-200 rounded-xl text-sm">
            <span className="text-gray-400 text-xs mr-1">Status:</span> <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="ACTIVE">Ativo</SelectItem>
            <SelectItem value="PAST_DUE">Pendente</SelectItem>
            <SelectItem value="CANCELED">Cancelado</SelectItem>
          </SelectContent>
        </Select>

        <div className="ml-auto">
          <Button onClick={exportCSV} className="bg-[var(--color-rosa)] hover:bg-[var(--color-rosa-hover)] text-white rounded-xl px-5">
            <Download className="h-4 w-4 mr-2" /> Exportar CSV
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Membro</th>
                <th className="text-left px-4 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Nível</th>
                <th className="text-left px-4 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Plano</th>
                <th className="text-left px-4 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status Assinatura</th>
                <th className="text-left px-4 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Cupom Usado</th>
                <th className="text-left px-4 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Data Cadastro</th>
                <th className="text-left px-4 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((member) => {
                const status = statusConfig[member.subscriptionStatus] || statusConfig.INACTIVE
                return (
                  <tr key={member.id} className="border-b border-gray-50 hover:bg-[#FAFAFA] transition-colors">
                    {/* Member */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-600 text-sm font-bold shrink-0 overflow-hidden">
                          {member.avatarUrl ? (
                            <img src={member.avatarUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            member.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[var(--color-azul-escuro)]">{member.name}</p>
                          <p className="text-xs text-gray-400">{member.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Level */}
                    <td className="px-4 py-4">
                      <Select value={member.level} onValueChange={v => { if (v) handleChangeLevel(member.id, v) }}>
                        <SelectTrigger className="h-7 w-[120px] bg-gray-50 border-none text-xs font-medium rounded-lg">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="INICIANTE">Iniciante</SelectItem>
                          <SelectItem value="INTERMEDIARIO">Intermediário</SelectItem>
                          <SelectItem value="AVANCADO">Avançado</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>

                    {/* Plan */}
                    <td className="px-4 py-4 text-sm text-[var(--color-azul-escuro)]">
                      {planLabels[member.subscriptionPlan || ''] || '—'}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${status.text}`}>
                        <span className={`w-2 h-2 rounded-full ${status.dot}`} />
                        {status.label}
                      </span>
                    </td>

                    {/* Coupon */}
                    <td className="px-4 py-4">
                      {member.couponUsed ? (
                        <span className="text-xs font-mono font-bold text-[var(--color-rosa)] bg-[var(--color-rosa-light)] px-2 py-0.5 rounded-md">
                          {member.couponUsed}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-300">&mdash;</span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {new Date(member.createdAt).toLocaleDateString('pt-BR')}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4">
                      <button
                        onClick={() => setSelectedMember(member)}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
          <p className="text-sm text-gray-400">
            Mostrando {((page - 1) * ITEMS_PER_PAGE) + 1}-{Math.min(page * ITEMS_PER_PAGE, filtered.length)} de <strong className="text-[var(--color-azul-escuro)]">{filtered.length.toLocaleString('pt-BR')}</strong> membros
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                  page === p
                    ? 'bg-[var(--color-azul-escuro)] text-white'
                    : 'hover:bg-gray-100 text-gray-500'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || totalPages === 0}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Member Detail Dialog */}
      <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes do Membro</DialogTitle>
          </DialogHeader>
          {selectedMember && (
            <div className="space-y-4 mt-4">
              <div className="bg-[#F5F5F7] rounded-xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-rosa)] to-[var(--color-laranja)] flex items-center justify-center text-white text-lg font-bold">
                  {selectedMember.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-[var(--color-azul-escuro)]">{selectedMember.name}</p>
                  <p className="text-sm text-gray-400">{selectedMember.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Nível</p>
                  <p className="font-medium">{levelLabels[selectedMember.level] || selectedMember.level}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Plano</p>
                  <p className="font-medium">{planLabels[selectedMember.subscriptionPlan || ''] || 'Nenhum'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Status</p>
                  <p className="font-medium">{statusConfig[selectedMember.subscriptionStatus]?.label}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Onboarding</p>
                  <p className="font-medium">{selectedMember.onboardingDone ? 'Concluído' : 'Pendente'}</p>
                </div>
                {selectedMember.couponUsed && (
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Cupom</p>
                    <p className="font-mono font-bold text-[var(--color-rosa)]">{selectedMember.couponUsed}</p>
                  </div>
                )}
              </div>
              {selectedMember.blockReason && (
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">O que mais trava</p>
                  <p className="text-sm font-medium">{blockLabels[selectedMember.blockReason] || selectedMember.blockReason}</p>
                </div>
              )}
              {selectedMember.onboardingAnswer && (
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Por que entrou no Le Cercle</p>
                  <p className="text-sm bg-[#F5F5F7] rounded-xl p-3">{selectedMember.onboardingAnswer}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
