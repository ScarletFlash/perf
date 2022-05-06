import { editor } from 'monaco-editor';

export class Editor {
  static #monacoEditorEnvironmentSettingsAreDefined: boolean = false;
  #monacoEditor: editor.IStandaloneCodeEditor | null = null;

  readonly #containerElement: HTMLElement;

  constructor(container: HTMLElement) {
    this.#containerElement = container;
    Editor.#setMonacoEnvironmentSettings();
  }

  public create(): void {
    if (this.#monacoEditor !== null) {
      throw new Error('Editor is already running');
    }

    this.#monacoEditor = editor.create(this.#containerElement, {
      value: "function hello() {\n\talert('Hello world!');\n}",
      language: 'javascript'
    });
  }

  public destroy(): void {
    this.#monacoEditor.dispose();
    this.#monacoEditor = null;
  }

  static #setMonacoEnvironmentSettings(): void {
    if (Editor.#monacoEditorEnvironmentSettingsAreDefined) {
      return;
    }

    const getWorkerUrl: Function = (_, label: string) => {
      if (label === 'typescript' || label === 'javascript') {
        return './ts.worker.bundle.js';
      }
      return './editor.worker.bundle.js';
    };
    Object.defineProperty(self, 'MonacoEnvironment', {
      value: {
        getWorkerUrl
      }
    });

    Editor.#monacoEditorEnvironmentSettingsAreDefined = true;
  }
}
