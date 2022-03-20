import { ContentRenderer } from './content-renderer';

export class Application {
  #contentRenderer: ContentRenderer;

  public get renderer(): ContentRenderer {
    return this.#contentRenderer;
  }

  constructor(hostElementSelector: string) {
    const hostElement: HTMLElement | null = document.querySelector(hostElementSelector);
    if (!(hostElement instanceof HTMLElement)) {
      throw new Error('[Application] hostElement is unreachable');
    }

    this.#contentRenderer = new ContentRenderer(hostElement);
  }
}
