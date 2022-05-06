import { PerfComponentSelector } from '@declarations/types/perf-component-selector.type';
import componentStyles from './component.scss';

export class FooterComponent extends HTMLElement {
  public static readonly selector: PerfComponentSelector = 'perf-footer';

  constructor() {
    super();

    const shadowRoot: ShadowRoot = this.attachShadow({ mode: 'closed' });

    const wrapperElement: HTMLElement = document.createElement('footer');
    wrapperElement.classList.add('footer');

    const imageElement: HTMLImageElement = document.createElement('img');
    imageElement.setAttribute('src', './assets/logo_small.svg');
    imageElement.setAttribute('height', '100%');
    imageElement.classList.add('footer__logo');

    const style: HTMLStyleElement = document.createElement('style');
    style.innerHTML = componentStyles;

    wrapperElement.appendChild(imageElement);
    shadowRoot.appendChild(style);
    shadowRoot.appendChild(wrapperElement);
  }
}
