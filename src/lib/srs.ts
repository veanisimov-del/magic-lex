import type { Progress } from './types'

export function scheduleSM2(p: Progress | undefined, quality: number, now = Date.now()): Progress {
  let reps = p?.reps ?? 0
  let interval = p?.interval ?? 0
  let ef = p?.ef ?? 2.5

  ef = ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  if (ef < 1.3) ef = 1.3

  if (quality < 3) {
    reps = 0
    interval = 1
  } else {
    reps += 1
    if (reps === 1) interval = 1
    else if (reps === 2) interval = 6
    else interval = Math.round(interval * ef)
  }

  return {
    cardId: p?.cardId ?? '',
    reps,
    interval,
    ef,
    dueAt: now + interval * 24 * 60 * 60 * 1000,
    lastGrade: quality,
  }
}
