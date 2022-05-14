import type { AttributeListener } from '@declarations/interfaces/attribute-listener.interface';
import type { PerfComponentSelector } from '@framework/declarations/types/perf-component-selector.type';
import { isPerfComponentSelector } from '@utilities/is-perf-component-selector.util';
import componentStyles from './component.scss';

export class RouteConfigurationComponent extends HTMLElement implements AttributeListener {
  public static readonly selector: PerfComponentSelector = 'perf-route-configuration';

  readonly #registeredSelectors: Set<PerfComponentSelector> = new Set<PerfComponentSelector>();

  constructor() {
    super();

    const shadowRoot: ShadowRoot = this.attachShadow({ mode: 'closed' });
    const wrapperSectionElement: HTMLElement = document.createElement('section');
    const style: HTMLStyleElement = document.createElement('style');

    style.innerHTML = componentStyles;

    shadowRoot.appendChild(style);
    shadowRoot.appendChild(wrapperSectionElement);
  }

  public static get observedAttributes(): string[] {
    return ['selectors'];
  }

  static #isCustomElementsSelectorsList(serializedValue: unknown): serializedValue is PerfComponentSelector[] {
    if (!Array.isArray(serializedValue)) {
      return false;
    }

    return serializedValue.every((valueItem: string) => isPerfComponentSelector(valueItem));
  }

  public attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue || name !== 'selectors') {
      return;
    }

    const resultValues: unknown = JSON.parse(newValue);
    if (!RouteConfigurationComponent.#isCustomElementsSelectorsList(resultValues)) {
      throw new Error('[CurrentRouteComponent] selectors attribute contains invalid value');
    }

    resultValues.forEach((selector: PerfComponentSelector) => this.#registeredSelectors.add(selector));
  }
}
