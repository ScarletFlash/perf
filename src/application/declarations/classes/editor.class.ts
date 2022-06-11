import { editor } from 'monaco-editor';
import type { OnEditorValueChangeCallback } from './../types/on-editor-value-change-callback.type';

export class Editor {
  static #monacoEditorEnvironmentSettingsAreDefined: boolean = false;

  readonly #onValueChangeCallbacks: Set<OnEditorValueChangeCallback> = new Set<OnEditorValueChangeCallback>();

  #monacoEditor: editor.IStandaloneCodeEditor | null = null;

  readonly #monacoEditorOptions: editor.IStandaloneEditorConstructionOptions = {
    value: `
const dataSet: number[] = new Array(100_000).fill(null).map(() => Math.random());

const result: unknown[] = [];

dataSet.forEach((item: number) => result.push(item));

// for (const item of dataSet) {
//   result.push(item);
// }

// for (let index = 0; index < dataSet.length; index++) {
//   result.push(dataSet[index]);
// }
`,
    language: 'typescript',
    autoDetectHighContrast: false,
    automaticLayout: false,
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
    insertSpaces: true,
    fontFamily: 'monospace'
  };

  readonly #containerElement: HTMLElement;

  constructor(container: HTMLElement) {
    this.#containerElement = container;
    Editor.#setMonacoEnvironmentSettings();
  }

  static #setMonacoEnvironmentSettings(): void {
    if (Editor.#monacoEditorEnvironmentSettingsAreDefined) {
      return;
    }

    const getWorkerUrl: Function = (_: string, label: string) => {
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

  public create(): void {
    if (this.#monacoEditor !== null) {
      throw new Error('Editor is already running');
    }

    editor.remeasureFonts();

    const createdEditor: editor.IStandaloneCodeEditor = editor.create(
      this.#containerElement,
      this.#monacoEditorOptions
    );

    this.#monacoEditor = createdEditor;

    createdEditor.onDidChangeModelContent(() => {
      const currentContent: string = createdEditor.getValue();
      this.#onValueChangeCallbacks.forEach((callback: OnEditorValueChangeCallback) => callback(currentContent));
    });
  }

  public destroy(): void {
    this.#onValueChangeCallbacks.clear();

    if (this.#monacoEditor === null) {
      return;
    }

    this.#monacoEditor.dispose();
    this.#monacoEditor = null;
  }

  public refreshSize(): void {
    if (this.#monacoEditor === null) {
      throw new Error('Editor is not created');
    }

    this.#monacoEditor.layout();
  }

  public subscribeToValueChanges(callback: OnEditorValueChangeCallback): void {
    this.#onValueChangeCallbacks.add(callback);
  }

  public unsubscribeFromValueChanges(callback: OnEditorValueChangeCallback): void {
    this.#onValueChangeCallbacks.delete(callback);
  }
}
