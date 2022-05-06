import { PerfComponentSelector } from '@declarations/types/perf-component-selector.type';

type UrlHash = `#${string}`;

export interface Route {
  title: string;
  descriptionText: string;
  descriptionIconSrc: string;
  componentSelector: PerfComponentSelector;
  urlHash: UrlHash;
}
