import type { Card, Deck, Progress, UserSettings, Profile } from './types'

const KEY = 'magiclex_v1'

type DB = {
  settings: UserSettings
  profile: Profile
  decks: Deck[]
  cards: Card[]
  progress: Record<string, Progress> // by cardId
}

const defaults: DB = {
  settings: { goalPerDay: 20, uiLang: 'en', nickname: 'Apprentice' },
  profile: { level: 1, xp: 0, streak: 0 },
  decks: [],
  cards: [],
  progress: {}
}

export function load(): DB {
  const raw = localStorage.getItem(KEY)
  if (!raw) {
    const db = { ...defaults }
    seed(db)
    localStorage.setItem(KEY, JSON.stringify(db))
    return db
  }
  try {
    return JSON.parse(raw) as DB
  } catch {
    const db = { ...defaults }
    seed(db)
    localStorage.setItem(KEY, JSON.stringify(db))
    return db
  }
}

export function save(db: DB) {
  localStorage.setItem(KEY, JSON.stringify(db))
}

function uid() { return Math.random().toString(36).slice(2,10) }

function seed(db: DB) {
  // Portuguese basics deck
  const deckPT = uid()
  db.decks.push({ id: deckPT, title: 'PT basics', langFrom: 'ru', langTo: 'pt', tags: ['daily', 'course:pt'] })
  const itemsPT: [string,string,string?][] = [
    ['Olá', 'Привет', 'ола'],
    ['Bom dia', 'Доброе утро', 'бом дья'],
    ['Boa tarde', 'Добрый день', 'боа тарди'],
    ['Boa noite', 'Доброй ночи', 'боа нойт'],
    ['Por favor', 'Пожалуйста', 'пур фавор'],
    ['Obrigado', 'Спасибо (м.)', 'обригаду'],
    ['Obrigada', 'Спасибо (ж.)', 'обригада'],
    ['Desculpe', 'Извините', 'дежскулпе'],
    ['Sim', 'Да', 'син'],
    ['Não', 'Нет', 'наун']
  ]
  for (const [term, translation, transcription] of itemsPT) {
    const id = uid()
    db.cards.push({ id, deckId: deckPT, term, translation, transcription })
  }

  // English basics deck (for Mark)
  const deckEN = uid()
  db.decks.push({ id: deckEN, title: 'EN basics', langFrom: 'ru', langTo: 'en', tags: ['daily', 'course:en'] })
  const itemsEN: [string,string,string?][] = [
    ['Hello', 'Привет', 'хэллоу'],
    ['Good morning', 'Доброе утро', 'гуд мо:рнинг'],
    ['Good afternoon', 'Добрый день', 'гуд афтернун'],
    ['Good evening', 'Добрый вечер', 'гуд ивнинг'],
    ['Good night', 'Спокойной ночи', 'гуд найт'],
    ['Please', 'Пожалуйста', 'плиз'],
    ['Thank you', 'Спасибо', 'сэнк ю'],
    ['Sorry', 'Извини(те)', 'сóрри'],
    ['Yes', 'Да', 'йес'],
    ['No', 'Нет', 'ноу']
  ]
  for (const [term, translation, transcription] of itemsEN) {
    const id = uid()
    db.cards.push({ id, deckId: deckEN, term, translation, transcription })
  }

  // set default active deck to PT basics
  db.settings.activeDeckId = deckPT
}
