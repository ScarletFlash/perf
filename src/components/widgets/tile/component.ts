import type { WebComponentSelector } from '@declarations/types/web-component-selector.type';
import componentStyles from './component.scss';

export class TileComponent extends HTMLElement {
  readonly #iconElement: HTMLElement;
  readonly #textElement: HTMLSpanElement;

  public static readonly selector: WebComponentSelector = 'perf-tile';

  public static get observedAttributes(): string[] {
    return ['text', 'icon'];
  }

  constructor() {
    super();

    const shadowRoot: ShadowRoot = this.attachShadow({ mode: 'closed' });
    const wrapperSectionElement: HTMLElement = document.createElement('section');
    this.#iconElement = document.createElement('ion-icon');
    this.#textElement = document.createElement('span');
    const style: HTMLStyleElement = document.createElement('style');

    wrapperSectionElement.classList.add('tile');
    wrapperSectionElement.appendChild(this.#iconElement);
    wrapperSectionElement.appendChild(this.#textElement);
    this.#textElement.classList.add('tile__text');
    style.innerHTML = componentStyles;

    shadowRoot.appendChild(style);
    shadowRoot.appendChild(wrapperSectionElement);
  }

  public attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) {
      return;
    }

    if (name === 'icon') {
      this.#iconElement.setAttribute('name', newValue);
    }

    if (name === 'text') {
      this.#textElement.innerText = newValue;
    }
  }
}
