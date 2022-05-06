import { OnHashChangeCallback } from '@declarations/types/on-hash-change-callback.type';
import { UrlHash } from '@declarations/types/url-hash.type';
import { isUrlHash } from '@utilities/is-url-hash.util';

export class UrlService {
  #currentHash: UrlHash;
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

  public subscribeToHashChanges(callback: OnHashChangeCallback): void {
    this.#onHashChangeCallbacks.add(callback);
  }

  public unsubscribeFromHashChanges(callback: OnHashChangeCallback): void {
    this.#onHashChangeCallbacks.delete(callback);
  }

  #handleHashChange(): void {
    const targetHash: string = new URL(globalThis.location.href).hash.toLowerCase();

    if (!isUrlHash(targetHash)) {
      throw new Error('[UrlService] targetHash is not UrlHash');
    }

    if (this.#currentHash === targetHash) {
      return;
    }

    this.#currentHash = targetHash;
    this.#onHashChangeCallbacks.forEach((callback: OnHashChangeCallback) => callback(this.#currentHash));
  }
}
