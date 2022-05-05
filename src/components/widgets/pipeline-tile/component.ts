import { AttributeListener } from '@declarations/interfaces/attribute-listener.interface';
import type { WebComponentSelector } from '@declarations/types/web-component-selector.type';
import { IconComponent } from '@widgets/icon';
import componentStyles from './component.scss';

export class PipelineTileComponent extends HTMLElement implements AttributeListener {
  readonly #iconElement: HTMLElement = PipelineTileComponent.#getIconElement();
  readonly #textElement: HTMLSpanElement = PipelineTileComponent.#getTextElement();

  public static readonly selector: WebComponentSelector = 'perf-pipeline-tile';

  public static get observedAttributes(): string[] {
    return ['text', 'icon'];
  }

  constructor() {
    super();

    const shadowRoot: ShadowRoot = this.attachShadow({ mode: 'closed' });
    const wrapperSectionElement: HTMLElement = document.createElement('section');
    const style: HTMLStyleElement = document.createElement('style');

    const lineElement: HTMLElement = PipelineTileComponent.#getLineElement();

    wrapperSectionElement.classList.add('tile');
    wrapperSectionElement.appendChild(lineElement);
    wrapperSectionElement.appendChild(this.#iconElement);
    wrapperSectionElement.appendChild(this.#textElement);
    wrapperSectionElement.appendChild(lineElement.cloneNode());
    style.innerHTML = componentStyles;

    shadowRoot.appendChild(style);
    shadowRoot.appendChild(wrapperSectionElement);
  }

  public attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) {
      return;
    }

    if (name === 'icon') {
      this.#iconElement.setAttribute('src', newValue);
    }

    if (name === 'text') {
      this.#textElement.innerText = newValue;
    }
  }

  static #getLineElement(): HTMLDivElement {
    const lineElement: HTMLDivElement = document.createElement('div');
    lineElement.classList.add('tile__line');
    return lineElement;
  }

  static #getTextElement(): HTMLSpanElement {
    const textElement: HTMLSpanElement = document.createElement('span');
    textElement.classList.add('tile__text');
    return textElement;
  }

  static #getIconElement(): HTMLElement {
    const iconElement: HTMLElement = document.createElement(IconComponent.selector);
    iconElement.classList.add('tile__icon');
    return iconElement;
  }
}
