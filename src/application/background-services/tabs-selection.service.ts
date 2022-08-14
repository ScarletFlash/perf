import type { TabSelectionParams } from '@application/declarations/interfaces/tab-selection-params.interface';
import type { OnTabSelectionChangeCallback } from '@application/declarations/types/on-tab-selection-change-callback.type';

export class TabsSelectionService {
  #onTabSelectionCallbacks: Set<OnTabSelectionChangeCallback> = new Set<OnTabSelectionChangeCallback>();

  public subscribeToSelectionChanges(callback: OnTabSelectionChangeCallback): void {
    this.#onTabSelectionCallbacks.add(callback);
  }

  public unsubscribeFromSelectionChanges(callback: OnTabSelectionChangeCallback): void {
    this.#onTabSelectionCallbacks.delete(callback);
  }

  public selectWithParams(tabSelectionParams: TabSelectionParams): void {
    this.#onTabSelectionCallbacks.forEach((callback: OnTabSelectionChangeCallback) => callback(tabSelectionParams));
  }
}
