import type { UrlHash } from '@application/declarations/types/url-hash.type';

export function isUrlHash(input: string): input is UrlHash {
  return input === '' || input.startsWith('#');
}
