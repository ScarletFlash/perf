import { Application } from '@framework/application';
import type { PerfComponentSelector } from '@framework/declarations/types/perf-component-selector.type';
import { ExecutionControlComponent } from '../execution-control/component';
import { HeaderComponent } from '../header/component';
import { SidebarNavigationComponent } from '../sidebar-navigation/component';
import componentStyles from './component.scss';

export class SidebarComponent extends HTMLElement {
  public static readonly selector: PerfComponentSelector = 'perf-sidebar';

  constructor() {
    super();

    const shadowRoot: ShadowRoot = this.attachShadow({ mode: 'closed' });

    const sidebarElement: HTMLElement = SidebarComponent.#getSidebarElement();

    const headerElement: HeaderComponent = SidebarComponent.#getHeaderComponent();
    sidebarElement.appendChild(headerElement);

    const contentElement: HTMLElement = SidebarComponent.#getContentElement();
    sidebarElement.appendChild(contentElement);

    const navigationElement: HTMLElement = SidebarComponent.#getNavigationComponent();
    contentElement.appendChild(navigationElement);

    const executionControlElement: HTMLElement = SidebarComponent.#getExecutionControlComponent();
    contentElement.appendChild(executionControlElement);

    const style: HTMLStyleElement = document.createElement('style');
    style.innerHTML = componentStyles;

    shadowRoot.appendChild(style);
    shadowRoot.appendChild(sidebarElement);
  }

  static #getHeaderComponent(): HeaderComponent {
    const headerElement: HeaderComponent = Application.getComponentInstance(HeaderComponent);
    headerElement.classList.add('sidebar__header');
    return headerElement;
  }

  static #getNavigationComponent(): SidebarNavigationComponent {
    const navigationElement: SidebarNavigationComponent = Application.getComponentInstance(SidebarNavigationComponent);
    navigationElement.classList.add('menu__navigation');
    return navigationElement;
  }

  static #getExecutionControlComponent(): ExecutionControlComponent {
    const executionControlElement: ExecutionControlComponent =
      Application.getComponentInstance(ExecutionControlComponent);
    executionControlElement.classList.add('menu__execution-control');
    return executionControlElement;
  }

  static #getSidebarElement(): HTMLElement {
    const sidebarElement: HTMLElement = document.createElement('aside');
    sidebarElement.classList.add('sidebar');
    return sidebarElement;
  }

  static #getContentElement(): HTMLElement {
    const contentElement: HTMLElement = document.createElement('section');
    contentElement.classList.add('sidebar__content', 'menu');
    return contentElement;
  }
}
