import { Application } from '@application';
import { Route } from '@declarations/interfaces/route.interface';
import type { WebComponentSelector } from '@declarations/types/web-component-selector.type';
import { PipelineStateService } from '@services/pipeline-state';
import { RoutingService } from '@services/routing';
import { PipelineTileComponent } from '@widgets/pipeline-tile';
import componentStyles from './component.scss';

const enum MarkerType {
  Start = 'Start',
  End = 'End'
}

export class PipelineComponent extends HTMLElement {
  public static readonly selector: WebComponentSelector = 'perf-pipeline';

  readonly #pipelineService: PipelineStateService = Application.getBackgroundService(PipelineStateService);
  readonly #routingService: RoutingService = Application.getBackgroundService(RoutingService);

  readonly #routes: Route[] = this.#routingService.routes;

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
    this.#routes.forEach(({ urlHash, descriptionText, descriptionIconSrc }: Route) => {
      const linkElement: HTMLElement = PipelineComponent.#getLinkElement();
      linkElement.setAttribute('href', `#${urlHash}`);

      const tileComponent: HTMLElement = PipelineComponent.#getTileComponent();
      tileComponent.setAttribute('text', descriptionText);
      tileComponent.setAttribute('icon', descriptionIconSrc);

      linkElement.appendChild(tileComponent);
      contentElement.appendChild(linkElement);
    });

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

  static #getLinkElement(): HTMLElement {
    const linkElement: HTMLAnchorElement = document.createElement('a');
    linkElement.classList.add('content__item');
    return linkElement;
  }

  static #getTileComponent(): HTMLElement {
    const tileComponent: HTMLElement = document.createElement(PipelineTileComponent.selector);
    return tileComponent;
  }
}
