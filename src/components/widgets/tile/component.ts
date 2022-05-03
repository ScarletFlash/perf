import { AttributeListener } from '@declarations/interfaces/attribute-listener.interface';
import type { WebComponentSelector } from '@declarations/types/web-component-selector.type';
import componentStyles from './component.scss';

export class TileComponent extends HTMLElement implements AttributeListener {
  readonly #iconElement: HTMLObjectElement = TileComponent.#getIconElement();
  readonly #textElement: HTMLSpanElement = TileComponent.#getTextElement();

  public static readonly selector: WebComponentSelector = 'perf-tile';

  public static get observedAttributes(): string[] {
    return ['text', 'icon'];
  }

  constructor() {
    super();

    const shadowRoot: ShadowRoot = this.attachShadow({ mode: 'closed' });
    const wrapperSectionElement: HTMLElement = document.createElement('section');
    const style: HTMLStyleElement = document.createElement('style');

    const lineElement: HTMLElement = TileComponent.#getLineElement();

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
      this.#iconElement.setAttribute('data', newValue);
      this.#setIconColor(0xff0000);
    }

    if (name === 'text') {
      this.#textElement.innerText = newValue;
    }
  }

  #setIconColor(_colorHex: number): void {}

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

  static #getIconElement(): HTMLObjectElement {
    const iconsSizePx: number = 48;
    const iconSizeStyle: string = `${iconsSizePx}px`;
    const iconElement: HTMLObjectElement = document.createElement('object');
    iconElement.classList.add('tile__icon');
    iconElement.setAttribute('width', iconSizeStyle);
    iconElement.setAttribute('height', iconSizeStyle);
    return iconElement;
  }
}
