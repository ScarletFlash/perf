export function isEmpty<T>(input: T[]): input is [];
export function isEmpty(input: string): input is '';
export function isEmpty(input: unknown): boolean {
  if (typeof input === 'string') {
    return input.length === 0;
  }

  if (Array.isArray(input)) {
    return input.length === 0;
  }

  return false;
}
