import { Link } from 'react-router-dom'
import Stat from '@/components/Stat'
import { load, save } from '@/lib/db'
import { titleForLevel } from '@/lib/xp'
import { useState } from 'react'

export default function Home() {
  const [db, setDb] = useState(load())
  const { profile, settings, cards, progress, decks } = db
  const activeDeck = decks.find(d => d.id === settings.activeDeckId) ?? decks[0]

  const due = cards.filter(c => {
    if (activeDeck && c.deckId !== activeDeck.id) return false
    const p = progress[c.id]
    return !p || p.dueAt <= Date.now()
  }).length

  const title = titleForLevel(profile.level)

  function switchDeck(id: string) {
    db.settings.activeDeckId = id
    save(db)
    setDb(load())
  }

  return (
    <div className="space-y-4">
      <div className="card p-5 flex items-center gap-4">
        <div className="text-4xl">🧙</div>
        <div className="flex-1">
          <div className="text-sm opacity-70">Hello, {settings.nickname}</div>
          <div className="text-xl font-semibold">{title} — lvl {profile.level}</div>
          <div className="text-xs opacity-70">XP: {profile.xp} • Streak: {profile.streak}🔥</div>
        </div>
        <div className="text-xs opacity-80">
          Курс:<br/><span className="font-semibold">{activeDeck?.title}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Stat label="Due cards" value={due} />
        <Stat label="Daily goal" value={settings.goalPerDay} />
        <Stat label="Decks" value={db.decks.length} />
      </div>

      <div className="card p-5">
        <div className="text-lg font-semibold mb-2">Курс / Course</div>
        <div className="grid grid-cols-2 gap-2">
          {decks.map(d => (
            <button key={d.id} onClick={()=>switchDeck(d.id)}
              className={`p-3 rounded-xl border ${d.id===activeDeck?.id?'bg-white/10 border-white/30':'border-white/10 hover:bg-white/5'}`}>
              <div className="text-sm opacity-70">{d.langTo.toUpperCase()}</div>
              <div className="font-semibold">{d.title}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="card p-5">
        <div className="text-lg font-semibold mb-2">Квест дня</div>
        <div className="opacity-80">Пройди {settings.goalPerDay} карточек в «{activeDeck?.title}», чтобы получить бонусную ману.</div>
        <Link to="/train" className="btn mt-4 inline-block">Учиться сейчас</Link>
      </div>
    </div>
  )
}
