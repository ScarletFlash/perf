import { OnHashChangeCallback } from '@declarations/types/on-hash-change-callback.type';

export class UrlService {
  #currentHash: string = '';
  #onHashChangeCallbacks: Set<OnHashChangeCallback> = new Set<OnHashChangeCallback>();

  readonly #hashChangeListener = (event: Event): void => {
    if (!(event instanceof HashChangeEvent)) {
      return;
    }

    const { newURL }: HashChangeEvent = event;
    const targetHash: string = new URL(newURL).hash.toLowerCase().replace('#', '');
    if (this.#currentHash === targetHash) {
      return;
    }
    this.#currentHash = targetHash;
    this.#onHashChangeCallbacks.forEach((callback: OnHashChangeCallback) => callback(this.#currentHash));
  };

  constructor() {
    globalThis.addEventListener('hashchange', this.#hashChangeListener);
  }

  public subscribeToHashChanges(callback: OnHashChangeCallback): void {
    this.#onHashChangeCallbacks.add(callback);
  }

  public unsubscribeFromHashChanges(callback: OnHashChangeCallback): void {
    this.#onHashChangeCallbacks.delete(callback);
  }
}
