import { WebComponentSelector } from '@declarations/types/web-component-selector.type';

type UrlHash = `#${string}`;

export interface Route {
  title: string;
  descriptionText: string;
  descriptionIconSrc: string;
  componentSelector: WebComponentSelector;
  urlHash: UrlHash;
}
