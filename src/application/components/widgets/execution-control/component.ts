import { $color_active } from '@application/styles/variables';
import { Application } from '@framework/application';
import type { PerfComponentSelector } from '@framework/declarations/types/perf-component-selector.type';
import { ExecutionControlInfoItemComponent } from '../execution-control-info-item/component';
import { IconComponent } from '../icon/component';
import componentStyles from './component.scss';

const enum PlayButtonTitleElementValue {
  Run = 'Run',
  Stop = 'Stop'
}

interface InfoItemCreationParams {
  title: string;
  initialValue: number;
}

export class ExecutionControlComponent extends HTMLElement {
  public static readonly selector: PerfComponentSelector = 'perf-execution-control';

  readonly #playButtonTitleElement: HTMLSpanElement = ExecutionControlComponent.#getPlayButtonTitleElement();
  readonly #playButtonIconComponent: IconComponent = ExecutionControlComponent.#getPlayButtonIconComponent();

  readonly #testCasesCountInfoItemComponent: ExecutionControlInfoItemComponent =
    ExecutionControlComponent.#getAdditionalInfoItemElement({
      title: 'TestCases',
      initialValue: 0
    });

  readonly #executionErrorsCountInfoItemComponent: ExecutionControlInfoItemComponent =
    ExecutionControlComponent.#getAdditionalInfoItemElement({
      title: 'Errors',
      initialValue: 0
    });

  readonly #executionErrorsCountInfoItemComponent1: ExecutionControlInfoItemComponent =
    ExecutionControlComponent.#getAdditionalInfoItemElement({
      title: 'Errors',
      initialValue: 0
    });

  readonly #executionErrorsCountInfoItemComponent2: ExecutionControlInfoItemComponent =
    ExecutionControlComponent.#getAdditionalInfoItemElement({
      title: 'Errors',
      initialValue: 0
    });

  readonly #executionErrorsCountInfoItemComponent3: ExecutionControlInfoItemComponent =
    ExecutionControlComponent.#getAdditionalInfoItemElement({
      title: 'Errors',
      initialValue: 0
    });

  constructor() {
    super();

    const shadowRoot: ShadowRoot = this.attachShadow({ mode: 'closed' });

    const playButton: HTMLElement = ExecutionControlComponent.#getPlayButton();
    playButton.appendChild(this.#playButtonIconComponent);
    playButton.appendChild(this.#playButtonTitleElement);

    const additionalInfoElement: HTMLElement = ExecutionControlComponent.#getAdditionalInfoElement();
    additionalInfoElement.appendChild(this.#testCasesCountInfoItemComponent);
    additionalInfoElement.appendChild(this.#executionErrorsCountInfoItemComponent);
    additionalInfoElement.appendChild(this.#executionErrorsCountInfoItemComponent1);
    additionalInfoElement.appendChild(this.#executionErrorsCountInfoItemComponent2);
    additionalInfoElement.appendChild(this.#executionErrorsCountInfoItemComponent3);

    const wrapperElement: HTMLElement = document.createElement('section');
    wrapperElement.classList.add('execution-control');
    wrapperElement.appendChild(additionalInfoElement);
    wrapperElement.appendChild(playButton);

    const style: HTMLStyleElement = document.createElement('style');
    style.innerHTML = componentStyles;

    shadowRoot.appendChild(style);
    shadowRoot.appendChild(wrapperElement);
  }

  static #getAdditionalInfoElement(): HTMLElement {
    const infoElement: HTMLElement = document.createElement('section');
    infoElement.classList.add('execution-control__info', 'additional-info');
    return infoElement;
  }

  static #getAdditionalInfoItemElement({
    title,
    initialValue
  }: InfoItemCreationParams): ExecutionControlInfoItemComponent {
    const infoItem: ExecutionControlInfoItemComponent = Application.getComponentInstance(
      ExecutionControlInfoItemComponent
    );
    infoItem.classList.add('additional-info__item');

    const observedAttributeName: typeof ExecutionControlInfoItemComponent.observedAttributeName =
      ExecutionControlInfoItemComponent.observedAttributeName;
    infoItem.setAttribute(observedAttributeName.Title, title);
    infoItem.setAttribute(observedAttributeName.Value, String(initialValue));

    return infoItem;
  }

  static #getPlayButton(): HTMLElement {
    const buttonElement: HTMLButtonElement = document.createElement('button');
    buttonElement.classList.add('execution-control__button', 'play-button');
    return buttonElement;
  }

  static #getPlayButtonIconComponent(): IconComponent {
    const iconElement: IconComponent = Application.getComponentInstance(IconComponent);
    iconElement.classList.add('play-button__icon');
    const observedAttributeName: typeof IconComponent.observedAttributeName = IconComponent.observedAttributeName;
    iconElement.setAttribute(observedAttributeName.Source, '/assets/images/play-icon.svg');
    iconElement.setAttribute(observedAttributeName.Color, $color_active);
    return iconElement;
  }

  static #getPlayButtonTitleElement(): HTMLSpanElement {
    const titleElement: HTMLSpanElement = document.createElement('span');
    titleElement.innerText = PlayButtonTitleElementValue.Run;
    titleElement.classList.add('play-button__title');
    return titleElement;
  }
}
