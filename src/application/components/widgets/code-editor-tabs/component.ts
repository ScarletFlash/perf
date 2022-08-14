import { CodeSnippetsService } from '@application/background-services/code-snippets.service';
import { CodeSnippet } from '@application/declarations/classes/code-snippet.class';
import { ContextualError } from '@application/declarations/classes/contextual-error.class';
import { CodeSnippetType } from '@application/declarations/enums/code-snippet-type.enum';
import type { Connectable } from '@application/declarations/interfaces/connectable.interface';
import type { Disconnectable } from '@application/declarations/interfaces/disconnectable.interface';
import type { CodeSnippetId } from '@application/declarations/types/code-snippet-id.type';
import type { OnSnippetListChangeCallback } from '@application/declarations/types/on-snippet-list-change-callback.type';
import { getRandomUnicodeCharFromRange } from '@application/utilities/get-random-unicode-char-from-range.util';
import { Application } from '@framework/application';
import type { PerfComponentSelector } from '@framework/declarations/types/perf-component-selector.type';
import { CodeEditorTabsItemComponent } from '../code-editor-tabs-item/component';
import { CodeEditorTabsSelectorComponent } from '../code-editor-tabs-selector/component';
import componentStyles from './component.scss';

export class CodeEditorTabsComponent extends HTMLElement implements Connectable, Disconnectable {
  public static readonly selector: PerfComponentSelector = 'perf-code-editor-tabs';

  readonly #codeSnippetsService: CodeSnippetsService = Application.getBackgroundService(CodeSnippetsService);

  readonly #itemsContainerElement: HTMLElement = CodeEditorTabsComponent.#getItemsContainerElement();
  readonly #addButtonElement: HTMLElement = CodeEditorTabsComponent.#getAddButtonElement();
  readonly #selectorElement: HTMLElement = CodeEditorTabsComponent.#getSelectorComponent();

  constructor() {
    super();

    const shadowRoot: ShadowRoot = this.attachShadow({ mode: 'closed' });

    const style: HTMLStyleElement = document.createElement('style');
    style.innerHTML = componentStyles;

    const wrapperElement: HTMLElement = CodeEditorTabsComponent.#getWrapperElement();

    wrapperElement.appendChild(this.#itemsContainerElement);
    wrapperElement.appendChild(this.#addButtonElement);
    wrapperElement.appendChild(this.#selectorElement);

    shadowRoot.appendChild(style);
    shadowRoot.appendChild(wrapperElement);
  }

  static #getWrapperElement(): HTMLElement {
    const wrapperElement: HTMLElement = document.createElement('section');
    wrapperElement.classList.add('tabs');
    return wrapperElement;
  }

  static #getItemsContainerElement(): HTMLElement {
    const itemsContainer: HTMLElement = document.createElement('section');
    itemsContainer.classList.add('tabs__items-container');
    return itemsContainer;
  }

  static #getAddButtonElement(): HTMLButtonElement {
    const buttonElement: HTMLButtonElement = document.createElement('button');
    buttonElement.classList.add('tabs__add-new');
    buttonElement.innerText = '+';
    return buttonElement;
  }

