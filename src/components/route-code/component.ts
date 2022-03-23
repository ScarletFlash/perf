import { editor } from 'monaco-editor';
import type { WebComponentSelector } from '../../declarations/types/web-component-selector.type';
import { isWebComponentSelector } from '../../utilities/is-web-component-selector.util';
import componentStyles from './component.scss';

export class RouteCodeComponent extends HTMLElement {
  readonly #registeredSelectors: Set<WebComponentSelector> = new Set<WebComponentSelector>();
  readonly #editor: editor.IStandaloneCodeEditor;

  public static readonly selector: WebComponentSelector = 'perf-route-code';

  public static get observedAttributes(): string[] {
    return ['selectors'];
  }

  constructor() {
    super();

    const shadowRoot: ShadowRoot = this.attachShadow({ mode: 'closed' });

    const wrapperSectionElement: HTMLElement = document.createElement('section');
    wrapperSectionElement.classList.add('editor-container');

    const style: HTMLStyleElement = document.createElement('style');
    style.innerHTML = componentStyles;

    shadowRoot.appendChild(style);
    shadowRoot.appendChild(wrapperSectionElement);

    this.#editor = editor.create(wrapperSectionElement, {
      value: "function hello() {\n\talert('Hello world!');\n}",
      language: 'javascript'
    });
  }

  public attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue || name !== 'selectors') {
      return;
    }

    const resultValues: unknown = JSON.parse(newValue);
    if (!RouteCodeComponent.#isCustomElementsSelectorsList(resultValues)) {
      throw new Error('[CurrentRouteComponent] selectors attribute contains invalid value');
    }

    resultValues.forEach((selector: WebComponentSelector) => this.#registeredSelectors.add(selector));
  }

  public disconnectedCallback(): void {
    console.log(this.#editor.getValue());

    this.#editor.dispose();
  }

  static #isCustomElementsSelectorsList(serializedValue: unknown): serializedValue is WebComponentSelector[] {
    if (!Array.isArray(serializedValue)) {
      return false;
    }

    return serializedValue.every((valueItem: string) => isWebComponentSelector(valueItem));
  }
}
