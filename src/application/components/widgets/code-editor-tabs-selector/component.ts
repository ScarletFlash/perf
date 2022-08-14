import { TabsSelectionService } from '@application/background-services/tabs-selection.service';
import type { Connectable } from '@application/declarations/interfaces/connectable.interface';
import type { Disconnectable } from '@application/declarations/interfaces/disconnectable.interface';
import type { TabSelectionParams } from '@application/declarations/interfaces/tab-selection-params.interface';
import type { OnTabSelectionChangeCallback } from '@application/declarations/types/on-tab-selection-change-callback.type';
import { Application } from '@framework/application';
import type { PerfComponentSelector } from '@framework/declarations/types/perf-component-selector.type';
import componentStyles from './component.scss';

export class CodeEditorTabsSelectorComponent extends HTMLElement implements Connectable, Disconnectable {
  public static readonly selector: PerfComponentSelector = 'perf-code-editor-tabs-selector';

  readonly #marker: HTMLElement = CodeEditorTabsSelectorComponent.#getMarkerElement();

  readonly #tabsSelectionService: TabsSelectionService = Application.getBackgroundService(TabsSelectionService);

  constructor() {
    super();

    const shadowRoot: ShadowRoot = this.attachShadow({ mode: 'closed' });

    const style: HTMLStyleElement = document.createElement('style');
    style.innerHTML = componentStyles;

    shadowRoot.appendChild(style);
    shadowRoot.appendChild(this.#marker);
  }

  static #getMarkerElement(): HTMLElement {
    const markerElement: HTMLElement = document.createElement('div');
    markerElement.classList.add('marker');
    return markerElement;
  }

  public connectedCallback(): void {
    this.#tabsSelectionService.subscribeToSelectionChanges(this.#tabSelectionChangeCallback);
  }

  public disconnectedCallback(): void {
    this.#tabsSelectionService.unsubscribeFromSelectionChanges(this.#tabSelectionChangeCallback);
  }

  readonly #tabSelectionChangeCallback: OnTabSelectionChangeCallback = ({
    widthStyle,
    offsetXStyle
  }: TabSelectionParams): void => {
    this.#marker.style.width = widthStyle;
    this.#marker.style.transform = `translateX(${offsetXStyle})`;
  };
}
