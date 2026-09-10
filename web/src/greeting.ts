/** Local time, not UTC -- unlike the streak's day boundary (deliberately
 * UTC, for a deterministic date string), a greeting is about what time it
 * actually is for the person looking at the screen. Three buckets, not
 * four -- late night folds into "evening" rather than getting its own
 * "Good night," which reads as a farewell, not a welcome. */
export function getGreeting(date = new Date()): string {
  const hour = date.getHours();
  if (hour < 5) return "Good evening";
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}
