import type { OnHashChangeCallback } from '@application/declarations/types/on-hash-change-callback.type';
import type { UrlHash } from '@application/declarations/types/url-hash.type';
import { isUrlHash } from '@application/utilities/is-url-hash.util';

export class UrlService {
  #currentHash: UrlHash | undefined;
  #onHashChangeCallbacks: Set<OnHashChangeCallback> = new Set<OnHashChangeCallback>();

  constructor() {
    globalThis.addEventListener('load', this.#loadListener, {
      once: true,
      passive: true
    });

    globalThis.addEventListener('hashchange', this.#hashChangeListener, {
      passive: true
    });
  }

  readonly #hashChangeListener: EventListener = (): void => {
    this.#handleHashChange();
  };

  readonly #loadListener: EventListener = (): void => {
    this.#handleHashChange();
  };

  public subscribeToHashChanges(callback: OnHashChangeCallback): void {
    this.#onHashChangeCallbacks.add(callback);
  }

  public unsubscribeFromHashChanges(callback: OnHashChangeCallback): void {
    this.#onHashChangeCallbacks.delete(callback);
  }

  public setHash(targetHash: UrlHash): void {
    if (this.#currentHash === targetHash) {
      return;
    }

    const resultUrl: URL = new URL(globalThis.location.href);
    resultUrl.hash = targetHash;

    globalThis.location.replace(resultUrl);
  }

  #handleHashChange(): void {
    const targetHash: string = new URL(globalThis.location.href).hash.toLowerCase();

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!isUrlHash(targetHash)) {
      throw new Error('[UrlService] targetHash is not UrlHash');
    }

    if (this.#currentHash === targetHash) {
      return;
    }

    this.#currentHash = targetHash;
    this.#onHashChangeCallbacks.forEach((callback: OnHashChangeCallback) => callback(targetHash));
  }
}
