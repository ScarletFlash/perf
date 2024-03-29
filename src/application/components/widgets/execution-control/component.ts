import { CodeSnippetsService } from '@application/background-services/code-snippets.service';
import { ExecutionService } from '@application/background-services/execution.service';
import type { CodeSnippet } from '@application/declarations/classes/code-snippet.class';
import { ContextualError } from '@application/declarations/classes/contextual-error.class';
import { CodeSnippetType } from '@application/declarations/enums/code-snippet-type.enum';
import { ExecutionState } from '@application/declarations/enums/execution-state.enum';
import type { Connectable } from '@application/declarations/interfaces/connectable.interface';
import type { Disconnectable } from '@application/declarations/interfaces/disconnectable.interface';
import type { SnippetListChangeInfo } from '@application/declarations/interfaces/snippet-list-change-info.interface';
import type { OnExecutionStateChange } from '@application/declarations/types/on-execution-state-change.type';
import type { OnSnippetListChangeCallback } from '@application/declarations/types/on-snippet-list-change-callback.type';
import { $color_active, $color_background } from '@application/styles/variables';
import { Application } from '@framework/application';
import type { PerfComponentSelector } from '@framework/declarations/types/perf-component-selector.type';
import { ExecutionControlInfoItemComponent } from '../execution-control-info-item/component';
import { IconComponent } from '../icon/component';
import componentStyles from './component.scss';

const enum PlayButtonTitleElementValue {
  Run = 'Run',
  Stop = 'Stop'
}

const enum PlayButtonIconElementSrc {
  Run = '/assets/images/play-icon.svg',
  Stop = '/assets/images/stop-icon.svg'
}

interface InfoItemCreationParams {
  title: string;
  initialValue: number;
}

export class ExecutionControlComponent extends HTMLElement implements Connectable, Disconnectable {
  public static readonly selector: PerfComponentSelector = 'perf-execution-control';

  readonly #playButton: HTMLElement = ExecutionControlComponent.#getPlayButton();
  readonly #playButtonTitleElement: HTMLSpanElement = ExecutionControlComponent.#getPlayButtonTitleElement();
  readonly #playButtonIconComponent: IconComponent = ExecutionControlComponent.#getPlayButtonIconComponent();

  readonly #executionService: ExecutionService = Application.getBackgroundService(ExecutionService);
  readonly #codeSnippetsService: CodeSnippetsService = Application.getBackgroundService(CodeSnippetsService);

