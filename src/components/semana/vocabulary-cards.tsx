'use client'

import { useState } from 'react'

interface VocabItem {
  word: string
  translation: string
  example?: string
}

export function VocabularyCards({ vocabulary }: { vocabulary: VocabItem[] }) {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({})

  return (
    <div className="grid grid-cols-2 gap-3">
      {vocabulary.map((item, i) => (
        <button
          key={i}
          onClick={() => setFlipped(prev => ({ ...prev, [i]: !prev[i] }))}
          className="relative h-20 rounded-2xl transition-all duration-300 text-center"
          style={{ perspective: '1000px' }}
        >
          <div
            className={`w-full h-full transition-transform duration-500 relative`}
            style={{
              transformStyle: 'preserve-3d',
              transform: flipped[i] ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
          >
            {/* Front */}
            <div
              className="absolute inset-0 bg-[var(--color-surface-lowest)] rounded-2xl shadow-[0_2px_12px_rgba(48,51,66,0.04)] flex items-center justify-center px-4"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <span className="text-[var(--color-azul-escuro)] font-medium">{item.word}</span>
            </div>
            {/* Back */}
            <div
              className="absolute inset-0 bg-[var(--color-rosa-light)] rounded-2xl flex items-center justify-center px-4"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
              <span className="text-[var(--color-azul-escuro)] font-medium text-sm">{item.translation}</span>
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}
