import { AttributeListener } from '@declarations/interfaces/attribute-listener.interface';
import { Disconnectable } from '@declarations/interfaces/disconnectable.interface';
import type { WebComponentSelector } from '@declarations/types/web-component-selector.type';
import { isEmpty } from '@utilities/is-empty.util';
import { isWebComponentSelector } from '@utilities/is-web-component-selector.util';
import componentStyles from './component.scss';

export class CurrentRouteComponent extends HTMLElement implements Disconnectable, AttributeListener {
  readonly #registeredSelectors: Set<WebComponentSelector> = new Set<WebComponentSelector>();
  readonly #wrapperSectionElement: HTMLElement;
  readonly #hashChangeListener: EventListener;

  #currentHash: string = '';

  public static readonly selector: WebComponentSelector = 'perf-current-route';

  public static get observedAttributes(): string[] {
    return ['selectors'];
  }

  constructor() {
    super();

    const shadowRoot: ShadowRoot = this.attachShadow({ mode: 'closed' });
    this.#wrapperSectionElement = document.createElement('section');

    const style: HTMLStyleElement = document.createElement('style');

    style.innerHTML = componentStyles;

    shadowRoot.appendChild(style);
    shadowRoot.appendChild(this.#wrapperSectionElement);

    this.#hashChangeListener = (event: Event): void => {
      if (!(event instanceof HashChangeEvent)) {
        return;
      }

      const { newURL }: HashChangeEvent = event;
      const targetHash: string = new URL(newURL).hash;
      if (this.#currentHash === targetHash) {
        return;
      }
      this.#currentHash = targetHash;

      const targetComponentSelector: string = targetHash.replace('#', 'perf-route-');
      this.#renderContentBySelector(targetComponentSelector);
    };

    window.addEventListener('hashchange', this.#hashChangeListener);
  }

  public attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue || name !== 'selectors') {
      return;
    }

    const resultValues: unknown = JSON.parse(newValue);
    if (!CurrentRouteComponent.#isCustomElementsSelectorsList(resultValues)) {
      throw new Error('[CurrentRouteComponent] selectors attribute contains invalid value');
    }

    resultValues.forEach((selector: WebComponentSelector) => this.#registeredSelectors.add(selector));

    const firstSelectorAvailable: string | undefined = resultValues.at(0);
    if (isEmpty(this.#currentHash) && firstSelectorAvailable !== undefined) {
      this.#renderContentBySelector(firstSelectorAvailable);
    }
  }

  public disconnectedCallback(): void {
    window.removeEventListener('hashchange', this.#hashChangeListener);
  }

  #renderContentBySelector(targetComponentSelector: string): void {
    if (!isWebComponentSelector(targetComponentSelector) || !this.#registeredSelectors.has(targetComponentSelector)) {
      throw new Error(
        `[CurrentRouteComponent] component with selector "${targetComponentSelector}" is not reachable. Available components are: "${Array.from(
          this.#registeredSelectors
        ).join('", "')}"`
      );
    }

    const targetComponent: HTMLElement = document.createElement(targetComponentSelector);
    if (this.#wrapperSectionElement.childElementCount > 0) {
      Array.from(this.#wrapperSectionElement.children).forEach((childElement: Element) => childElement.remove());
    }
    this.#wrapperSectionElement.appendChild(targetComponent);
  }

  static #isCustomElementsSelectorsList(serializedValue: unknown): serializedValue is WebComponentSelector[] {
    if (!Array.isArray(serializedValue)) {
      return false;
    }

    return serializedValue.every((valueItem: string) => isWebComponentSelector(valueItem));
  }
}
