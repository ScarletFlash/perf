import { PerfComponentSelector } from '@declarations/types/perf-component-selector.type';
import componentStyles from './component.scss';

export class HeaderComponent extends HTMLElement {
  public static readonly selector: PerfComponentSelector = 'perf-header';

  constructor() {
    super();

    const shadowRoot: ShadowRoot = this.attachShadow({ mode: 'closed' });

    const wrapperElement: HTMLElement = document.createElement('header');
    wrapperElement.classList.add('header');

    const imageElement: HTMLImageElement = document.createElement('img');
    imageElement.setAttribute('src', './assets/logo.svg');
    imageElement.setAttribute('height', '100%');
    imageElement.classList.add('header__logo');

    const style: HTMLStyleElement = document.createElement('style');
    style.innerHTML = componentStyles;

    wrapperElement.appendChild(imageElement);
    shadowRoot.appendChild(style);
    shadowRoot.appendChild(wrapperElement);
  }
}
