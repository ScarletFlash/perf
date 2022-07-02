import { CodeSnippet } from '@application/declarations/classes/code-snippet.class';
import type { AttributeListener } from '@application/declarations/interfaces/attribute-listener.interface';
import type { Connectable } from '@application/declarations/interfaces/connectable.interface';
import type { Disconnectable } from '@application/declarations/interfaces/disconnectable.interface';
import type { CodeSnippetId } from '@application/declarations/types/code-snippet-id.type';
import type { PerfComponentSelector } from '@framework/declarations/types/perf-component-selector.type';
import componentStyles from './component.scss';

enum ObservedAttributeName {
  IsRemovable = 'is_removable',
  CodeSnippetId = 'code_snippet_id',
  CodeSnippetName = 'code_snippet_name'
}

export class CodeEditorTabsItemComponent extends HTMLElement implements Connectable, Disconnectable, AttributeListener {
  public static readonly selector: PerfComponentSelector = 'perf-code-editor-tabs-item';

  public static readonly observedAttributeName: typeof ObservedAttributeName = ObservedAttributeName;

  readonly #removeTabButton: HTMLButtonElement = CodeEditorTabsItemComponent.#getRemoveButtonElement();
  readonly #wrapperElement: HTMLElement = CodeEditorTabsItemComponent.#getWrapperElement();
  readonly #nameElement: HTMLSpanElement = CodeEditorTabsItemComponent.#getNameElement();

  #codeSnippetId?: CodeSnippetId;

  constructor() {
    super();

    const shadowRoot: ShadowRoot = this.attachShadow({ mode: 'closed' });

    const style: HTMLStyleElement = document.createElement('style');
    style.innerHTML = componentStyles;

    this.#wrapperElement.appendChild(this.#nameElement);

    shadowRoot.appendChild(style);
    shadowRoot.appendChild(this.#wrapperElement);
  }

  public static get observedAttributes(): ObservedAttributeName[] {
    return [
      ObservedAttributeName.IsRemovable,
      ObservedAttributeName.CodeSnippetId,
      ObservedAttributeName.CodeSnippetName
    ];
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

  static #getNameElement(): HTMLSpanElement {
    const nameElement: HTMLSpanElement = document.createElement('span');
    nameElement.classList.add('tabs-item__name');
    return nameElement;
  }

  public connectedCallback(): void {
    return;
  }

  public disconnectedCallback(): void {
    return;
  }

  public attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) {
      return;
    }

    if (name === ObservedAttributeName.IsRemovable) {
      const isRemovable: boolean = newValue === 'true';
      const buttonShouldBeVisible: boolean = isRemovable;
      this.#toggleRemoveTabButtonVisibility(buttonShouldBeVisible);
    }

    if (name === ObservedAttributeName.CodeSnippetId) {
      this.#codeSnippetId = CodeSnippet.getId(newValue);
    }

    if (name === ObservedAttributeName.CodeSnippetName) {
      this.#nameElement.innerText = newValue;
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
