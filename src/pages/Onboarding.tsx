import { useState } from 'react'
import { load, save } from '@/lib/db'
import { useNavigate } from 'react-router-dom'

export default function Onboarding() {
  const nav = useNavigate()
  const db = load()
  const [nickname, setNickname] = useState(db.settings.nickname)
  const [goal, setGoal] = useState(db.settings.goalPerDay)
  const [deck, setDeck] = useState(db.settings.activeDeckId || db.decks[0]?.id)

  function start() {
    db.settings.nickname = nickname || 'Apprentice'
    db.settings.goalPerDay = goal
    db.settings.activeDeckId = deck
    save(db)
    nav('/')
  }

  return (
    <div className="space-y-4">
      <div className="card p-6">
        <div className="text-sm opacity-80 mb-2">Добро пожаловать в Школу Магии Слов!</div>
        <div className="text-2xl font-bold mb-2">Как тебя звать, ученик?</div>
        <input className="w-full bg-white/5 border border-white/10 rounded-xl p-3"
          placeholder="Например: Влад" value={nickname} onChange={e=>setNickname(e.target.value)} />
        <div className="mt-4">Сколько карточек в день осилишь?</div>
        <input type="range" min={5} max={50} step={5} value={goal} onChange={e=>setGoal(parseInt(e.target.value))} className="w-full" />
        <div className="opacity-80 text-sm">Цель: {goal} карточек/день</div>

        <div className="mt-6 text-lg font-semibold">Выбери курс</div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {db.decks.map(d => (
            <button key={d.id} onClick={()=>setDeck(d.id)}
              className={`p-3 rounded-xl border ${deck===d.id?'bg-white/10 border-white/30':'border-white/10 hover:bg-white/5'}`}>
              <div className="text-sm opacity-70">{d.langTo.toUpperCase()}</div>
              <div className="font-semibold">{d.title}</div>
            </button>
          ))}
        </div>

        <button className="btn mt-6 w-full" onClick={start}>Начать обучение 🪄</button>
      </div>
    </div>
  )
}
