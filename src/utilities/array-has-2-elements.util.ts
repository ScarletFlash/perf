export function arrayHas2Elements<T>(source: T[]): source is [T, T];
export function arrayHas2Elements<T>(source: T[]): boolean {
  return source.length > 1;
}
