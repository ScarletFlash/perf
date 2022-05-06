import { AttributeListener } from '@declarations/interfaces/attribute-listener.interface';
import type { WebComponentSelector } from '@declarations/types/web-component-selector.type';
import { IconComponent } from '@widgets/icon';
import componentStyles from './component.scss';

export class PipelineTileComponent extends HTMLElement implements AttributeListener {
  readonly #linkElement: HTMLAnchorElement = PipelineTileComponent.#getLinkElement();
  readonly #tileElement: HTMLElement = PipelineTileComponent.#getTileElement();
  readonly #iconElement: HTMLElement = PipelineTileComponent.#getIconElement();
  readonly #textElement: HTMLSpanElement = PipelineTileComponent.#getTextElement();

  #isActive: boolean = false;
  #url: string = '';
  public get url(): string {
    return this.#url;
  }

  public static readonly selector: WebComponentSelector = 'perf-pipeline-tile';

  public static get observedAttributes(): string[] {
    return ['text', 'icon', 'isActive', 'url'];
  }

  constructor() {
    super();

    const shadowRoot: ShadowRoot = this.attachShadow({ mode: 'closed' });
    const style: HTMLStyleElement = document.createElement('style');

    const markerElement: HTMLElement = PipelineTileComponent.#getMarkerElement();

    this.#tileElement.appendChild(markerElement);
    this.#tileElement.appendChild(this.#iconElement);
    this.#tileElement.appendChild(this.#textElement);

    this.#linkElement.appendChild(this.#tileElement);

    style.innerHTML = componentStyles;

    shadowRoot.appendChild(style);
    shadowRoot.appendChild(this.#linkElement);
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

    if (name === 'isActive') {
      const targetState: boolean = Boolean(newValue);
      this.setActivationState(targetState);
    }

    if (name === 'url') {
      this.#linkElement.setAttribute('href', newValue);
      this.#url = newValue;
    }
  }

  public setActivationState(targetState: boolean) {
    if (this.#isActive === targetState) {
      return;
    }

    this.#isActive = targetState;
    const activeModifierName: string = 'tile_active';
    this.#isActive
      ? this.#tileElement.classList.add(activeModifierName)
      : this.#tileElement.classList.remove(activeModifierName);
  }

  static #getLinkElement(): HTMLAnchorElement {
    const linkElement: HTMLAnchorElement = document.createElement('a');
    return linkElement;
  }

  static #getTileElement(): HTMLElement {
    const tileElement: HTMLElement = document.createElement('section');
    tileElement.classList.add('tile');
    return tileElement;
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

  static #getMarkerElement(): HTMLElement {
    const markerElement: HTMLElement = document.createElement('div');
    markerElement.classList.add('tile__marker');
    return markerElement;
  }
}