  static #getSelectorComponent(): CodeEditorTabsSelectorComponent {
    const selectorComponent: CodeEditorTabsSelectorComponent = Application.getComponentInstance(
      CodeEditorTabsSelectorComponent
    );
    selectorComponent.classList.add('tabs__selector');
    return selectorComponent;
  }

  static #getTabItemComponent({ type, id, name }: CodeSnippet): CodeEditorTabsItemComponent {
    const itemComponent: CodeEditorTabsItemComponent = Application.getComponentInstance(CodeEditorTabsItemComponent);

    const observedAttributeName: typeof CodeEditorTabsItemComponent.observedAttributeName =
      CodeEditorTabsItemComponent.observedAttributeName;

    itemComponent.setAttribute(observedAttributeName.IsRemovable, String(type === CodeSnippetType.Test));
    itemComponent.setAttribute(observedAttributeName.CodeSnippetId, id);
    itemComponent.setAttribute(observedAttributeName.CodeSnippetName, name);
    return itemComponent;
  }

  readonly #onSnippetListChangeCallback: OnSnippetListChangeCallback = (updatedSnippetList: CodeSnippet[]) =>
    this.#renderTabs(updatedSnippetList);

  public connectedCallback(): void {
    this.#addButtonElement.addEventListener('click', this.#buttonClickListener);

    this.#renderTabs(this.#codeSnippetsService.codeSnippets);

    this.#codeSnippetsService.subscribeToSnippetListChanges(this.#onSnippetListChangeCallback);
  }

  public disconnectedCallback(): void {
    this.#addButtonElement.removeEventListener('click', this.#buttonClickListener);

    this.#codeSnippetsService.unsubscribeFromSnippetListChanges(this.#onSnippetListChangeCallback);
  }

  readonly #buttonClickListener: EventListener = (event: Event): void => {
    if (!(event instanceof MouseEvent)) {
      throw new ContextualError(this, `expected MouseEvent, but caught ${event.constructor.name}`);
    }

    const resultUnicodeChar: string = getRandomUnicodeCharFromRange({
      rangeStart: 'U+1F600',
      rangeEnd: 'U+1F64F'
    });

    const newSnippet: CodeSnippet = new CodeSnippet({
      type: CodeSnippetType.Test,
      name: `${resultUnicodeChar} ABC ${Math.random()}`,
      code: `// TITLE: ${resultUnicodeChar}` + '\n\n'
    });

    this.#codeSnippetsService.addSnippet(newSnippet);
  };

  #renderTabs(updatedSnippetList: CodeSnippet[]): void {
    const renderedTabs: CodeEditorTabsItemComponent[] = Array.from(this.#itemsContainerElement.children).filter(
      (childElement: Element): childElement is CodeEditorTabsItemComponent =>
        childElement instanceof CodeEditorTabsItemComponent
    );

    const renderedTabIds: Set<CodeSnippetId> = new Set<CodeSnippetId>(
      renderedTabs
        .map(({ codeSnippetId }: CodeEditorTabsItemComponent) => codeSnippetId)
        .filter(
          (codeSnippetId: CodeSnippetId | undefined): codeSnippetId is CodeSnippetId => codeSnippetId !== undefined
        )
    );
    const renderedTabIdsToKeep: Set<CodeSnippetId> = new Set<CodeSnippetId>(
      updatedSnippetList
        .map(({ id }: CodeSnippet) => id)
        .filter((codeSnippetId: CodeSnippetId) => renderedTabIds.has(codeSnippetId))
    );

    const renderedTabsToRemove: Set<CodeEditorTabsItemComponent> = new Set<CodeEditorTabsItemComponent>();
    renderedTabs.forEach((tab: CodeEditorTabsItemComponent) => {
      const { codeSnippetId }: CodeEditorTabsItemComponent = tab;

      if (codeSnippetId === undefined) {
        throw new ContextualError(this, 'Tab item is rendered without CodeSnippetId');
      }

      const tabIsAlreadyRendered: boolean =
        renderedTabIds.has(codeSnippetId) && renderedTabIdsToKeep.has(codeSnippetId);
      if (tabIsAlreadyRendered) {
        return;
      }

      const tabShouldBeRemoved: boolean = renderedTabIds.has(codeSnippetId) && !renderedTabIdsToKeep.has(codeSnippetId);
      if (tabShouldBeRemoved) {
        renderedTabsToRemove.add(tab);
        return;
      }

      throw new ContextualError(this, 'Trying to remove already removed tab');
    });
    renderedTabsToRemove.forEach((tab: CodeEditorTabsItemComponent) => {
      this.#itemsContainerElement.removeChild(tab);
    });

    const snippetsToRender: CodeSnippet[] = updatedSnippetList.filter(
      ({ id }: CodeSnippet) => !renderedTabIdsToKeep.has(id)
    );
    snippetsToRender.forEach((incomingSnippet: CodeSnippet) => {
      const newTab: CodeEditorTabsItemComponent = CodeEditorTabsComponent.#getTabItemComponent(incomingSnippet);
      this.#itemsContainerElement.appendChild(newTab);
    });
  }
}
