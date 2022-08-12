import { CodeSnippetsService } from '@application/background-services/code-snippets.service';
import { WindowResizingService } from '@application/background-services/window-resizing.service';
import type { CodeSnippet } from '@application/declarations/classes/code-snippet.class';
import { ContextualError } from '@application/declarations/classes/contextual-error.class';
import { Editor } from '@application/declarations/classes/editor.class';
import type { Connectable } from '@application/declarations/interfaces/connectable.interface';
import type { Disconnectable } from '@application/declarations/interfaces/disconnectable.interface';
import type { CodeSnippetId } from '@application/declarations/types/code-snippet-id.type';
import type { OnActiveSnippetChangeCallback } from '@application/declarations/types/on-active-snippet-change-callback.type';
import type { OnEditorValueChangeCallback } from '@application/declarations/types/on-editor-value-change-callback.type';
import type { OnWindowSizeChangeCallback } from '@application/declarations/types/on-window-size-change-callback.type';
import { Application } from '@framework/application';
import type { PerfComponentSelector } from '@framework/declarations/types/perf-component-selector.type';
import { CodeEditorTabsComponent } from 'src/application/components/widgets/code-editor-tabs/component';
import componentStyles from './component.scss';

export class RouteCodeComponent extends HTMLElement implements Connectable, Disconnectable {
  public static readonly selector: PerfComponentSelector = 'perf-route-code';

  readonly #editorContainer: HTMLElement = RouteCodeComponent.#getEditorContainerElement();

  readonly #editor: Editor = new Editor(this.#editorContainer);

  readonly #windowResizingService: WindowResizingService = Application.getBackgroundService(WindowResizingService);
  readonly #codeSnippetsService: CodeSnippetsService = Application.getBackgroundService(CodeSnippetsService);

  #activeSnippetId?: CodeSnippetId;

  constructor() {
    super();

    const shadowRoot: ShadowRoot = this.attachShadow({ mode: 'closed' });

    const style: HTMLStyleElement = document.createElement('style');
    style.innerHTML = componentStyles;

    const editorTabsComponent: CodeEditorTabsComponent = Application.getComponentInstance(CodeEditorTabsComponent);

    shadowRoot.appendChild(style);
    shadowRoot.appendChild(editorTabsComponent);
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

  readonly #onEditorValueChange: OnEditorValueChangeCallback = (code: string) => {
    if (this.#activeSnippetId === undefined) {
      throw new ContextualError(this, 'Active snippet is not defined');
    }

    this.#codeSnippetsService.setSnippetCode(this.#activeSnippetId, code);
  };

  readonly #onActiveCodeSnippetChange: OnActiveSnippetChangeCallback = ({ code, id }: CodeSnippet) => {
    this.#activeSnippetId = id;
    this.#editor.setValue(code);
  };

  public connectedCallback(): void {
    this.#codeSnippetsService.subscribeToActiveSnippetChange(this.#onActiveCodeSnippetChange);
    this.#editor.create();
    this.#editor.subscribeToValueChanges(this.#onEditorValueChange);
    this.#windowResizingService.subscribeToWindowSizeChanges(this.#onWindowSizeChangesListener);
  }

  public disconnectedCallback(): void {
    this.#editor.destroy();
    this.#editor.unsubscribeFromValueChanges(this.#onEditorValueChange);
    this.#windowResizingService.unsubscribeFromWindowSizeChanges(this.#onWindowSizeChangesListener);
    this.#codeSnippetsService.unsubscribeFromActiveSnippetChange(this.#onActiveCodeSnippetChange);
  }
}
