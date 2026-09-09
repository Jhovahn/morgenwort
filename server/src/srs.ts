/**
 * Simplified spaced-repetition scheduling. Not real SM-2 — five fixed
 * strength levels mapped to widening review intervals, which is enough
 * to demonstrate due/overdue/pushed-back behavior without the tuning
 * a production algorithm would need.
 */
export const MAX_STRENGTH = 5;
export const MIN_STRENGTH = 1;

const INTERVAL_DAYS_BY_STRENGTH: Record<number, number> = {
  1: 1,
  2: 3,
  3: 6,
  4: 12,
  5: 24,
};

export function intervalDaysForStrength(strength: number): number {
  const clamped = Math.min(MAX_STRENGTH, Math.max(MIN_STRENGTH, strength));
  return INTERVAL_DAYS_BY_STRENGTH[clamped];
}

export function nextStrength(currentStrength: number, score: number): number {
  if (score >= 80) return Math.min(MAX_STRENGTH, currentStrength + 1);
  if (score < 50) return Math.max(MIN_STRENGTH, currentStrength - 1);
  return currentStrength;
}

export function addDays(from: Date, days: number): Date {
  const result = new Date(from);
  result.setDate(result.getDate() + days);
  return result;
}

export function isDue(dueAt: Date, now: Date): boolean {
  return dueAt.getTime() <= now.getTime();
}
