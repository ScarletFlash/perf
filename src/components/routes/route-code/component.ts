import { AttributeListener } from '@declarations/interfaces/attribute-listener.interface';
import { Disconnectable } from '@declarations/interfaces/disconnectable.interface';
import { PerfComponentSelector } from '@declarations/types/perf-component-selector.type';
import { isPerfComponentSelector } from '@utilities/is-perf-component-selector.util';
import { editor, Environment, Window } from 'monaco-editor';
import componentStyles from './component.scss';

export class RouteCodeComponent extends HTMLElement implements Disconnectable, AttributeListener {
  readonly #registeredSelectors: Set<PerfComponentSelector> = new Set<PerfComponentSelector>();
  readonly #editor: editor.IStandaloneCodeEditor;

  public static readonly selector: PerfComponentSelector = 'perf-route-code';

  public static get observedAttributes(): string[] {
    return ['selectors'];
  }

  constructor() {
    super();

    this.#setMonacoEnvironment();

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

  #setMonacoEnvironment(): void {
    const environmentKey: keyof Window = 'MonacoEnvironment';
    if (!(environmentKey in self)) {
      const environment: Environment = {
        getWorkerUrl: (_moduleId: string, label: string): string => {
          if (label === 'typescript' || label === 'javascript') {
            return './ts.worker.bundle.js';
          }
          return './editor.worker.bundle.js';
        }
      };
      Object.defineProperty(self, environmentKey, {
        value: environment
      });
    }
  }

  public attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue || name !== 'selectors') {
      return;
    }

    const resultValues: unknown = JSON.parse(newValue);
    if (!RouteCodeComponent.#isCustomElementsSelectorsList(resultValues)) {
      throw new Error('[CurrentRouteComponent] selectors attribute contains invalid value');
    }

    resultValues.forEach((selector: PerfComponentSelector) => this.#registeredSelectors.add(selector));
  }

  public disconnectedCallback(): void {
    this.#editor.dispose();
  }

  static #isCustomElementsSelectorsList(serializedValue: unknown): serializedValue is PerfComponentSelector[] {
    if (!Array.isArray(serializedValue)) {
      return false;
    }

    return serializedValue.every((valueItem: string) => isPerfComponentSelector(valueItem));
  }
}
