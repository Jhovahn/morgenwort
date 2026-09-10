/** Local time, not UTC -- unlike the streak's day boundary (deliberately
 * UTC, for a deterministic date string), a greeting is about what time it
 * actually is for the person looking at the screen. */
export function getGreeting(date = new Date()): string {
  const hour = date.getHours();
  if (hour < 5) return "Good night";
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  if (hour < 22) return "Good evening";
  return "Good night";
}