  readonly #testCasesCountInfoItemComponent: ExecutionControlInfoItemComponent =
    ExecutionControlComponent.#getAdditionalInfoItemElement({
      title: 'TestCases',
      initialValue: 0
    });

  // readonly #executionErrorsCountInfoItemComponent: ExecutionControlInfoItemComponent =
  //   ExecutionControlComponent.#getAdditionalInfoItemElement({
  //     title: 'Errors',
  //     initialValue: 0
  //   });

  // readonly #executionErrorsCountInfoItemComponent1: ExecutionControlInfoItemComponent =
  //   ExecutionControlComponent.#getAdditionalInfoItemElement({
  //     title: 'Errors',
  //     initialValue: 0
  //   });

  // readonly #executionErrorsCountInfoItemComponent2: ExecutionControlInfoItemComponent =
  //   ExecutionControlComponent.#getAdditionalInfoItemElement({
  //     title: 'Errors',
  //     initialValue: 0
  //   });

  // readonly #executionErrorsCountInfoItemComponent3: ExecutionControlInfoItemComponent =
  //   ExecutionControlComponent.#getAdditionalInfoItemElement({
  //     title: 'Errors',
  //     initialValue: 0
  //   });

  constructor() {
    super();

    const shadowRoot: ShadowRoot = this.attachShadow({ mode: 'closed' });

    this.#playButton.appendChild(this.#playButtonIconComponent);
    this.#playButton.appendChild(this.#playButtonTitleElement);

    const additionalInfoElement: HTMLElement = ExecutionControlComponent.#getAdditionalInfoElement();
    additionalInfoElement.appendChild(this.#testCasesCountInfoItemComponent);
    // additionalInfoElement.appendChild(this.#executionErrorsCountInfoItemComponent);
    // additionalInfoElement.appendChild(this.#executionErrorsCountInfoItemComponent1);
    // additionalInfoElement.appendChild(this.#executionErrorsCountInfoItemComponent2);
    // additionalInfoElement.appendChild(this.#executionErrorsCountInfoItemComponent3);

    const wrapperElement: HTMLElement = document.createElement('section');
    wrapperElement.classList.add('execution-control');
    wrapperElement.appendChild(additionalInfoElement);
    wrapperElement.appendChild(this.#playButton);

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
    iconElement.setAttribute(observedAttributeName.Source, PlayButtonIconElementSrc.Run);
    iconElement.setAttribute(observedAttributeName.Color, $color_active);
    return iconElement;
  }

  static #getPlayButtonTitleElement(): HTMLSpanElement {
    const titleElement: HTMLSpanElement = document.createElement('span');
    titleElement.innerText = PlayButtonTitleElementValue.Run;
    titleElement.classList.add('play-button__title');
    return titleElement;
  }

  public connectedCallback(): void {
    this.#executionService.subscribeToExecutionStateChanges(this.#onExecutionStatusChange);
    this.#codeSnippetsService.subscribeToSnippetListChanges(this.#onCodeSnippetsListChange);
    this.#playButton.addEventListener('click', this.#playButtonClickListener);
  }

  public disconnectedCallback(): void {
    this.#executionService.unsubscribeFromExecutionStateChanges(this.#onExecutionStatusChange);
    this.#codeSnippetsService.unsubscribeFromSnippetListChanges(this.#onCodeSnippetsListChange);
    this.#playButton.removeEventListener('click', this.#playButtonClickListener);
  }

  readonly #playButtonClickListener: EventListener = (event: Event): void => {
    if (!(event instanceof MouseEvent)) {
      throw new ContextualError(this, `expected MouseEvent, but caught ${event.constructor.name}`);
    }

    this.#executionService.toggleExecutionState();
  };

  readonly #onExecutionStatusChange: OnExecutionStateChange = (updatedStatus: ExecutionState): void => {
    const isRunning: boolean = updatedStatus === ExecutionState.Running;
    const classWhenRunning: string = 'play-button_active';

    if (isRunning) {
      this.#playButton.classList.add(classWhenRunning);
      this.#playButtonTitleElement.innerText = PlayButtonTitleElementValue.Stop;
      this.#playButtonIconComponent.setAttribute(
        IconComponent.observedAttributeName.Source,
        PlayButtonIconElementSrc.Stop
      );
      this.#playButtonIconComponent.setAttribute(IconComponent.observedAttributeName.Color, $color_background);
      return;
    }
    this.#playButton.classList.remove(classWhenRunning);
    this.#playButtonTitleElement.innerText = PlayButtonTitleElementValue.Run;
    this.#playButtonIconComponent.setAttribute(
      IconComponent.observedAttributeName.Source,
      PlayButtonIconElementSrc.Run
    );
    this.#playButtonIconComponent.setAttribute(IconComponent.observedAttributeName.Color, $color_active);
  };

  readonly #onCodeSnippetsListChange: OnSnippetListChangeCallback = ({
    updatedSnippetList
  }: SnippetListChangeInfo): void => {
    const testCasesCount: number = updatedSnippetList.filter(
      ({ type }: CodeSnippet) => type === CodeSnippetType.Test
    ).length;

    this.#testCasesCountInfoItemComponent.setAttribute(
      ExecutionControlInfoItemComponent.observedAttributeName.Value,
      String(testCasesCount)
    );
  };
}
