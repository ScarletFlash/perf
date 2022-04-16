import type { WebComponentSelector } from '@declarations/types/web-component-selector.type';
import { isWebComponentSelector } from '@utilities/is-web-component-selector.util';
import { initialize, InitializeOptions, transform, TransformResult } from 'esbuild-wasm/esm/browser';
import componentStyles from './component.scss';

export class RouteMinificationComponent extends HTMLElement {
  readonly #registeredSelectors: Set<WebComponentSelector> = new Set<WebComponentSelector>();

  static #wasmModuleIsInitialized: boolean = false;

  public static readonly selector: WebComponentSelector = 'perf-route-minification';

  public static get observedAttributes(): string[] {
    return ['selectors'];
  }

  constructor() {
    super();

    this.#initializeWasm().then(async () => {
      console.log('initialized');

      const result: TransformResult = await transform('const someMan = {name: "Richard"}; console.log(someMan);');
      console.log({ result });
    });

    const shadowRoot: ShadowRoot = this.attachShadow({ mode: 'closed' });
    const wrapperSectionElement: HTMLElement = document.createElement('section');
    const style: HTMLStyleElement = document.createElement('style');

    style.innerHTML = componentStyles;

    shadowRoot.appendChild(style);
    shadowRoot.appendChild(wrapperSectionElement);
  }

  async #initializeWasm(): Promise<void> {
    return Promise.resolve().then(() => {
      if (RouteMinificationComponent.#wasmModuleIsInitialized) {
        return;
      }

      const initializeOptions: InitializeOptions = {
        wasmURL: './esbuild.wasm.bundle.js',
        worker: true
      };
      return initialize(initializeOptions).then(() => {
        RouteMinificationComponent.#wasmModuleIsInitialized = true;
      });
    });
  }

  public attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue || name !== 'selectors') {
      return;
    }

    const resultValues: unknown = JSON.parse(newValue);
    if (!RouteMinificationComponent.#isCustomElementsSelectorsList(resultValues)) {
      throw new Error('[CurrentRouteComponent] selectors attribute contains invalid value');
    }

    resultValues.forEach((selector: WebComponentSelector) => this.#registeredSelectors.add(selector));
  }

  static #isCustomElementsSelectorsList(serializedValue: unknown): serializedValue is WebComponentSelector[] {
    if (!Array.isArray(serializedValue)) {
      return false;
    }

    return serializedValue.every((valueItem: string) => isWebComponentSelector(valueItem));
  }
}
