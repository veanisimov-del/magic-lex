export type UserSettings = {
  goalPerDay: number
  uiLang: string
  nickname: string
  activeDeckId?: string
}

export type Card = {
  id: string
  term: string
  translation: string
  transcription?: string
  deckId: string
}

export type Progress = {
  cardId: string
  reps: number
  interval: number
  ef: number
  dueAt: number
  lastGrade?: number
}

export type Deck = {
  id: string
  title: string
  langFrom: string
  langTo: string
  tags?: string[]
}

export type SessionResult = {
  seen: number
  correct: number
  xp: number
}

export type Profile = {
  level: number
  xp: number
  streak: number
  lastStudyDate?: string
}
