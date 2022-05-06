import { Application } from '@application';
import { Connectable } from '@declarations/interfaces/connectable.interface';
import { Disconnectable } from '@declarations/interfaces/disconnectable.interface';
import { Route } from '@declarations/interfaces/route.interface';
import { OnRouteChangeCallback } from '@declarations/types/on-route-change-callback.type';
import type { WebComponentSelector } from '@declarations/types/web-component-selector.type';
import { RoutingService } from '@services/routing';
import componentStyles from './component.scss';

export class CurrentRouteComponent extends HTMLElement implements Connectable, Disconnectable {
  readonly #routingService: RoutingService = Application.getBackgroundService(RoutingService);

  readonly #wrapperSectionElement: HTMLElement;

  readonly #routeChangeListener: OnRouteChangeCallback = (currentRoute: Route): void => {
    this.#renderContentBySelector(currentRoute.componentSelector);
  };

  public static readonly selector: WebComponentSelector = 'perf-current-route';

  constructor() {
    super();

    const shadowRoot: ShadowRoot = this.attachShadow({ mode: 'closed' });
    this.#wrapperSectionElement = document.createElement('section');

    const style: HTMLStyleElement = document.createElement('style');

    style.innerHTML = componentStyles;

    shadowRoot.appendChild(style);
    shadowRoot.appendChild(this.#wrapperSectionElement);
  }

  public connectedCallback(): void {
    this.#routingService.subscribeToRouteChanges(this.#routeChangeListener);
  }

  public disconnectedCallback(): void {
    this.#routingService.unsubscribeFromRouteChanges(this.#routeChangeListener);
  }

  #renderContentBySelector(targetComponentSelector: string): void {
    const targetComponent: HTMLElement = document.createElement(targetComponentSelector);
    if (this.#wrapperSectionElement.childElementCount > 0) {
      Array.from(this.#wrapperSectionElement.children).forEach((childElement: Element) => childElement.remove());
    }
    this.#wrapperSectionElement.appendChild(targetComponent);
  }
}
