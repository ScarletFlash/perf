import { editor } from 'monaco-editor';

export class Editor {
  static #monacoEditorEnvironmentSettingsAreDefined: boolean = false;
  #monacoEditor: editor.IStandaloneCodeEditor | null = null;

  readonly #monacoEditorOptions: editor.IStandaloneEditorConstructionOptions = {
    value: `
/** @perf_Common Iterate via Array.prototype.forEach */
const dataSet: number[] = new Array(100_000).fill(null).map(() => Math.random());

let result: unknown[];

/** @perf_BeforeEach Iterate via Array.prototype.forEach */
result = [];

/** @perf_Test Iterate via Array.prototype.forEach */
dataSet.forEach((item: number) => result.push(item));

/** @perf_Test Iterate via for...of */
for (const item of dataSet) {
  result.push(item);
}

/** @perf_Test Iterate via for */
for (let index = 0; index < dataSet.length; index++) {
  result.push(dataSet[index]);
}
    `,
    language: 'typescript',
    autoDetectHighContrast: false,
    theme: 'vs-dark',
    minimap: {
      enabled: false
    },
    scrollbar: {
      horizontal: 'hidden'
    },
    contextmenu: false,
    largeFileOptimizations: false,
    padding: {
      top: 0,
      bottom: 0
    },
    emptySelectionClipboard: true,
    columnSelection: true,
    cursorSmoothCaretAnimation: true,
    cursorBlinking: 'smooth',
    renderLineHighlightOnlyWhenFocus: true,
    disableMonospaceOptimizations: true,
    tabSize: 2,
    insertSpaces: true
  };

  readonly #containerElement: HTMLElement;

  constructor(container: HTMLElement) {
    this.#containerElement = container;
    Editor.#setMonacoEnvironmentSettings();
  }

  public create(): void {
    if (this.#monacoEditor !== null) {
      throw new Error('Editor is already running');
    }

    this.#monacoEditor = editor.create(this.#containerElement, this.#monacoEditorOptions);
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
