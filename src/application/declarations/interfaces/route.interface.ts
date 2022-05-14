import { UrlHash } from '@declarations/types/url-hash.type';
import { PerfComponentSelector } from '@framework/declarations/types/perf-component-selector.type';

export interface Route {
  title: string;
  descriptionText: string;
  descriptionIconSrc: string;
  componentSelector: PerfComponentSelector;
  urlHash: UrlHash;
}
