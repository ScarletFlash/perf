import { OnHashChangeCallback } from '@declarations/types/on-hash-change-callback.type';

export class UrlService {
  #currentHash: string;
  #onHashChangeCallbacks: Set<OnHashChangeCallback> = new Set<OnHashChangeCallback>();

  readonly #hashChangeListener: EventListener = (): void => {
    this.#handleHashChange();
  };

  readonly #loadListener: EventListener = (): void => {
    this.#handleHashChange();
  };

  constructor() {
    globalThis.addEventListener('hashchange', this.#hashChangeListener, {
      passive: true
    });

    globalThis.addEventListener('load', this.#loadListener, {
      once: true,
      passive: true
    });
  }

  public setHash(targetHash: string): void {
    if (this.#currentHash === targetHash) {
      return;
    }

    const sanitizedHash: string = `#${targetHash.replace('#', '').toLowerCase()}`;

    const resultUrl: URL = new URL(globalThis.location.href);
    resultUrl.hash = sanitizedHash;

    globalThis.location.replace(resultUrl);
  }

  public subscribeToHashChanges(callback: OnHashChangeCallback): void {
    this.#onHashChangeCallbacks.add(callback);
  }

  public unsubscribeFromHashChanges(callback: OnHashChangeCallback): void {
    this.#onHashChangeCallbacks.delete(callback);
  }

  #handleHashChange(): void {
    const targetHash: string = new URL(globalThis.location.href).hash.toLowerCase();
    if (this.#currentHash === targetHash) {
      return;
    }
    this.#currentHash = targetHash;
    this.#onHashChangeCallbacks.forEach((callback: OnHashChangeCallback) => callback(this.#currentHash));
  }
}
