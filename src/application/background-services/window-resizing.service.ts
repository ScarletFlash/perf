import { OnWindowSizeChangeCallback } from '@declarations/types/on-window-size-change-callback.type';

export class WindowResizingService {
  readonly #onWindowSizeChangeCallbacks: Set<OnWindowSizeChangeCallback> = new Set<OnWindowSizeChangeCallback>();

  readonly #resizeObserverCallback: ResizeObserverCallback = (_entries: ResizeObserverEntry[]) => {
    this.#onWindowSizeChangeCallbacks.forEach((callback: OnWindowSizeChangeCallback) => callback());
  };
  readonly #resizeObserver: ResizeObserver = new ResizeObserver(this.#resizeObserverCallback);
  readonly #resizeObserverOptions: ResizeObserverOptions = {
    box: 'border-box'
  };

  constructor() {
    this.#resizeObserver.observe(document.body, this.#resizeObserverOptions);
  }

  public subscribeToWindowSizeChanges(callback: OnWindowSizeChangeCallback): void {
    this.#onWindowSizeChangeCallbacks.add(callback);
  }

  public unsubscribeFromWindowSizeChanges(callback: OnWindowSizeChangeCallback): void {
    this.#onWindowSizeChangeCallbacks.delete(callback);
  }
}
