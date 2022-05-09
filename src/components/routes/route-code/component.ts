import { Application } from '@application';
import { Editor } from '@declarations/classes/editor.class';
import { Connectable } from '@declarations/interfaces/connectable.interface';
import { Disconnectable } from '@declarations/interfaces/disconnectable.interface';
import { OnEditorValueChangeCallback } from '@declarations/types/on-editor-value-change-callback.type';
import { OnWindowSizeChangeCallback } from '@declarations/types/on-window-size-change-callback.type';
import { PerfComponentSelector } from '@declarations/types/perf-component-selector.type';
import { ExecutionService } from '@services/execution';
import { WindowResizingService } from '@services/window-resizing';
import componentStyles from './component.scss';

export class RouteCodeComponent extends HTMLElement implements Connectable, Disconnectable {
  readonly #editorContainer: HTMLElement = RouteCodeComponent.#getEditorContainerElement();

  public static readonly selector: PerfComponentSelector = 'perf-route-code';

  readonly #editor: Editor = new Editor(this.#editorContainer);
  readonly #windowResizingService: WindowResizingService = Application.getBackgroundService(WindowResizingService);
  readonly #executionService: ExecutionService = Application.getBackgroundService(ExecutionService);

  readonly #onWindowSizeChangesListener: OnWindowSizeChangeCallback = () => {
    this.#editor.refreshSize();
  };

  readonly #onEditorValueChangesListener: OnEditorValueChangeCallback = (code: string) => {
    this.#executionService.setSourceCode(code);
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
    this.#editor.subscribeToValueChanges(this.#onEditorValueChangesListener);
    this.#windowResizingService.subscribeToWindowSizeChanges(this.#onWindowSizeChangesListener);
  }

  public disconnectedCallback(): void {
    this.#editor.destroy();
    this.#editor.unsubscribeFromValueChanges(this.#onEditorValueChangesListener);
    this.#windowResizingService.unsubscribeFromWindowSizeChanges(this.#onWindowSizeChangesListener);
  }

  static #getEditorContainerElement(): HTMLElement {
    const sectionElement: HTMLElement = document.createElement('section');
    sectionElement.classList.add('editor-container');
    return sectionElement;
  }
}
