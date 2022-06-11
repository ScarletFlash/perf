import type { PerfComponentSelector } from '@framework/declarations/types/perf-component-selector.type';
import componentStyles from './component.scss';

export class CodeEditorToolbarComponent extends HTMLElement {
  public static readonly selector: PerfComponentSelector = 'perf-code-editor-toolbar';

  constructor() {
    super();

    const shadowRoot: ShadowRoot = this.attachShadow({ mode: 'closed' });

    const wrapperElement: HTMLElement = document.createElement('section');
    wrapperElement.classList.add('code-editor-toolbar');

    const style: HTMLStyleElement = document.createElement('style');
    style.innerHTML = componentStyles;

    shadowRoot.appendChild(style);
    shadowRoot.appendChild(wrapperElement);
  }
}
