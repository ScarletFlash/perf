import { CodeSnippetsService } from '@application/background-services/code-snippets.service';
import type { CodeSnippet } from '@application/declarations/classes/code-snippet.class';
import { ContextualError } from '@application/declarations/classes/contextual-error.class';
import { CodeSnippetType } from '@application/declarations/enums/code-snippet-type.enum';
import type { Connectable } from '@application/declarations/interfaces/connectable.interface';
import type { Disconnectable } from '@application/declarations/interfaces/disconnectable.interface';
import type { CodeSnippetId } from '@application/declarations/types/code-snippet-id.type';
import type { OnSnippetListChangeCallback } from '@application/declarations/types/on-snippet-list-change-callback.type';
import { Application } from '@framework/application';
import type { PerfComponentSelector } from '@framework/declarations/types/perf-component-selector.type';
import { CodeEditorTabsItemComponent } from '../code-editor-tabs-item/component';
import componentStyles from './component.scss';

export class CodeEditorTabsComponent extends HTMLElement implements Connectable, Disconnectable {
  public static readonly selector: PerfComponentSelector = 'perf-code-editor-tabs';

  readonly #codeSnippetsService: CodeSnippetsService = Application.getBackgroundService(CodeSnippetsService);

  readonly #wrapperElement: HTMLElement = CodeEditorTabsComponent.#getWrapperElement();

  constructor() {
    super();

    const shadowRoot: ShadowRoot = this.attachShadow({ mode: 'closed' });

    const style: HTMLStyleElement = document.createElement('style');
    style.innerHTML = componentStyles;

    shadowRoot.appendChild(style);
    shadowRoot.appendChild(this.#wrapperElement);
  }

  static #getWrapperElement(): HTMLElement {
    const wrapperElement: HTMLElement = document.createElement('section');
    wrapperElement.classList.add('tabs');

    return wrapperElement;
  }

  static #getTabItemComponent({ type, id }: CodeSnippet): CodeEditorTabsItemComponent {
    const itemComponent: HTMLElement = document.createElement(CodeEditorTabsItemComponent.selector);

    if (itemComponent instanceof CodeEditorTabsItemComponent) {
      itemComponent.setAttribute('isRemovable', String(type === CodeSnippetType.Test));
      itemComponent.setAttribute('codeSnippetId', id);
      return itemComponent;
    }

    throw new ContextualError(CodeEditorTabsComponent, 'CodeEditorTabsItemComponent creation is failed');
  }

  readonly #onSnippetListChangeCallback: OnSnippetListChangeCallback = (updatedSnippetList: CodeSnippet[]) =>
    this.#renderTabs(updatedSnippetList);

  public connectedCallback(): void {
    this.#renderTabs(this.#codeSnippetsService.codeSnippets);

    this.#codeSnippetsService.subscribeToSnippetListChanges(this.#onSnippetListChangeCallback);
  }

  public disconnectedCallback(): void {
    this.#codeSnippetsService.unsubscribeFromSnippetListChanges(this.#onSnippetListChangeCallback);
  }

  #renderTabs(updatedSnippetList: CodeSnippet[]): void {
    const renderedTabs: CodeEditorTabsItemComponent[] = Array.from(this.#wrapperElement.children).filter(
      (childElement: Element): childElement is CodeEditorTabsItemComponent =>
        childElement instanceof CodeEditorTabsItemComponent
    );

    const maxTabsCount: number = Math.max(updatedSnippetList.length, renderedTabs.length);

    for (let index: number = 0; index < maxTabsCount; index++) {
      const targetSnippet: CodeSnippet | undefined = updatedSnippetList[index];
      const targetId: CodeSnippetId | undefined = targetSnippet === undefined ? undefined : targetSnippet.id;

      const existingTab: CodeEditorTabsItemComponent | undefined = renderedTabs[index];
      const existingId: CodeSnippetId | undefined = existingTab === undefined ? undefined : existingTab.codeSnippetId;

      if (targetId === existingId) {
        continue;
      }

      const existingTabShouldBeRemoved: boolean = targetId === undefined;
      if (existingTabShouldBeRemoved) {
        this.#wrapperElement.removeChild(existingTab);
        continue;
      }

      const newTab: CodeEditorTabsItemComponent = CodeEditorTabsComponent.#getTabItemComponent(targetSnippet);
      this.#wrapperElement.appendChild(newTab);
    }
  }
}
