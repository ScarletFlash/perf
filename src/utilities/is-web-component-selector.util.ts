export function isWebComponentSelector(value: string): value is `${string}-${string}` {
  return typeof value === 'string' && new RegExp(/\w*\-\w*/gm).test(value);
}
