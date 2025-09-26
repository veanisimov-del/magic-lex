export default function Achievements() {
  const badges = [
    { id: 'streak3', title: 'Streak x3', desc: '3 дня подряд', emoji: '🔥' },
    { id: 'xp200', title: 'Apprentice badge', desc: '200 XP', emoji: '🪄' },
    { id: 'first10', title: 'First 10', desc: '10 карточек', emoji: '🎯' },
  ]
  return (
    <div className="space-y-2">
      {badges.map(b => (
        <div key={b.id} className="card p-4 flex gap-3 items-center">
          <div className="text-2xl">{b.emoji}</div>
          <div>
            <div className="font-semibold">{b.title}</div>
            <div className="text-sm opacity-70">{b.desc}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
