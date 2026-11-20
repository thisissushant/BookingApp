const WINDOW_MS = 15 * 60 * 1000;

export function canCheckIn(now: Date, startsAt: Date): boolean {
  return startsAt.getTime() - now.getTime() <= WINDOW_MS;
}
