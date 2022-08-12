import { RoutingService } from '@application/background-services/routing.service';
import type { Connectable } from '@application/declarations/interfaces/connectable.interface';
import type { Disconnectable } from '@application/declarations/interfaces/disconnectable.interface';
import type { Route } from '@application/declarations/interfaces/route.interface';
import type { OnRouteChangeCallback } from '@application/declarations/types/on-route-change-callback.type';
import { Application } from '@framework/application';
import type { PerfComponentSelector } from '@framework/declarations/types/perf-component-selector.type';
import { SidebarNavigationItemComponent } from '../sidebar-navigation-item/component';
import componentStyles from './component.scss';

export class SidebarNavigationComponent extends HTMLElement implements Connectable, Disconnectable {
  public static readonly selector: PerfComponentSelector = 'perf-sidebar-navigation';

  readonly #routingService: RoutingService = Application.getBackgroundService(RoutingService);

  readonly #tiles: SidebarNavigationItemComponent[];

  constructor() {
    super();

    const shadowRoot: ShadowRoot = this.attachShadow({ mode: 'closed' });
    const style: HTMLStyleElement = document.createElement('style');
    style.innerHTML = componentStyles;

    const navigationLinksWrapper: HTMLElement = SidebarNavigationComponent.#getNavigationLinksWrapperElement();
    this.#tiles = this.#routingService.routes.map(({ urlHash, descriptionText, descriptionIconSrc }: Route) => {
      const tileComponent: SidebarNavigationItemComponent = SidebarNavigationComponent.#getNavigationItemComponent();
      const observedAttributeName: typeof SidebarNavigationItemComponent.observedAttributeName =
        SidebarNavigationItemComponent.observedAttributeName;

      tileComponent.setAttribute(observedAttributeName.Text, descriptionText);
      tileComponent.setAttribute(observedAttributeName.Icon, descriptionIconSrc);
      tileComponent.setAttribute(observedAttributeName.URL, urlHash);

      return tileComponent;
    });
    this.#tiles.forEach((tileComponent: HTMLElement) => navigationLinksWrapper.appendChild(tileComponent));

    shadowRoot.appendChild(style);
    shadowRoot.appendChild(navigationLinksWrapper);
  }

  static #getNavigationLinksWrapperElement(): HTMLElement {
    const linksWrapperElement: HTMLElement = document.createElement('nav');
    linksWrapperElement.classList.add('navigation');
    return linksWrapperElement;
  }

  static #getNavigationItemComponent(): SidebarNavigationItemComponent {
    const itemComponent: SidebarNavigationItemComponent =
      Application.getComponentInstance(SidebarNavigationItemComponent);
    return itemComponent;
  }

  readonly #routeChangeListener: OnRouteChangeCallback = (currentRoute: Route): void => {
    this.#tiles.forEach((tile: SidebarNavigationItemComponent) => {
      const isTargetTile: boolean = tile.url === currentRoute.urlHash;
      tile.setActivationState(isTargetTile);
    });
  };

  public connectedCallback(): void {
    this.#routingService.subscribeToRouteChanges(this.#routeChangeListener);
  }

  public disconnectedCallback(): void {
    this.#routingService.unsubscribeFromRouteChanges(this.#routeChangeListener);
  }
}
