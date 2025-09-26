import { load, save } from '@/lib/db'

export default function Decks() {
  const db = load()
  const { decks, cards, settings } = db

  function setActive(id: string) {
    db.settings.activeDeckId = id
    save(db)
    location.reload()
  }

  return (
    <div className="space-y-4">
      {decks.map(deck => {
        const list = cards.filter(c=>c.deckId===deck.id)
        const isActive = settings.activeDeckId === deck.id
        return (
          <div key={deck.id} className="card p-5">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-lg font-semibold">{deck.title}</div>
                <div className="opacity-80 text-sm">{list.length} cards • {deck.langFrom.toUpperCase()} → {deck.langTo.toUpperCase()}</div>
              </div>
              <button className={isActive ? 'btn' : 'btn-ghost'} onClick={()=>setActive(deck.id)}>
                {isActive ? 'Активный' : 'Сделать активным'}
              </button>
            </div>
            <div className="mt-3 space-y-2">
              {list.map(c => (
                <div key={c.id} className="p-3 rounded-xl border border-white/10 flex justify-between items-center">
                  <div>
                    <div className="font-semibold">{c.term}</div>
                    <div className="text-sm opacity-70">{c.translation}{c.transcription ? ` [${c.transcription}]` : ''}</div>
                  </div>
                  <div className="text-xl">🪄</div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
