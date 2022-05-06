import { PerfComponentSelector } from '@declarations/types/perf-component-selector.type';
import { UrlHash } from '@declarations/types/url-hash.type';

export interface Route {
  title: string;
  descriptionText: string;
  descriptionIconSrc: string;
  componentSelector: PerfComponentSelector;
  urlHash: UrlHash;
}
