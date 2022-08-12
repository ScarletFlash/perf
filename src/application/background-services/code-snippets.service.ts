import type { CodeSnippet } from '@application/declarations/classes/code-snippet.class';
import { ContextualError } from '@application/declarations/classes/contextual-error.class';
import type { CodeSnippetId } from '@application/declarations/types/code-snippet-id.type';
import type { OnActiveSnippetChangeCallback } from '@application/declarations/types/on-active-snippet-change-callback.type';
import type { OnSnippetListChangeCallback } from '@application/declarations/types/on-snippet-list-change-callback.type';

export class CodeSnippetsService {
  readonly #codeSnippetById: Map<CodeSnippetId, CodeSnippet> = new Map<CodeSnippetId, CodeSnippet>();

  #onSnippetListChangeCallbacks: Set<OnSnippetListChangeCallback> = new Set<OnSnippetListChangeCallback>();
  #onActiveSnippetChangeCallbacks: Set<OnActiveSnippetChangeCallback> = new Set<OnActiveSnippetChangeCallback>();

  public get codeSnippets(): CodeSnippet[] {
    return Array.from(this.#codeSnippetById.values());
  }

  public addSnippet(snippet: CodeSnippet): void {
    this.#codeSnippetById.set(snippet.id, snippet);
    this.#handleListChange();
  }

  public removeSnippet(snippetId: CodeSnippetId): void {
    this.#codeSnippetById.delete(snippetId);
    this.#handleListChange();
  }

  public activateSnippet(snippetId: CodeSnippetId): void {
    this.#handleActiveSnippetChange(snippetId);
  }

  public setSnippetCode(snippetId: CodeSnippetId, code: string): void {
    const targetSnippet: CodeSnippet = this.#getSnippetById(snippetId);
    targetSnippet.updateCode(code);
    this.#handleListChange();
  }

  public subscribeToSnippetListChanges(callback: OnSnippetListChangeCallback): void {
    this.#onSnippetListChangeCallbacks.add(callback);
  }

  public unsubscribeFromSnippetListChanges(callback: OnSnippetListChangeCallback): void {
    this.#onSnippetListChangeCallbacks.delete(callback);
  }

  public subscribeToActiveSnippetChange(callback: OnActiveSnippetChangeCallback): void {
    this.#onActiveSnippetChangeCallbacks.add(callback);
  }

  public unsubscribeFromActiveSnippetChange(callback: OnActiveSnippetChangeCallback): void {
    this.#onActiveSnippetChangeCallbacks.delete(callback);
  }

  #handleListChange(): void {
    this.#onSnippetListChangeCallbacks.forEach((callback: OnSnippetListChangeCallback) => callback(this.codeSnippets));
  }

  #handleActiveSnippetChange(activeSnippetId: CodeSnippetId): void {
    const activeSnippet: CodeSnippet = this.#getSnippetById(activeSnippetId);
    this.#onActiveSnippetChangeCallbacks.forEach((callback: OnActiveSnippetChangeCallback) => callback(activeSnippet));
  }

  #getSnippetById(snippetId: CodeSnippetId): NonNullable<CodeSnippet> {
    const targetSnippet: CodeSnippet | undefined = this.#codeSnippetById.get(snippetId);

    if (targetSnippet === undefined) {
      throw new ContextualError(this, `Snippet with id "${snippetId}" does not exist.`);
    }
    return targetSnippet;
  }
}
