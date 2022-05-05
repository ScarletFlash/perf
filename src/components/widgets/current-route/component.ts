import { Application } from '@application';
import { Connectable } from '@declarations/interfaces/connectable.interface';
import { Disconnectable } from '@declarations/interfaces/disconnectable.interface';
import { Route } from '@declarations/interfaces/route.interface';
import { OnHashChangeCallback } from '@declarations/types/on-hash-change-callback.type';
import type { WebComponentSelector } from '@declarations/types/web-component-selector.type';
import { RoutingService } from '@services/routing';
import { TitleService } from '@services/title';
import { UrlService } from '@services/url';
import componentStyles from './component.scss';

export class CurrentRouteComponent extends HTMLElement implements Connectable, Disconnectable {
  readonly #urlService: UrlService = Application.getBackgroundService(UrlService);
  readonly #routingService: RoutingService = Application.getBackgroundService(RoutingService);
  readonly #titleService: TitleService = Application.getBackgroundService(TitleService);

  readonly #wrapperSectionElement: HTMLElement;

  readonly #hashChangeListener: OnHashChangeCallback = (currentHash: string): void => {
    const targetRoute: Route | undefined =
      this.#routingService.getRouteByUrlHash(currentHash) ?? this.#routingService.routes.at(0);

    if (targetRoute === undefined) {
      this.#titleService.clearTitle();
      throw new Error('[CurrentRouteComponent] page not found');
    }

    this.#titleService.setTitle(targetRoute.title);
    this.#urlService.setHash(targetRoute.urlHash);
    this.#renderContentBySelector(targetRoute.componentSelector);
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
    this.#urlService.subscribeToHashChanges(this.#hashChangeListener);
  }

  public disconnectedCallback(): void {
    this.#urlService.unsubscribeFromHashChanges(this.#hashChangeListener);
  }

  #renderContentBySelector(targetComponentSelector: string): void {
    const targetComponent: HTMLElement = document.createElement(targetComponentSelector);
    if (this.#wrapperSectionElement.childElementCount > 0) {
      Array.from(this.#wrapperSectionElement.children).forEach((childElement: Element) => childElement.remove());
    }
    this.#wrapperSectionElement.appendChild(targetComponent);
  }
}
