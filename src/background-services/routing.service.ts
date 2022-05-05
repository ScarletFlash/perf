import { Route } from '@declarations/interfaces/route.interface';

export class RoutingService {
  static readonly #routes: Route[] = [
    {
      componentSelector: 'perf-route-code',
      title: '🧑‍💻',
      urlHash: 'code'
    },
    {
      componentSelector: 'perf-route-configuration',
      title: '🛠️',
      urlHash: 'configuration'
    },
    {
      componentSelector: 'perf-route-analysis',
      title: '🧪',
      urlHash: 'analysis'
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
