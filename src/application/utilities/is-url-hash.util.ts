import type { UrlHash } from '@declarations/types/url-hash.type';

export function isUrlHash(input: string): input is UrlHash {
  return input === '' || input.startsWith('#');
}
