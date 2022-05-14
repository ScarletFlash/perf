import type { PerfComponentSelector } from '@framework/declarations/types/perf-component-selector.type';
import type { UrlHash } from './../types/url-hash.type';

export interface Route {
  title: string;
  descriptionText: string;
  descriptionIconSrc: string;
  componentSelector: PerfComponentSelector;
  urlHash: UrlHash;
}
