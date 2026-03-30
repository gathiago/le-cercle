'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Pin, Star, Trash2, Trophy, Heart, MessageCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { format } from 'date-fns'

interface Post {
  id: string
  content: string
  type: string
  isPinned: boolean
  isFeatured: boolean
  isChallenge: boolean
  level: string | null
  createdAt: string
  author: { name: string; level: string }
  _count: { reactions: number; comments: number }
}

export function AdminCommunityFeed({ initialPosts }: { initialPosts: Post[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [filterLevel, setFilterLevel] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [searchAuthor, setSearchAuthor] = useState('')

  const filteredPosts = initialPosts.filter(post => {
    const matchLevel = filterLevel === 'all' || post.level === filterLevel
    const matchType = filterType === 'all' || post.type === filterType
    const matchAuthor = !searchAuthor || post.author.name.toLowerCase().includes(searchAuthor.toLowerCase())
    return matchLevel && matchType && matchAuthor
  })

  async function handleAction(postId: string, action: string) {
    setLoading(postId)
    await fetch(`/api/admin/posts/${postId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    })
    setLoading(null)
    router.refresh()
  }

  async function handleDelete(postId: string) {
    if (!confirm('Tem certeza que deseja excluir este post?')) return
    setLoading(postId)
    await fetch(`/api/admin/posts/${postId}`, { method: 'DELETE' })
    setLoading(null)
    router.refresh()
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <Input value={searchAuthor} onChange={e => setSearchAuthor(e.target.value)} placeholder="Buscar por autor..." className="flex-1 min-w-[180px] bg-white border-none rounded-xl shadow-[0_2px_12px_rgba(48,51,66,0.04)]" />
        <Select value={filterLevel} onValueChange={v => setFilterLevel(v ?? 'all')}>
          <SelectTrigger className="w-[150px] bg-white border-none rounded-xl shadow-[0_2px_12px_rgba(48,51,66,0.04)]"><SelectValue placeholder="Nível" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os níveis</SelectItem>
            <SelectItem value="INICIANTE">Iniciante</SelectItem>
            <SelectItem value="INTERMEDIARIO">Intermediário</SelectItem>
            <SelectItem value="AVANCADO">Avançado</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterType} onValueChange={v => setFilterType(v ?? 'all')}>
          <SelectTrigger className="w-[150px] bg-white border-none rounded-xl shadow-[0_2px_12px_rgba(48,51,66,0.04)]"><SelectValue placeholder="Tipo" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="PRATICA">Prática</SelectItem>
            <SelectItem value="DUVIDA">Dúvida</SelectItem>
            <SelectItem value="DISCUSSAO">Discussão</SelectItem>
            <SelectItem value="DESAFIO">Desafio</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredPosts.map((post) => (
        <div key={post.id} className={`bg-white rounded-2xl p-5 shadow-[0_4px_24px_rgba(48,51,66,0.06)] ${loading === post.id ? 'opacity-50' : ''}`}>
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-[var(--color-azul-escuro)]">{post.author.name}</span>
              <span className="text-[10px] text-muted-foreground">{post.author.level}</span>
              <span className="text-[10px] text-muted-foreground">• {format(new Date(post.createdAt), 'dd/MM HH:mm')}</span>
              {post.isPinned && <span className="bg-amber-50 text-amber-600 text-[10px] px-2 py-0.5 rounded-full font-semibold">Fixado</span>}
              {post.isFeatured && <span className="bg-blue-50 text-blue-600 text-[10px] px-2 py-0.5 rounded-full font-semibold">Destaque</span>}
              {post.isChallenge && <span className="bg-[var(--color-rosa-light)] text-[var(--color-rosa)] text-[10px] px-2 py-0.5 rounded-full font-semibold">Desafio</span>}
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Heart className="h-3 w-3" /> {post._count.reactions}</span>
              <span className="flex items-center gap-1"><MessageCircle className="h-3 w-3" /> {post._count.comments}</span>
            </div>
          </div>

          <p className="text-sm text-[var(--color-azul-escuro)] mb-3 line-clamp-2">{post.content}</p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => handleAction(post.id, 'togglePin')}
              className={`p-1.5 rounded-lg text-xs flex items-center gap-1 ${post.isPinned ? 'bg-amber-50 text-amber-600' : 'hover:bg-[var(--color-surface-low)] text-muted-foreground'}`}
              title={post.isPinned ? 'Desfixar' : 'Fixar'}
            >
              <Pin className="h-3.5 w-3.5" /> {post.isPinned ? 'Desfixar' : 'Fixar'}
            </button>
            <button
              onClick={() => handleAction(post.id, 'toggleFeatured')}
              className={`p-1.5 rounded-lg text-xs flex items-center gap-1 ${post.isFeatured ? 'bg-blue-50 text-blue-600' : 'hover:bg-[var(--color-surface-low)] text-muted-foreground'}`}
              title={post.isFeatured ? 'Remover destaque' : 'Destacar'}
            >
              <Star className="h-3.5 w-3.5" /> {post.isFeatured ? 'Remover destaque' : 'Destacar'}
            </button>
            <button
              onClick={() => handleAction(post.id, 'toggleChallenge')}
              className={`p-1.5 rounded-lg text-xs flex items-center gap-1 ${post.isChallenge ? 'bg-[var(--color-rosa-light)] text-[var(--color-rosa)]' : 'hover:bg-[var(--color-surface-low)] text-muted-foreground'}`}
              title={post.isChallenge ? 'Remover desafio' : 'Marcar como desafio'}
            >
              <Trophy className="h-3.5 w-3.5" /> {post.isChallenge ? 'Remover desafio' : 'Desafio'}
            </button>
            <button
              onClick={() => handleDelete(post.id)}
              className="p-1.5 rounded-lg text-xs flex items-center gap-1 hover:bg-red-50 text-muted-foreground hover:text-red-500 ml-auto"
              title="Excluir"
            >
              <Trash2 className="h-3.5 w-3.5" /> Excluir
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
