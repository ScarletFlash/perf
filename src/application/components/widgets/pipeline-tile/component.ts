import { ContextualError } from '@application/declarations/classes/contextual-error.class';
import type { AttributeListener } from '@application/declarations/interfaces/attribute-listener.interface';
import type { PerfComponentSelector } from '@framework/declarations/types/perf-component-selector.type';
import { $color_active, $color_main } from '@styles/variables';
import { IconComponent } from './../icon/component';
import componentStyles from './component.scss';

export class PipelineTileComponent extends HTMLElement implements AttributeListener {
  public static readonly selector: PerfComponentSelector = 'perf-pipeline-tile';

  readonly #tileElement: HTMLElement = PipelineTileComponent.#getTileElement();
  readonly #iconComponent: IconComponent = PipelineTileComponent.#getIconElement();
  readonly #textElement: HTMLSpanElement = PipelineTileComponent.#getTextElement();

  #isActive: boolean = false;
  #url: string = '';

  constructor() {
    super();

    const shadowRoot: ShadowRoot = this.attachShadow({ mode: 'closed' });
    const style: HTMLStyleElement = document.createElement('style');

    const markerElement: HTMLElement = PipelineTileComponent.#getMarkerElement();

    this.#tileElement.appendChild(markerElement);
    this.#tileElement.appendChild(this.#iconComponent);
    this.#tileElement.appendChild(this.#textElement);

    style.innerHTML = componentStyles;

    shadowRoot.appendChild(style);
    shadowRoot.appendChild(this.#tileElement);
  }

  public static get observedAttributes(): string[] {
    return ['text', 'icon', 'isActive', 'url'];
  }

  public get url(): string {
    return this.#url;
  }

  static #getTileElement(): HTMLElement {
    const tileElement: HTMLAnchorElement = document.createElement('a');
    tileElement.classList.add('tile');
    return tileElement;
  }

  static #getTextElement(): HTMLSpanElement {
    const textElement: HTMLSpanElement = document.createElement('span');
    textElement.classList.add('tile__text');
    return textElement;
  }

  static #getIconElement(): IconComponent {
    const iconComponent: HTMLElement = document.createElement(IconComponent.selector);
    iconComponent.classList.add('tile__icon');
    if (iconComponent instanceof IconComponent) {
      return iconComponent;
    }
    throw new ContextualError(PipelineTileComponent, 'IconComponent creation is failed');
  }

  static #getMarkerElement(): HTMLElement {
    const markerElement: HTMLElement = document.createElement('div');
    markerElement.classList.add('tile__marker');
    return markerElement;
  }

  public attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) {
      return;
    }

    if (name === 'icon') {
      this.#iconComponent.setAttribute('src', newValue);
    }

    if (name === 'text') {
      this.#textElement.innerText = newValue;
    }

    if (name === 'isActive') {
      const targetState: boolean = Boolean(newValue);
      this.setActivationState(targetState);
    }

    if (name === 'url') {
      this.#tileElement.setAttribute('href', newValue);
      this.#url = newValue;
    }
  }

  public setActivationState(targetState: boolean): void {
    if (this.#isActive === targetState) {
      return;
    }

    this.#isActive = targetState;

    const activeModifierName: string = 'tile_active';
    if (this.#isActive) {
      this.#tileElement.classList.add(activeModifierName);
      this.#iconComponent.setNewColor($color_active);
      return;
    }
    this.#tileElement.classList.remove(activeModifierName);
    this.#iconComponent.setNewColor($color_main);
  }
}
