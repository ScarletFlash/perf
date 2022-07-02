import { ContextualError } from '@application/declarations/classes/contextual-error.class';
import type { AttributeListener } from '@application/declarations/interfaces/attribute-listener.interface';
import type { PerfComponentSelector } from '@framework/declarations/types/perf-component-selector.type';
import componentStyles from './component.scss';

enum ObservedAttributeName {
  Source = 'src',
  Color = 'color'
}

export class IconComponent extends HTMLElement implements AttributeListener {
  public static readonly selector: PerfComponentSelector = 'perf-icon';

  public static readonly observedAttributeName: typeof ObservedAttributeName = ObservedAttributeName;

  #colorStyle: string = 'initial';
  #svgElement: SVGElement | null = null;

  readonly #objectElement: HTMLObjectElement = IconComponent.#getIconElement();

  constructor() {
    super();

    const shadowRoot: ShadowRoot = this.attachShadow({ mode: 'closed' });
    const style: HTMLStyleElement = document.createElement('style');
    style.innerHTML = componentStyles;

    shadowRoot.appendChild(style);
    shadowRoot.appendChild(this.#objectElement);
  }

  public static get observedAttributes(): ObservedAttributeName[] {
    return [ObservedAttributeName.Source, ObservedAttributeName.Color];
  }

  static #getIconElement(): HTMLObjectElement {
    const iconElement: HTMLObjectElement = document.createElement('object');
    iconElement.classList.add('icon');
    iconElement.setAttribute('width', '100%');
    iconElement.setAttribute('height', '100%');
    return iconElement;
  }

  public attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) {
      return;
    }

    if (name === 'src') {
      this.#setNewIcon(newValue);
    }

    if (name === 'color') {
      this.setNewColor(newValue);
    }
  }

  public setNewColor(newValue: string): void {
    this.#colorStyle = newValue;
    this.#synchronizeColorWithEmbeddedIcon();
  }

  #synchronizeColorWithEmbeddedIcon(): void {
    if (this.#svgElement === null) {
      return;
    }

    this.#svgElement.setAttribute('style', `color: ${this.#colorStyle}`);
  }

  #setNewIcon(newIconPath: string): void {
    this.#objectElement.setAttribute('data', newIconPath);

    const listenerOptions: AddEventListenerOptions = {
      once: true,
      passive: true
    };
    const onLoadListener: EventListener = () => {
      const embeddedDocument: Document | null = this.#objectElement.getSVGDocument();
      const invalidIconError: Error = new ContextualError(this, 'embedded icon is invalid');

      if (embeddedDocument === null) {
        throw invalidIconError;
      }

      const svgElement: SVGElement | null = embeddedDocument.querySelector('svg');
      if (!(embeddedDocument instanceof SVGElement)) {
        throw invalidIconError;
      }

      this.#svgElement = svgElement;
      this.#synchronizeColorWithEmbeddedIcon();
    };
    this.#objectElement.addEventListener('load', onLoadListener, listenerOptions);
  }
}
