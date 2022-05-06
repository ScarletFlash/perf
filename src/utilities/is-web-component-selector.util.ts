import { WebComponentSelector } from '@declarations/types/web-component-selector.type';

export function isWebComponentSelector(value: string): value is WebComponentSelector {
  return typeof value === 'string' && new RegExp(/\w*\-\w*/gm).test(value);
}
