import { ExecutionService } from '@application/background-services/execution.service';
import { WindowResizingService } from '@application/background-services/window-resizing.service';
import { Editor } from '@application/declarations/classes/editor.class';
import type { Connectable } from '@application/declarations/interfaces/connectable.interface';
import type { Disconnectable } from '@application/declarations/interfaces/disconnectable.interface';
import type { OnEditorValueChangeCallback } from '@application/declarations/types/on-editor-value-change-callback.type';
import type { OnWindowSizeChangeCallback } from '@application/declarations/types/on-window-size-change-callback.type';
import { Application } from '@framework/application';
import type { PerfComponentSelector } from '@framework/declarations/types/perf-component-selector.type';
import componentStyles from './component.scss';

export class RouteCodeComponent extends HTMLElement implements Connectable, Disconnectable {
  public static readonly selector: PerfComponentSelector = 'perf-route-code';

  readonly #editorContainer: HTMLElement = RouteCodeComponent.#getEditorContainerElement();

  readonly #editor: Editor = new Editor(this.#editorContainer);
  readonly #windowResizingService: WindowResizingService = Application.getBackgroundService(WindowResizingService);
  readonly #executionService: ExecutionService = Application.getBackgroundService(ExecutionService);

  constructor() {
    super();

    const shadowRoot: ShadowRoot = this.attachShadow({ mode: 'closed' });

    const style: HTMLStyleElement = document.createElement('style');
    style.innerHTML = componentStyles;

    shadowRoot.appendChild(style);
    shadowRoot.appendChild(this.#editorContainer);
  }

  static #getEditorContainerElement(): HTMLElement {
    const sectionElement: HTMLElement = document.createElement('section');
    sectionElement.classList.add('editor-container');
    return sectionElement;
  }

  readonly #onWindowSizeChangesListener: OnWindowSizeChangeCallback = () => {
    this.#editor.refreshSize();
  };

  readonly #onEditorValueChangesListener: OnEditorValueChangeCallback = (code: string) => {
    this.#executionService.setSourceCode(code);
  };

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
}
