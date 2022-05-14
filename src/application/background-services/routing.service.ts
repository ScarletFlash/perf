import type { Route } from '@declarations/interfaces/route.interface';
import type { OnHashChangeCallback } from '@declarations/types/on-hash-change-callback.type';
import type { OnRouteChangeCallback } from '@declarations/types/on-route-change-callback.type';
import type { UrlHash } from '@declarations/types/url-hash.type';
import { Application } from '@framework/application';
import { TitleService } from './title.service';
import { UrlService } from './url.service';

export class RoutingService {
  static readonly #routes: Route[] = [
    {
      componentSelector: 'perf-route-code',
      title: '🧑‍💻',
      urlHash: '#code',
      descriptionIconSrc: '/assets/images/code-tile-icon.svg',
      descriptionText: 'Code'
    },
    {
      componentSelector: 'perf-route-configuration',
      title: '🛠️',
      urlHash: '#configuration',
      descriptionIconSrc: '/assets/images/transformation-tile-icon.svg',
      descriptionText: 'Configuration'
    },
    {
      componentSelector: 'perf-route-analysis',
      title: '🧪',
      urlHash: '#analysis',
      descriptionIconSrc: '/assets/images/analysis-tile-icon.svg',
      descriptionText: 'Analysis'
    }
  ];

  readonly #urlService: UrlService = Application.getBackgroundService(UrlService);
  readonly #titleService: TitleService = Application.getBackgroundService(TitleService);

  readonly #onRouteChangeCallbacks: Set<OnRouteChangeCallback> = new Set<OnRouteChangeCallback>();
  #currentRoute: Route | undefined;

  constructor() {
    const onHashChange: OnHashChangeCallback = (currentHash: UrlHash) => {
      const foundRoute: Route | undefined = this.getRouteByUrlHash(currentHash);
      const targetRoute: Route | undefined = foundRoute === undefined ? RoutingService.#routes.at(0) : foundRoute;
      if (this.#currentRoute === targetRoute) {
        return;
      }

      this.#currentRoute = targetRoute;
      this.#titleService.setTitle(targetRoute.title);
      this.#urlService.setHash(targetRoute.urlHash);
      this.#onRouteChangeCallbacks.forEach((callback: OnRouteChangeCallback) => callback(this.#currentRoute));
    };

    this.#urlService.subscribeToHashChanges(onHashChange);
  }

  public get routes(): Route[] {
    return RoutingService.#routes;
  }

  public getRouteByUrlHash(hash: UrlHash): Route | undefined {
    return RoutingService.#routes.find(({ urlHash }: Route) => urlHash.toLowerCase() === hash.toLowerCase());
  }

  public subscribeToRouteChanges(callback: OnRouteChangeCallback): void {
    this.#onRouteChangeCallbacks.add(callback);
  }

  public unsubscribeFromRouteChanges(callback: OnRouteChangeCallback): void {
    this.#onRouteChangeCallbacks.delete(callback);
  }
}
