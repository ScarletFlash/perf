import type { OnWindowSizeChangeCallback } from '@declarations/types/on-window-size-change-callback.type';

export class WindowResizingService {
  readonly #onWindowSizeChangeCallbacks: Set<OnWindowSizeChangeCallback> = new Set<OnWindowSizeChangeCallback>();

  readonly #resizeObserver: ResizeObserver;
  readonly #resizeObserverOptions: ResizeObserverOptions = {
    box: 'border-box'
  };

  constructor() {
    const resizeObserverCallback: ResizeObserverCallback = (_entries: ResizeObserverEntry[]) => {
      this.#onWindowSizeChangeCallbacks.forEach((callback: OnWindowSizeChangeCallback) => callback());
    };
    this.#resizeObserver = new ResizeObserver(resizeObserverCallback);

    this.#resizeObserver.observe(document.body, this.#resizeObserverOptions);
  }

  public subscribeToWindowSizeChanges(callback: OnWindowSizeChangeCallback): void {
    this.#onWindowSizeChangeCallbacks.add(callback);
  }

  public unsubscribeFromWindowSizeChanges(callback: OnWindowSizeChangeCallback): void {
    this.#onWindowSizeChangeCallbacks.delete(callback);
  }
}
