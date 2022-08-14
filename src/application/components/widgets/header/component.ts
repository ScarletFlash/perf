import type { PerfComponentSelector } from '@framework/declarations/types/perf-component-selector.type';
import componentStyles from './component.scss';

interface BuildImageElementOptions {
  src: string;
  className: string[];
}
export class HeaderComponent extends HTMLElement {
  public static readonly selector: PerfComponentSelector = 'perf-header';

  readonly #textLogoImage: HTMLImageElement = HeaderComponent.#getImage({
    src: './assets/logo.svg',
    className: ['header__logo']
  });
  // readonly #iconLogoImage: HTMLImageElement = HeaderComponent.#getImage({
  //   src: './assets/logo_small.svg',
  //   className: ['header__logo']
  // });

  constructor() {
    super();

    const shadowRoot: ShadowRoot = this.attachShadow({ mode: 'closed' });

    const wrapperElement: HTMLElement = document.createElement('header');
    wrapperElement.classList.add('header');

    const style: HTMLStyleElement = document.createElement('style');
    style.innerHTML = componentStyles;

    wrapperElement.appendChild(this.#textLogoImage);
    // wrapperElement.appendChild(this.#iconLogoImage);

    shadowRoot.appendChild(style);
    shadowRoot.appendChild(wrapperElement);
  }

  static #getImage({ src, className }: BuildImageElementOptions): HTMLImageElement {
    const imageElement: HTMLImageElement = document.createElement('img');
    imageElement.setAttribute('src', src);
    imageElement.setAttribute('height', '100%');
    imageElement.classList.add(...className);
    return imageElement;
  }
}
