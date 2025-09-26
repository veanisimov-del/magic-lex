import { load } from '@/lib/db'
import { titleForLevel } from '@/lib/xp'

export default function Profile() {
  const db = load()
  const { profile, settings } = db
  return (
    <div className="space-y-4">
      <div className="card p-6 flex items-center gap-4">
        <div className="text-5xl">🧙‍♂️</div>
        <div>
          <div className="text-xl font-semibold">{settings.nickname}</div>
          <div className="opacity-80">{titleForLevel(profile.level)} — lvl {profile.level}</div>
          <div className="text-sm opacity-70">XP: {profile.xp} • Streak: {profile.streak}</div>
        </div>
      </div>
      <div className="card p-6">
        <div className="text-lg font-semibold mb-2">Настройки</div>
        <div className="opacity-80 text-sm">Цель: {settings.goalPerDay} карточек/день</div>
        <div className="opacity-80 text-sm mt-1">Язык интерфейса: {settings.uiLang}</div>
      </div>
    </div>
  )
}
