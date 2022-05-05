import { Application } from '@application';
import { Route } from '@declarations/interfaces/route.interface';
import type { WebComponentSelector } from '@declarations/types/web-component-selector.type';
import { PipelineStateService } from '@services/pipeline-state';
import { RoutingService } from '@services/routing';
import { TileComponent } from '@widgets/tile';
import componentStyles from './component.scss';

const enum MarkerType {
  Start = 'Start',
  End = 'End'
}

export class PipelineComponent extends HTMLElement {
  public static readonly selector: WebComponentSelector = 'perf-pipeline';

  readonly #pipelineService: PipelineStateService = Application.getBackgroundService(PipelineStateService);
  readonly #routingService: RoutingService = Application.getBackgroundService(RoutingService);

  constructor() {
    super();

    const shadowRoot: ShadowRoot = this.attachShadow({ mode: 'closed' });
    const style: HTMLStyleElement = document.createElement('style');
    style.innerHTML = componentStyles;

    const wrapperSectionElement: HTMLElement = PipelineComponent.#getWrapperElement();

    const startElement: HTMLDivElement = PipelineComponent.#getMarkerElement(MarkerType.Start);
    const endElement: HTMLDivElement = PipelineComponent.#getMarkerElement(MarkerType.End);
    const lineAfterStartElement: HTMLDivElement = PipelineComponent.#getLineElement();

    wrapperSectionElement.appendChild(startElement);
    wrapperSectionElement.appendChild(lineAfterStartElement);

    this.#routingService.routes.forEach(({ urlHash, descriptionText, descriptionIconSrc }: Route) => {
      const linkElement: HTMLElement = PipelineComponent.#getLinkElement();
      linkElement.setAttribute('href', `#${urlHash}`);

      const tileComponent: HTMLElement = PipelineComponent.#getTileComponent();
      tileComponent.setAttribute('text', descriptionText);
      tileComponent.setAttribute('icon', descriptionIconSrc);

      const lineAfterTileElement: HTMLDivElement = PipelineComponent.#getLineElement();

      linkElement.appendChild(tileComponent);
      wrapperSectionElement.appendChild(linkElement);
      wrapperSectionElement.appendChild(lineAfterTileElement);
    });

    wrapperSectionElement.appendChild(endElement);

    shadowRoot.appendChild(style);
    shadowRoot.appendChild(wrapperSectionElement);
  }

  static #getMarkerElement(type: MarkerType): HTMLDivElement {
    const markerElement: HTMLDivElement = document.createElement('div');
    markerElement.classList.add('pipeline__marker', String(`pipeline__marker_${type}`).toLowerCase());
    return markerElement;
  }

  static #getWrapperElement(): HTMLElement {
    const wrapperElement: HTMLElement = document.createElement('section');
    wrapperElement.classList.add('pipeline');
    return wrapperElement;
  }

  static #getLineElement(): HTMLDivElement {
    const lineElement: HTMLDivElement = document.createElement('div');
    lineElement.classList.add('pipeline__line');
    return lineElement;
  }

  static #getLinkElement(): HTMLElement {
    const linkElement: HTMLAnchorElement = document.createElement('a');
    return linkElement;
  }

  static #getTileComponent(): HTMLElement {
    const tileComponent: HTMLElement = document.createElement(TileComponent.selector);
    return tileComponent;
  }
}
