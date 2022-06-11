import { ContextualError } from '@application/declarations/classes/contextual-error.class';
import type { OnHashChangeCallback } from '@application/declarations/types/on-hash-change-callback.type';
import type { UrlHash } from '@application/declarations/types/url-hash.type';

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

  static #isUrlHash(input: string): input is UrlHash {
    return input === '' || input.startsWith('#');
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

    if (!UrlService.#isUrlHash(targetHash)) {
      throw new ContextualError(this, 'targetHash is not UrlHash');
    }

    if (this.#currentHash === targetHash) {
      return;
    }

    this.#currentHash = targetHash;
    this.#onHashChangeCallbacks.forEach((callback: OnHashChangeCallback) => callback(targetHash));
  }
}
