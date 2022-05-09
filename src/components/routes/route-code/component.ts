import { Application } from '@application';
import { Connectable } from '@declarations/interfaces/connectable.interface';
import { Disconnectable } from '@declarations/interfaces/disconnectable.interface';
import { OnWindowSizeChangeCallback } from '@declarations/types/on-window-size-change-callback.type';
import { PerfComponentSelector } from '@declarations/types/perf-component-selector.type';
import { WindowResizingService } from '@services/window-resizing';
import componentStyles from './component.scss';
import { Editor } from './editor';

export class RouteCodeComponent extends HTMLElement implements Connectable, Disconnectable {
  readonly #editorContainer: HTMLElement = RouteCodeComponent.#getEditorContainerElement();

  public static readonly selector: PerfComponentSelector = 'perf-route-code';

  readonly #editor: Editor = new Editor(this.#editorContainer);
  readonly #windowResizingService: WindowResizingService = Application.getBackgroundService(WindowResizingService);

  readonly #onWindowSizeChangesListener: OnWindowSizeChangeCallback = () => {
    this.#editor.refreshSize();
  };

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
    this.#windowResizingService.subscribeToWindowSizeChanges(this.#onWindowSizeChangesListener);
  }

  public disconnectedCallback(): void {
    this.#editor.destroy();
    this.#windowResizingService.unsubscribeFromWindowSizeChanges(this.#onWindowSizeChangesListener);
  }

  static #getEditorContainerElement(): HTMLElement {
    const sectionElement: HTMLElement = document.createElement('section');
    sectionElement.classList.add('editor-container');
    return sectionElement;
  }
}
