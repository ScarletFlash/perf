import type { AttributeListener } from '@application/declarations/interfaces/attribute-listener.interface';
import type { PerfComponentSelector } from '@framework/declarations/types/perf-component-selector.type';
import componentStyles from './component.scss';

enum ObservedAttributeName {
  Title = 'title',
  Value = 'value'
}

export class ExecutionControlInfoItemComponent extends HTMLElement implements AttributeListener {
  public static readonly selector: PerfComponentSelector = 'perf-execution-control-info-item';

  public static readonly observedAttributeName: typeof ObservedAttributeName = ObservedAttributeName;

  readonly #titleElement: HTMLSpanElement = ExecutionControlInfoItemComponent.#getTitleElement();
  readonly #valueElement: HTMLSpanElement = ExecutionControlInfoItemComponent.#getValueElement();

  constructor() {
    super();

    const shadowRoot: ShadowRoot = this.attachShadow({ mode: 'closed' });

    const wrapperElement: HTMLElement = document.createElement('section');
    wrapperElement.classList.add('info-item');

    wrapperElement.appendChild(this.#valueElement);
    wrapperElement.appendChild(this.#titleElement);

    const style: HTMLStyleElement = document.createElement('style');
    style.innerHTML = componentStyles;

    shadowRoot.appendChild(style);
    shadowRoot.appendChild(wrapperElement);
  }

  public static get observedAttributes(): ObservedAttributeName[] {
    return [ObservedAttributeName.Title, ObservedAttributeName.Value];
  }

  static #getTitleElement(): HTMLSpanElement {
    const titleElement: HTMLElement = document.createElement('span');
    titleElement.classList.add('info-item__title');
    return titleElement;
  }

  static #getValueElement(): HTMLSpanElement {
    const valueElement: HTMLElement = document.createElement('span');
    valueElement.classList.add('info-item__value');
    return valueElement;
  }

  public attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) {
      return;
    }

    if (name === ObservedAttributeName.Title) {
      this.#titleElement.innerText = newValue;
    }

    if (name === ObservedAttributeName.Value) {
      this.#valueElement.innerText = newValue;
    }
  }
}
