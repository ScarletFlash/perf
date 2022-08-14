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

    const wrapperElement: HTMLElement = SidebarComponent.#getSidebarElement();

    const headerElement: HeaderComponent = SidebarComponent.#getHeaderComponent();
    wrapperElement.appendChild(headerElement);

    const navigationElement: HTMLElement = SidebarComponent.#getNavigationComponent();
    wrapperElement.appendChild(navigationElement);

    const executionControlElement: HTMLElement = SidebarComponent.#getExecutionControlComponent();
    wrapperElement.appendChild(executionControlElement);

    const style: HTMLStyleElement = document.createElement('style');
    style.innerHTML = componentStyles;

    shadowRoot.appendChild(style);
    shadowRoot.appendChild(wrapperElement);
  }

  static #getHeaderComponent(): HeaderComponent {
    const headerElement: HeaderComponent = Application.getComponentInstance(HeaderComponent);
    headerElement.classList.add('sidebar__header');
    return headerElement;
  }

  static #getNavigationComponent(): SidebarNavigationComponent {
    const navigationElement: SidebarNavigationComponent = Application.getComponentInstance(SidebarNavigationComponent);
    navigationElement.classList.add('sidebar__navigation');
    return navigationElement;
  }

  static #getExecutionControlComponent(): ExecutionControlComponent {
    const executionControlElement: ExecutionControlComponent =
      Application.getComponentInstance(ExecutionControlComponent);
    executionControlElement.classList.add('sidebar__execution-control');
    return executionControlElement;
  }

  static #getSidebarElement(): HTMLElement {
    const sidebarElement: HTMLElement = document.createElement('aside');
    sidebarElement.classList.add('sidebar');
    return sidebarElement;
  }
}
