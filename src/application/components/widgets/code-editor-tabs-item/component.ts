import { CodeSnippetsService } from '@application/background-services/code-snippets.service';
import { TabsSelectionService } from '@application/background-services/tabs-selection.service';
import { CodeSnippet } from '@application/declarations/classes/code-snippet.class';
import { ContextualError } from '@application/declarations/classes/contextual-error.class';
import type { AttributeListener } from '@application/declarations/interfaces/attribute-listener.interface';
import type { Connectable } from '@application/declarations/interfaces/connectable.interface';
import type { Disconnectable } from '@application/declarations/interfaces/disconnectable.interface';
import type { CodeSnippetId } from '@application/declarations/types/code-snippet-id.type';
import { $color_background } from '@application/styles/variables';
import { getElementWithAllChildren } from '@application/utilities/get-element-with-all-children.util';
import { Application } from '@framework/application';
import type { PerfComponentSelector } from '@framework/declarations/types/perf-component-selector.type';
import { IconComponent } from '../icon/component';
import componentStyles from './component.scss';

enum ObservedAttributeName {
  IsRemovable = 'is_removable',
  CodeSnippetId = 'code_snippet_id',
  CodeSnippetName = 'code_snippet_name'
}

export class CodeEditorTabsItemComponent extends HTMLElement implements Connectable, Disconnectable, AttributeListener {
  public static readonly selector: PerfComponentSelector = 'perf-code-editor-tabs-item';

  public static readonly observedAttributeName: typeof ObservedAttributeName = ObservedAttributeName;

  readonly #codeSnippetsService: CodeSnippetsService = Application.getBackgroundService(CodeSnippetsService);
  readonly #tabsSelectionService: TabsSelectionService = Application.getBackgroundService(TabsSelectionService);

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
    const iconComponent: IconComponent = Application.getComponentInstance(IconComponent);

    const observedAttributeName: typeof IconComponent.observedAttributeName = IconComponent.observedAttributeName;
    iconComponent.setAttribute(observedAttributeName.Source, '/assets/images/cross-icon.svg');
    iconComponent.setAttribute(observedAttributeName.Color, $color_background);

    const buttonElement: HTMLButtonElement = document.createElement('button');
    buttonElement.classList.add('tabs-item__remove-button');
    buttonElement.appendChild(iconComponent);

    return buttonElement;
  }

  static #getWrapperElement(): HTMLElement {
    const wrapperElement: HTMLElement = document.createElement('section');
    wrapperElement.classList.add('tabs-item');
    return wrapperElement;
  }

  static #getNameElement(): HTMLElement {
    const nameElement: HTMLElement = document.createElement('div');
    nameElement.classList.add('tabs-item__name');
    return nameElement;
  }

  public connectedCallback(): void {
    this.#wrapperElement.addEventListener('click', this.#buttonClickListener);
  }

  public disconnectedCallback(): void {
    this.#wrapperElement.removeEventListener('click', this.#buttonClickListener);
  }

  public attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) {
      return;
    }

    if (name === ObservedAttributeName.IsRemovable) {
      const isRemovable: boolean = newValue === 'true';
      const buttonShouldBeVisible: boolean = isRemovable;

      const staticClass: string = 'tabs-item__name_static';
      isRemovable ? this.#nameElement.classList.remove(staticClass) : this.#nameElement.classList.add(staticClass);

      this.#toggleRemoveTabButtonVisibility(buttonShouldBeVisible);
    }

    if (name === ObservedAttributeName.CodeSnippetId) {
      this.#codeSnippetId = CodeSnippet.getId(newValue);
    }

    if (name === ObservedAttributeName.CodeSnippetName) {
      this.#nameElement.innerText = newValue;
    }
  }

  readonly #buttonClickListener: EventListener = (event: Event): void => {
    if (!(event instanceof MouseEvent)) {
      throw new ContextualError(this, `expected MouseEvent, but caught ${event.constructor.name}`);
    }

    const target: EventTarget | null = event.target;
    if (!(target instanceof HTMLElement)) {
      throw new ContextualError(this, 'unprocessable click target');
    }

    const snippetId: CodeSnippetId | undefined = this.codeSnippetId;
    if (snippetId === undefined) {
      throw new ContextualError(this, 'SnippetId is not defined');
    }

    const isRemoveButtonClick: boolean = getElementWithAllChildren(this.#removeTabButton).has(target);
    if (isRemoveButtonClick) {
      this.#codeSnippetsService.removeSnippet(snippetId);
      event.stopImmediatePropagation();
      return;
    }

    this.#codeSnippetsService.activateSnippet(snippetId);

    this.#updateMarkerPosition();
  };

  #updateMarkerPosition(): void {
    const parentElement: HTMLElement | null = this.parentElement;

    if (parentElement === null) {
      throw new ContextualError(this, 'Tab item should be inside tabs container');
    }

    const { width: currentElementWidthPx, left: currentElementOffsetPx }: DOMRect = this.getBoundingClientRect();
    const { left: parentElementOffsetPx } = parentElement.getBoundingClientRect();

    this.#tabsSelectionService.selectWithParams({
      widthStyle: `${currentElementWidthPx}px`,
      offsetXStyle: `${currentElementOffsetPx - parentElementOffsetPx}px`
    });
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
