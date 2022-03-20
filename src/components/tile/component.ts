import type { WebComponentSelector } from '../../declarations/types/web-component-selector.type';
import componentStyles from './component.scss';

export class TileComponent extends HTMLElement {
  public static readonly selector: WebComponentSelector = 'perf-tile';

  constructor() {
    super();

    const shadowRoot: ShadowRoot = this.attachShadow({ mode: 'open' });

    const wrapperSectionElement: HTMLElement = document.createElement('section');
    wrapperSectionElement.classList.add('tile');

    const iconElement: HTMLElement = document.createElement('ion-icon');
    wrapperSectionElement.appendChild(iconElement);

    const spanElement: HTMLSpanElement = document.createElement('span');
    wrapperSectionElement.appendChild(spanElement);

    const style: HTMLStyleElement = document.createElement('style');
    style.innerHTML = componentStyles;

    shadowRoot.appendChild(style);
    shadowRoot.appendChild(wrapperSectionElement);
  }
}
