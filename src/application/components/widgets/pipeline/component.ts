import { RoutingService } from '@application/background-services/routing.service';
import { ContextualError } from '@application/declarations/classes/contextual-error.class';
import type { Connectable } from '@application/declarations/interfaces/connectable.interface';
import type { Disconnectable } from '@application/declarations/interfaces/disconnectable.interface';
import type { Route } from '@application/declarations/interfaces/route.interface';
import type { OnRouteChangeCallback } from '@application/declarations/types/on-route-change-callback.type';
import { Application } from '@framework/application';
import type { PerfComponentSelector } from '@framework/declarations/types/perf-component-selector.type';
import { PipelineTileComponent } from '../pipeline-tile/component';
import componentStyles from './component.scss';

const enum MarkerType {
  Start = 'Start',
  End = 'End'
}

export class PipelineComponent extends HTMLElement implements Connectable, Disconnectable {
  public static readonly selector: PerfComponentSelector = 'perf-pipeline';

  readonly #routingService: RoutingService = Application.getBackgroundService(RoutingService);

  readonly #tiles: PipelineTileComponent[];

  constructor() {
    super();

    const shadowRoot: ShadowRoot = this.attachShadow({ mode: 'closed' });
    const style: HTMLStyleElement = document.createElement('style');
    style.innerHTML = componentStyles;

    const backgroundElement: HTMLElement = PipelineComponent.#getBackgroundElement();
    const startElement: HTMLDivElement = PipelineComponent.#getMarkerElement(MarkerType.Start);
    backgroundElement.appendChild(startElement);
    const lineElement: HTMLDivElement = PipelineComponent.#getLineElement();
    backgroundElement.appendChild(lineElement);
    const endElement: HTMLDivElement = PipelineComponent.#getMarkerElement(MarkerType.End);
    backgroundElement.appendChild(endElement);

    const contentElement: HTMLElement = PipelineComponent.#getContentElement();
    this.#tiles = this.#routingService.routes.map(({ urlHash, descriptionText, descriptionIconSrc }: Route) => {
      const tileComponent: PipelineTileComponent = PipelineComponent.#getTileComponent();
      const observedAttributeName: typeof PipelineTileComponent.observedAttributeName =
        PipelineTileComponent.observedAttributeName;

      tileComponent.setAttribute(observedAttributeName.Text, descriptionText);
      tileComponent.setAttribute(observedAttributeName.Icon, descriptionIconSrc);
      tileComponent.setAttribute(observedAttributeName.URL, urlHash);

      return tileComponent;
    });

    this.#tiles.forEach((tileComponent: HTMLElement) => contentElement.appendChild(tileComponent));

    const pipelineElement: HTMLElement = PipelineComponent.#getPipelineElement();
    pipelineElement.appendChild(backgroundElement);
    pipelineElement.appendChild(contentElement);

    shadowRoot.appendChild(style);
    shadowRoot.appendChild(pipelineElement);
  }

  static #getPipelineElement(): HTMLElement {
    const contentElement: HTMLElement = document.createElement('section');
    contentElement.classList.add('pipeline');
    return contentElement;
  }

  static #getContentElement(): HTMLElement {
    const contentElement: HTMLElement = document.createElement('section');
    contentElement.classList.add('pipeline__content', 'content');
    return contentElement;
  }

  static #getBackgroundElement(): HTMLElement {
    const backgroundElement: HTMLElement = document.createElement('section');
    backgroundElement.classList.add('pipeline__background', 'background');
    return backgroundElement;
  }

  static #getMarkerElement(type: MarkerType): HTMLDivElement {
    const markerElement: HTMLDivElement = document.createElement('div');
    markerElement.classList.add('background__marker', String(`background__marker_${type}`).toLowerCase());
    return markerElement;
  }

  static #getLineElement(): HTMLDivElement {
    const lineElement: HTMLDivElement = document.createElement('div');
    lineElement.classList.add('background__line');
    return lineElement;
  }

  static #getTileComponent(): PipelineTileComponent {
    const tileComponent: HTMLElement = document.createElement(PipelineTileComponent.selector);
    tileComponent.classList.add('content__item');
    if (tileComponent instanceof PipelineTileComponent) {
      return tileComponent;
    }
    throw new ContextualError(PipelineComponent, 'PipelineTileComponent creation is failed');
  }

  readonly #routeChangeListener: OnRouteChangeCallback = (currentRoute: Route): void => {
    this.#tiles.forEach((tile: PipelineTileComponent) => {
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
