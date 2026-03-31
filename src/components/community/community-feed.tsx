'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Heart, MessageCircle, Share2, MoreHorizontal, Play } from 'lucide-react'
import { CommentsSection } from '@/components/community/comments-section'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Post {
  id: string
  content: string
  type: string
  audioUrl: string | null
  imageUrl: string | null
  level: string | null
  isPinned: boolean
  isChallenge: boolean
  createdAt: Date
  hasLiked: boolean
  author: { id: string; name: string; avatarUrl: string | null; level: string }
  _count: { reactions: number; comments: number }
}

export function CommunityFeed({
  initialPosts,
  userId,
  userLevel,
}: {
  initialPosts: Post[]
  userId: string
  userLevel: string
}) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'all' | 'level' | 'challenge'>('all')
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({})

  const filteredPosts = initialPosts.filter(post => {
    if (activeTab === 'level') return post.level === userLevel
    if (activeTab === 'challenge') return post.isChallenge
    return true
  })

  async function handleLike(postId: string) {
    await fetch(`/api/posts/${postId}/reaction`, { method: 'POST' })
    router.refresh()
  }

  const tabs = [
    { id: 'all', label: 'Todos' },
    { id: 'level', label: 'Meu Nível' },
    { id: 'challenge', label: 'Desafio' },
  ] as const

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-6 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`text-sm font-medium pb-2 transition-colors ${
              activeTab === tab.id
                ? 'text-[var(--color-azul-escuro)] border-b-2 border-[var(--color-laranja)]'
                : 'text-muted-foreground hover:text-[var(--color-azul-escuro)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {filteredPosts.map(post => (
          <div key={post.id} className="bg-white rounded-2xl p-5 shadow-[0_4px_24px_rgba(48,51,66,0.06)]">
            {/* Author */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-rosa)] flex items-center justify-center text-white text-sm font-bold">
                    {post.author.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 bg-[var(--color-laranja)] text-white text-[8px] font-bold px-1 rounded-full">
                    {post.author.level.charAt(0)}{post.author.level.charAt(post.author.level.length > 3 ? 1 : 0).toLowerCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--color-azul-escuro)]">{post.author.name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ptBR })}
                  </p>
                </div>
              </div>
              <button className="p-1 rounded-lg hover:bg-[var(--color-surface-low)] text-muted-foreground">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            <p className="text-[var(--color-azul-escuro)] leading-relaxed mb-3 whitespace-pre-wrap">
              {post.content}
            </p>

            {/* Audio */}
            {post.audioUrl && (
              <div className="bg-[var(--color-surface-low)] rounded-2xl p-3 mb-3">
                <audio controls className="w-full h-8" preload="auto">
                  <source
                    src={post.audioUrl}
                    type={
                      post.audioUrl.endsWith('.mp4') ? 'audio/mp4'
                        : post.audioUrl.endsWith('.ogg') ? 'audio/ogg'
                        : post.audioUrl.endsWith('.wav') ? 'audio/wav'
                        : post.audioUrl.endsWith('.mp3') ? 'audio/mpeg'
                        : 'audio/webm'
                    }
                  />
                  Seu navegador n\u00e3o suporta \u00e1udio.
                </audio>
              </div>
            )}

            {/* Image */}
            {post.imageUrl && (
              <div className="rounded-2xl overflow-hidden mb-3">
                <img src={post.imageUrl} alt="" className="w-full object-cover max-h-80" />
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-6 pt-2">
              <button
                onClick={() => handleLike(post.id)}
                className={`flex items-center gap-1.5 text-sm transition-colors ${
                  post.hasLiked
                    ? 'text-[var(--color-rosa)]'
                    : 'text-muted-foreground hover:text-[var(--color-rosa)]'
                }`}
              >
                <Heart className={`h-4 w-4 ${post.hasLiked ? 'fill-current' : ''}`} />
                {post._count.reactions}
              </button>
              <button
                onClick={() => setExpandedComments(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-[var(--color-azul-escuro)]"
              >
                <MessageCircle className="h-4 w-4" />
                {post._count.comments}
              </button>
              <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-[var(--color-azul-escuro)]">
                <Share2 className="h-4 w-4" />
              </button>
            </div>

            {expandedComments[post.id] && (
              <CommentsSection postId={post.id} />
            )}
          </div>
        ))}

        {filteredPosts.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            Nenhum post encontrado.
          </div>
        )}
      </div>
    </div>
  )
}
