import { Application } from '@framework/application';
import type { PerfComponentSelector } from '@framework/declarations/types/perf-component-selector.type';
import { HeaderComponent } from '../header/component';
import { SidebarNavigationComponent } from '../sidebar-navigation/component';
import componentStyles from './component.scss';

export class SidebarComponent extends HTMLElement {
  public static readonly selector: PerfComponentSelector = 'perf-sidebar';

  constructor() {
    super();

    const shadowRoot: ShadowRoot = this.attachShadow({ mode: 'closed' });

    const wrapperElement: HTMLElement = document.createElement('aside');

    const headerElement: HTMLElement = Application.getComponentInstance(HeaderComponent);
    headerElement.classList.add('.header');
    wrapperElement.appendChild(headerElement);

    const navigationElement: HTMLElement = Application.getComponentInstance(SidebarNavigationComponent);
    wrapperElement.appendChild(navigationElement);

    const style: HTMLStyleElement = document.createElement('style');
    style.innerHTML = componentStyles;

    shadowRoot.appendChild(style);
    shadowRoot.appendChild(wrapperElement);
  }
}
