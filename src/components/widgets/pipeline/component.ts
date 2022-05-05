import { Application } from '@application';
import type { WebComponentSelector } from '@declarations/types/web-component-selector.type';
import { PipelineStateService } from '@services/pipeline-state';
import componentStyles from './component.scss';

const enum MarkerType {
  Start = 'Start',
  End = 'End'
}

export class PipelineComponent extends HTMLElement {
  readonly #contentElement: HTMLSlotElement = document.createElement('slot');

  public static readonly selector: WebComponentSelector = 'perf-pipeline';

  readonly #pipelineService: PipelineStateService = Application.getBackgroundService(PipelineStateService);

  constructor() {
    super();

    const shadowRoot: ShadowRoot = this.attachShadow({ mode: 'closed' });
    const style: HTMLStyleElement = document.createElement('style');
    style.innerHTML = componentStyles;

    const wrapperSectionElement: HTMLElement = PipelineComponent.#getWrapperElement();

    const startElement: HTMLDivElement = PipelineComponent.#getMarkerElement(MarkerType.Start);
    const endElement: HTMLDivElement = PipelineComponent.#getMarkerElement(MarkerType.End);
    const lineComponent: HTMLDivElement = PipelineComponent.#getLineElement();

    wrapperSectionElement.appendChild(startElement);
    wrapperSectionElement.appendChild(lineComponent);
    wrapperSectionElement.appendChild(this.#contentElement);
    wrapperSectionElement.appendChild(lineComponent.cloneNode());
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
}
