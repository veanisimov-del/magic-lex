export function xpForAnswer(quality: number) {
  // 0..5 quality -> xp
  return [0, 0, 5, 10, 15, 20][quality] ?? 0
}

export function levelForXP(xp: number) {
  // simple curve: level up every 200 xp, with slight ramp
  let level = 1
  let threshold = 150
  let remaining = xp
  while (remaining >= threshold) {
    remaining -= threshold
    level += 1
    threshold = Math.round(threshold * 1.12)
  }
  return level
}

export function titleForLevel(level: number) {
  const titles = ['Apprentice', 'Novice', 'Adept', 'Scholar', 'Mage', 'Archmage', 'Grandmaster']
  return titles[Math.min(titles.length - 1, Math.floor((level-1)/1))]
}
