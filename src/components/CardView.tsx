import React from 'react'
import type { Card } from '@/lib/types'

export default function CardView({ card, flipped, setFlipped }:{ card: Card, flipped: boolean, setFlipped: (v:boolean)=>void }) {
  return (
    <div className="card p-6">
      <div className="text-sm opacity-70 mb-2">Deck: PT basics</div>
      <div className="text-3xl font-bold mb-2">{flipped ? card.translation : card.term}</div>
      {!flipped && card.transcription && <div className="opacity-70 mb-4">[{card.transcription}]</div>}
      <button className="btn-ghost" onClick={() => setFlipped(!flipped)}>{flipped ? 'Скрыть перевод' : 'Показать перевод'}</button>
    </div>
  )
}
