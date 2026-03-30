'use client'

import { useState, useEffect } from 'react'
import { Loader2, Send, CornerDownRight } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Comment {
  id: string
  content: string
  createdAt: string
  author: { id: string; name: string; avatarUrl: string | null; level: string }
  replies?: Comment[]
}

export function CommentsSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchComments()
  }, [postId])

  async function fetchComments() {
    const res = await fetch(`/api/posts/${postId}/comments`)
    const data = await res.json()
    setComments(data)
    setLoading(false)
  }

  async function handleSubmit(parentId?: string) {
    const content = parentId ? replyText : newComment
    if (!content.trim()) return
    setSubmitting(true)

    await fetch(`/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, parentId }),
    })

    if (parentId) {
      setReplyText('')
      setReplyingTo(null)
    } else {
      setNewComment('')
    }
    setSubmitting(false)
    fetchComments()
  }

  if (loading) return <div className="py-4 text-center text-sm text-muted-foreground">Carregando comentarios...</div>

  return (
    <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--color-surface-low)' }}>
      {/* Comment list */}
      {comments.length > 0 && (
        <div className="space-y-3 mb-3">
          {comments.map(comment => (
            <div key={comment.id}>
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-[var(--color-rosa)]/20 flex items-center justify-center text-[var(--color-rosa)] text-[10px] font-bold shrink-0 mt-0.5">
                  {comment.author.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-[var(--color-azul-escuro)]">{comment.author.name}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: ptBR })}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--color-azul-escuro)] mt-0.5">{comment.content}</p>
                  <button
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    className="text-[10px] text-muted-foreground hover:text-[var(--color-laranja)] mt-1"
                  >
                    Responder
                  </button>

                  {/* Reply form */}
                  {replyingTo === comment.id && (
                    <div className="flex gap-2 mt-2">
                      <input
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                        placeholder="Escreva uma resposta..."
                        className="flex-1 bg-[var(--color-surface-low)] rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[var(--color-rosa)]"
                        onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSubmit(comment.id)}
                      />
                      <button
                        onClick={() => handleSubmit(comment.id)}
                        disabled={submitting || !replyText.trim()}
                        className="p-1.5 rounded-lg bg-[var(--color-laranja)] text-white disabled:opacity-40"
                      >
                        <Send className="h-3 w-3" />
                      </button>
                    </div>
                  )}

                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-2 space-y-2 pl-2">
                      {comment.replies.map(reply => (
                        <div key={reply.id} className="flex gap-2">
                          <CornerDownRight className="h-3 w-3 text-muted-foreground shrink-0 mt-1" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-medium text-[var(--color-azul-escuro)]">{reply.author.name}</span>
                              <span className="text-[10px] text-muted-foreground">
                                {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true, locale: ptBR })}
                              </span>
                            </div>
                            <p className="text-xs text-[var(--color-azul-escuro)]">{reply.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New comment input */}
      <div className="flex gap-2">
        <input
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          placeholder="Escreva um comentario..."
          className="flex-1 bg-[var(--color-surface-low)] rounded-xl px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[var(--color-rosa)]"
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSubmit()}
        />
        <button
          onClick={() => handleSubmit()}
          disabled={submitting || !newComment.trim()}
          className="p-2 rounded-xl bg-[var(--color-laranja)] text-white disabled:opacity-40"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </button>
      </div>
    </div>
  )
}
