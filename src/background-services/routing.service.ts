import { Route } from '@declarations/interfaces/route.interface';

export class RoutingService {
  static readonly #routes: Route[] = [
    {
      componentSelector: 'perf-route-code',
      title: '🧑‍💻',
      urlHash: 'code',
      descriptionIconSrc: '/assets/images/code-tile-icon.svg',
      descriptionText: 'Code'
    },
    {
      componentSelector: 'perf-route-configuration',
      title: '🛠️',
      urlHash: 'configuration',
      descriptionIconSrc: '/assets/images/transformation-tile-icon.svg',
      descriptionText: 'Configuration'
    },
    {
      componentSelector: 'perf-route-analysis',
      title: '🧪',
      urlHash: 'analysis',
      descriptionIconSrc: '/assets/images/analysis-tile-icon.svg',
      descriptionText: 'Analysis'
    }
  ];

  public get routes(): Route[] {
    return RoutingService.#routes;
  }

  public getRouteByUrlHash(hash: string): Route | undefined {
    console.log({ hash });
    return RoutingService.#routes.find(({ urlHash }: Route) => urlHash.toLowerCase() === hash.toLowerCase());
  }
}
