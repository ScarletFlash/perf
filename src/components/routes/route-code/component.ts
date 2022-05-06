import { Connectable } from '@declarations/interfaces/connectable.interface';
import { Disconnectable } from '@declarations/interfaces/disconnectable.interface';
import { PerfComponentSelector } from '@declarations/types/perf-component-selector.type';
import componentStyles from './component.scss';
import { Editor } from './editor';

export class RouteCodeComponent extends HTMLElement implements Connectable, Disconnectable {
  readonly #editorContainer: HTMLElement = RouteCodeComponent.#getEditorContainerElement();

  public static readonly selector: PerfComponentSelector = 'perf-route-code';

  readonly #editor: Editor = new Editor(this.#editorContainer);

  constructor() {
    super();

    const shadowRoot: ShadowRoot = this.attachShadow({ mode: 'closed' });

    const style: HTMLStyleElement = document.createElement('style');
    style.innerHTML = componentStyles;

    shadowRoot.appendChild(style);
    shadowRoot.appendChild(this.#editorContainer);
  }

  public connectedCallback(): void {
    this.#editor.create();
  }

  public disconnectedCallback(): void {
    this.#editor.destroy();
  }

  static #getEditorContainerElement(): HTMLElement {
    const sectionElement: HTMLElement = document.createElement('section');
    sectionElement.classList.add('editor-container');
    return sectionElement;
  }
}
