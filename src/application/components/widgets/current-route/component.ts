import { RoutingService } from '@application/background-services/routing.service';
import type { Connectable } from '@application/declarations/interfaces/connectable.interface';
import type { Disconnectable } from '@application/declarations/interfaces/disconnectable.interface';
import type { Route } from '@application/declarations/interfaces/route.interface';
import type { OnRouteChangeCallback } from '@application/declarations/types/on-route-change-callback.type';
import { Application } from '@framework/application';
import type { PerfComponentSelector } from '@framework/declarations/types/perf-component-selector.type';
import componentStyles from './component.scss';

export class CurrentRouteComponent extends HTMLElement implements Connectable, Disconnectable {
  public static readonly selector: PerfComponentSelector = 'perf-current-route';

  readonly #routingService: RoutingService = Application.getBackgroundService(RoutingService);
  readonly #routeContainerElement: HTMLElement = CurrentRouteComponent.#getRouteContainerElement();

  constructor() {
    super();

    const shadowRoot: ShadowRoot = this.attachShadow({ mode: 'closed' });

    const style: HTMLStyleElement = document.createElement('style');
    style.innerHTML = componentStyles;

    shadowRoot.appendChild(style);
    shadowRoot.appendChild(this.#routeContainerElement);
  }

  static #getRouteContainerElement(): HTMLElement {
    const routeContainerElement: HTMLElement = document.createElement('main');
    routeContainerElement.classList.add('route-container');
    return routeContainerElement;
  }

  readonly #routeChangeListener: OnRouteChangeCallback = (currentRoute: Route): void => {
    this.#renderContentBySelector(currentRoute.componentSelector);
  };

  public connectedCallback(): void {
    this.#routingService.subscribeToRouteChanges(this.#routeChangeListener);
  }

  public disconnectedCallback(): void {
    this.#routingService.unsubscribeFromRouteChanges(this.#routeChangeListener);
  }

  #renderContentBySelector(targetComponentSelector: string): void {
    const targetComponent: HTMLElement = document.createElement(targetComponentSelector);
    if (this.#routeContainerElement.childElementCount > 0) {
      Array.from(this.#routeContainerElement.children).forEach((childElement: Element) => childElement.remove());
    }
    this.#routeContainerElement.appendChild(targetComponent);
  }
}
