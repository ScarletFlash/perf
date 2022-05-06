import { AttributeListener } from '@declarations/interfaces/attribute-listener.interface';
import { PerfComponentSelector } from '@declarations/types/perf-component-selector.type';
import { isWebComponentSelector } from '@utilities/is-web-component-selector.util';
import componentStyles from './component.scss';

export class RouteAnalysisComponent extends HTMLElement implements AttributeListener {
  readonly #registeredSelectors: Set<PerfComponentSelector> = new Set<PerfComponentSelector>();

  public static readonly selector: PerfComponentSelector = 'perf-route-analysis';

  public static get observedAttributes(): string[] {
    return ['selectors'];
  }

  constructor() {
    super();

    const shadowRoot: ShadowRoot = this.attachShadow({ mode: 'closed' });
    const wrapperSectionElement: HTMLElement = document.createElement('section');
    const style: HTMLStyleElement = document.createElement('style');

    style.innerHTML = componentStyles;

    shadowRoot.appendChild(style);
    shadowRoot.appendChild(wrapperSectionElement);
  }

  public attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue || name !== 'selectors') {
      return;
    }

    const resultValues: unknown = JSON.parse(newValue);
    if (!RouteAnalysisComponent.#isCustomElementsSelectorsList(resultValues)) {
      throw new Error('[CurrentRouteComponent] selectors attribute contains invalid value');
    }

    resultValues.forEach((selector: PerfComponentSelector) => this.#registeredSelectors.add(selector));
  }

  static #isCustomElementsSelectorsList(serializedValue: unknown): serializedValue is PerfComponentSelector[] {
    if (!Array.isArray(serializedValue)) {
      return false;
    }

    return serializedValue.every((valueItem: string) => isWebComponentSelector(valueItem));
  }
}
