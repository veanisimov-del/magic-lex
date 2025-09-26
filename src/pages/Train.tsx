import { useEffect, useMemo, useState } from 'react'
import { load, save } from '@/lib/db'
import CardView from '@/components/CardView'
import { scheduleSM2 } from '@/lib/srs'
import { xpForAnswer, levelForXP } from '@/lib/xp'
import { shuffle } from '@/lib/utils'

type Mode = 'cards' | 'quiz' | 'match'

export default function Train() {
  const [db, setDb] = useState(load())
  const activeDeckId = db.settings.activeDeckId || db.decks[0]?.id
  const [mode, setMode] = useState<Mode>('cards')

  const deckCards = useMemo(() => db.cards.filter(c => c.deckId === activeDeckId), [db, activeDeckId])
  const dueCards = useMemo(() => deckCards.filter(c => {
    const p = db.progress[c.id]
    return !p || p.dueAt <= Date.now()
  }), [db, deckCards])

  // ===== Mode: Cards (classic) =====
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const card = dueCards[index]
  useEffect(() => { setFlipped(false) }, [index, mode])

  function applyGrade(cardId: string, quality: 0|1|2|3|4|5) {
    const prev = db.progress[cardId]
    const p = scheduleSM2(prev ? { ...prev, cardId } : { cardId, reps:0, interval:0, ef:2.5, dueAt:0 }, quality)
    p.cardId = cardId
    db.progress[cardId] = p

    const gained = xpForAnswer(quality)
    db.profile.xp += gained
    db.profile.level = levelForXP(db.profile.xp)

    // Streak
    const today = new Date().toISOString().slice(0,10)
    if (db.profile.lastStudyDate !== today) {
      const yesterday = new Date(Date.now()-24*60*60*1000).toISOString().slice(0,10)
      db.profile.streak = (db.profile.lastStudyDate === yesterday) ? db.profile.streak + 1 : 1
      db.profile.lastStudyDate = today
    }
  }

  function gradeClassic(quality: 0|1|2|3|4|5) {
    if (!card) return
    applyGrade(card.id, quality)
    save(db); setDb(load())
    setIndex(i => Math.min(i+1, dueCards.length))
  }

  // ===== Mode: Quiz =====
  const [quizIdx, setQuizIdx] = useState(0)
  const quizCard = dueCards[quizIdx] ?? deckCards[quizIdx] // fallback to new
  const [quizOptions, setQuizOptions] = useState<string[]>([])
  const [quizAnswered, setQuizAnswered] = useState<null|boolean>(null)

  useEffect(() => {
    if (!quizCard) return
    const others = shuffle(deckCards.filter(c => c.id !== quizCard.id)).slice(0,2).map(c => c.translation)
    setQuizOptions(shuffle([quizCard.translation, ...others]))
    setQuizAnswered(null)
  }, [quizCard?.id, deckCards.length, mode])

  function answerQuiz(opt: string) {
    if (!quizCard) return
    const correct = opt === quizCard.translation
    setQuizAnswered(correct)
    applyGrade(quizCard.id, correct ? 5 : 2)
    save(db); setDb(load())
    setTimeout(() => {
      setQuizIdx(i => i + 1)
      setQuizAnswered(null)
    }, 400)
  }

  // ===== Mode: Match =====
  const [matchSet, setMatchSet] = useState<{left: string[], right: {term:string,translation:string}[], found:Set<string>, mistakes:Record<string,number>}>({left:[], right:[], found:new Set(), mistakes:{}})
  const [leftSel, setLeftSel] = useState<string|null>(null)

  function initMatch() {
    const pool = shuffle(deckCards).slice(0, Math.min(6, deckCards.length))
    const right = shuffle(pool.map(c => ({ term: c.term, translation: c.translation })))
    const left = shuffle(pool.map(c => c.term))
    setMatchSet({ left, right, found: new Set(), mistakes: {} })
    setLeftSel(null)
  }
  useEffect(() => { if (mode==='match') initMatch() }, [mode, deckCards.length])

  function clickLeft(term: string) { setLeftSel(term) }
  function clickRight(translation: string) {
    if (!leftSel) return
    const pair = deckCards.find(c => c.term === leftSel)
    if (!pair) return
    const correct = pair.translation === translation
    const m = matchSet.mistakes[leftSel] || 0
    if (correct) {
      matchSet.found.add(leftSel)
      setMatchSet({ ...matchSet })
      applyGrade(pair.id, m>0 ? 3 : 5)
      save(db); setDb(load())
      setLeftSel(null)
    } else {
      matchSet.mistakes[leftSel] = m + 1
      setMatchSet({ ...matchSet })
    }
  }
  const matchDone = matchSet.left.length>0 && matchSet.found.size === matchSet.left.length

  // ===== Render =====
  if (mode==='cards') {
    if (!card) {
      return (
        <div className="space-y-3">
          <ModeTabs mode={mode} setMode={setMode} />
          <div className="card p-6">
            <div className="text-xl font-semibold mb-2">Все карточки на сегодня изучены ✨</div>
            <div className="opacity-80">Переключись на «Викторину» или «Match», чтобы потренироваться ещё.</div>
          </div>
        </div>
      )
    }
    return (
      <div className="space-y-3">
        <ModeTabs mode={mode} setMode={setMode} />
        <CardView card={card} flipped={flipped} setFlipped={setFlipped} />
        {flipped ? (
          <div className="grid grid-cols-3 gap-2">
            <button className="btn-ghost" onClick={()=>gradeClassic(2)}>Не знаю</button>
            <button className="btn-ghost" onClick={()=>gradeClassic(4)}>Сомневаюсь</button>
            <button className="btn" onClick={()=>gradeClassic(5)}>Знаю</button>
          </div>
        ) : (
          <button className="btn w-full" onClick={()=>setFlipped(true)}>Показать ответ</button>
        )}
        <div className="text-center text-sm opacity-70">{index+1} / {dueCards.length} карточек</div>
      </div>
    )
  }

  if (mode==='quiz') {
    if (!quizCard) {
      return (
        <div className="space-y-3">
          <ModeTabs mode={mode} setMode={setMode} />
          <div className="card p-6">Нет карточек в колоде.</div>
        </div>
      )
    }
    return (
      <div className="space-y-3">
        <ModeTabs mode={mode} setMode={setMode} />
        <div className="card p-6">
          <div className="text-sm opacity-70 mb-1">Выбери перевод</div>
          <div className="text-3xl font-bold mb-4">{quizCard.term}</div>
          <div className="grid gap-2">
            {quizOptions.map(opt => (
              <button key={opt}
                onClick={()=>answerQuiz(opt)}
                className={`p-3 rounded-xl border border-white/10 text-left ${quizAnswered===null ? 'hover:bg-white/5' : opt===quizCard.translation ? 'bg-green-600/30' : 'bg-red-600/20'}`}>
                {opt}
              </button>
            ))}
          </div>
        </div>
        <div className="text-center text-sm opacity-70">{quizIdx+1}</div>
      </div>
    )
  }

  // match
  return (
    <div className="space-y-3">
      <ModeTabs mode={mode} setMode={setMode} />
      {!matchSet.left.length ? (
        <div className="card p-6">Недостаточно карточек в колоде.</div>
      ) : (
        <div className="card p-6">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-sm opacity-70 mb-2">Слова</div>
              <div className="space-y-2">
                {matchSet.left.map(term => (
                  <button key={term} onClick={()=>clickLeft(term)}
                    className={`w-full p-3 rounded-xl border border-white/10 text-left ${matchSet.found.has(term) ? 'opacity-40' : leftSel===term ? 'bg-white/10' : 'hover:bg-white/5'}`}>
                    {term}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm opacity-70 mb-2">Переводы</div>
              <div className="space-y-2">
                {matchSet.right.map(r => (
                  <button key={r.term+'-'+r.translation} onClick={()=>clickRight(r.translation)}
                    className="w-full p-3 rounded-xl border border-white/10 text-left hover:bg-white/5">
                    {r.translation}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {matchDone && (
            <div className="mt-4">
              <div className="font-semibold">Отлично! Все пары найдены ✨</div>
              <button className="btn mt-2" onClick={initMatch}>Новая подборка</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ModeTabs({mode, setMode}:{mode:Mode,setMode:(m:Mode)=>void}) {
  const Tab = ({m,label}:{m:Mode,label:string}) => (
    <button onClick={()=>setMode(m)}
      className={`px-3 py-2 rounded-xl border ${mode===m ? 'bg-white/10 border-white/30' : 'border-white/10 hover:bg-white/5'}`}>
      {label}
    </button>
  )
  return (
    <div className="flex gap-2">
      <Tab m="cards" label="Карточки" />
      <Tab m="quiz" label="Викторина" />
      <Tab m="match" label="Match" />
    </div>
  )
}
