import { PerfComponentSelector } from '@declarations/types/perf-component-selector.type';
import { isWebComponentSelector } from './is-web-component-selector.util';

export function isPerfComponentSelector(value: string): value is PerfComponentSelector {
  return isWebComponentSelector(value) && value.startsWith('perf-');
}
