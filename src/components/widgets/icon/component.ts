import { AttributeListener } from '@declarations/interfaces/attribute-listener.interface';
import type { WebComponentSelector } from '@declarations/types/web-component-selector.type';
import componentStyles from './component.scss';

export class IconComponent extends HTMLElement implements AttributeListener {
  #colorStyle: string = '';
  #svgElement: SVGElement | undefined;

  readonly #objectElement: HTMLObjectElement = IconComponent.#getIconElement();

  public static readonly selector: WebComponentSelector = 'perf-icon';

  public static get observedAttributes(): string[] {
    return ['src', 'color'];
  }

  constructor() {
    super();

    const shadowRoot: ShadowRoot = this.attachShadow({ mode: 'closed' });
    const style: HTMLStyleElement = document.createElement('style');
    style.innerHTML = componentStyles;

    shadowRoot.appendChild(style);
    shadowRoot.appendChild(this.#objectElement);
  }

  public attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) {
      return;
    }

    if (name === 'src') {
      this.#setNewIcon(newValue);
    }

    if (name === 'color') {
      this.#setNewColor(newValue);
    }
  }

  #synchronizeColorWithEmbeddedIcon(): void {
    if (this.#svgElement === undefined) {
      return;
    }

    this.#svgElement.setAttribute('style', `color: ${this.#colorStyle}`);
  }

  #setNewColor(newValue: string): void {
    this.#colorStyle = newValue;
    this.#synchronizeColorWithEmbeddedIcon();
  }

  #setNewIcon(newIconPath: string): void {
    this.#objectElement.setAttribute('data', newIconPath);

    const listenerOptions: AddEventListenerOptions = {
      once: true,
      passive: true
    };
    const onLoadListener: EventListener = () => {
      const embeddedDocument: Document = this.#objectElement.getSVGDocument();
      this.#svgElement = embeddedDocument.querySelector('svg');
      this.#synchronizeColorWithEmbeddedIcon();
    };
    this.#objectElement.addEventListener('load', onLoadListener, listenerOptions);
  }

  static #getIconElement(): HTMLObjectElement {
    const iconElement: HTMLObjectElement = document.createElement('object');
    iconElement.classList.add('.icon');
    iconElement.setAttribute('width', '100%');
    iconElement.setAttribute('height', '100%');
    return iconElement;
  }
}
