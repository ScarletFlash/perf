import type { WebComponentSelector } from '@declarations/types/web-component-selector.type';
import componentStyles from './component.scss';

export class PipelineComponent extends HTMLElement {
  public static readonly selector: WebComponentSelector = 'perf-pipeline';

  constructor() {
    super();

    const shadowRoot: ShadowRoot = this.attachShadow({ mode: 'closed' });
    const wrapperSectionElement: HTMLElement = document.createElement('section');
    const lineElement: HTMLDivElement = document.createElement('div');
    const contentElement: HTMLSlotElement = document.createElement('slot');
    const style: HTMLStyleElement = document.createElement('style');

    wrapperSectionElement.classList.add('pipeline');
    wrapperSectionElement.appendChild(lineElement);
    wrapperSectionElement.appendChild(contentElement);
    lineElement.classList.add('pipeline__line');
    style.innerHTML = componentStyles;

    shadowRoot.appendChild(style);
    shadowRoot.appendChild(wrapperSectionElement);
  }
}
