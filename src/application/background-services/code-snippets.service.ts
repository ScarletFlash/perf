import type { CodeSnippet } from '@application/declarations/classes/code-snippet.class';
import type { CodeSnippetId } from '@application/declarations/types/code-snippet-id.type';
import type { OnSnippetListChangeCallback } from '@application/declarations/types/on-snippet-list-change-callback.type';

export class CodeSnippetsService {
  readonly #codeSnippetById: Map<CodeSnippetId, CodeSnippet> = new Map<CodeSnippetId, CodeSnippet>();

  #onSnippetListChangeCallbacks: Set<OnSnippetListChangeCallback> = new Set<OnSnippetListChangeCallback>();

  public get codeSnippets(): CodeSnippet[] {
    return Array.from(this.#codeSnippetById.values());
  }

  public addSnippet(snippet: CodeSnippet): void {
    this.#codeSnippetById.set(snippet.id, snippet);
    this.#handleListChange();
  }

  public removeSnippet(snippet: CodeSnippet): void {
    this.#codeSnippetById.delete(snippet.id);
    this.#handleListChange();
  }

  public subscribeToSnippetListChanges(callback: OnSnippetListChangeCallback): void {
    this.#onSnippetListChangeCallbacks.add(callback);
  }

  public unsubscribeFromSnippetListChanges(callback: OnSnippetListChangeCallback): void {
    this.#onSnippetListChangeCallbacks.delete(callback);
  }

  #handleListChange(): void {
    this.#onSnippetListChangeCallbacks.forEach((callback: OnSnippetListChangeCallback) => callback(this.codeSnippets));
  }
}
