import type { WebComponentSelector } from '../../declarations/types/web-component-selector.type';
import componentStyles from './component.scss';

export class CurrentRouteComponent extends HTMLElement {
  public static readonly selector: WebComponentSelector = 'perf-current-route';

  constructor() {
    super();

    const shadowRoot: ShadowRoot = this.attachShadow({ mode: 'closed' });
    const wrapperSectionElement: HTMLElement = document.createElement('section');
    const style: HTMLStyleElement = document.createElement('style');

    style.innerHTML = componentStyles;

    shadowRoot.appendChild(style);
    shadowRoot.appendChild(wrapperSectionElement);
  }
}
