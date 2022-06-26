import { CodeSnippet } from '@application/declarations/classes/code-snippet.class';
import type { AttributeListener } from '@application/declarations/interfaces/attribute-listener.interface';
import type { Connectable } from '@application/declarations/interfaces/connectable.interface';
import type { Disconnectable } from '@application/declarations/interfaces/disconnectable.interface';
import type { CodeSnippetId } from '@application/declarations/types/code-snippet-id.type';
import type { PerfComponentSelector } from '@framework/declarations/types/perf-component-selector.type';
import componentStyles from './component.scss';

export class CodeEditorTabsItemComponent extends HTMLElement implements Connectable, Disconnectable, AttributeListener {
  public static readonly selector: PerfComponentSelector = 'perf-code-editor-tabs-item';

  readonly #removeTabButton: HTMLButtonElement = CodeEditorTabsItemComponent.#getRemoveButtonElement();
  readonly #wrapperElement: HTMLElement = CodeEditorTabsItemComponent.#getWrapperElement();

  #codeSnippetId?: CodeSnippetId;

  constructor() {
    super();

    const shadowRoot: ShadowRoot = this.attachShadow({ mode: 'closed' });

    const style: HTMLStyleElement = document.createElement('style');
    style.innerHTML = componentStyles;

    shadowRoot.appendChild(style);
    shadowRoot.appendChild(this.#wrapperElement);
  }

  public static get observedAttributes(): string[] {
    return ['isRemovable', 'codeSnippetId'];
  }

  public get codeSnippetId(): CodeSnippetId | undefined {
    return this.#codeSnippetId;
  }

  static #getRemoveButtonElement(): HTMLButtonElement {
    const buttonElement: HTMLButtonElement = document.createElement('button');
    buttonElement.classList.add('tabs_item__remove-button');
    buttonElement.innerText = 'x';
    return buttonElement;
  }

  static #getWrapperElement(): HTMLElement {
    const wrapperElement: HTMLElement = document.createElement('section');
    wrapperElement.classList.add('tabs-item');
    return wrapperElement;
  }

  public connectedCallback(): void {
    throw new Error('Method not implemented.');
  }

  public disconnectedCallback(): void {
    throw new Error('Method not implemented.');
  }

  public attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) {
      return;
    }

    if (name === 'isRemovable') {
      const isRemovable: boolean = Boolean(newValue);
      const buttonShouldBeVisible: boolean = isRemovable;
      this.#toggleRemoveTabButtonVisibility(buttonShouldBeVisible);
    }

    if (name === 'codeSnippetId') {
      this.#codeSnippetId = CodeSnippet.getId(newValue);
    }
  }

  #toggleRemoveTabButtonVisibility(shouldBeVisible: boolean): void {
    const existsInView: boolean = Array.from(this.#wrapperElement.children).includes(this.#removeTabButton);

    if (existsInView === shouldBeVisible) {
      return;
    }

    shouldBeVisible
      ? this.#wrapperElement.appendChild(this.#removeTabButton)
      : this.#wrapperElement.removeChild(this.#removeTabButton);
  }
}
