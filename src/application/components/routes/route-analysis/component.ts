import { ExecutionService } from '@application/background-services/execution.service';
import { WindowResizingService } from '@application/background-services/window-resizing.service';
import { BarChart } from '@application/declarations/classes/bar-chart.class';
import { ContextualError } from '@application/declarations/classes/contextual-error.class';
import type { Connectable } from '@application/declarations/interfaces/connectable.interface';
import type { Disconnectable } from '@application/declarations/interfaces/disconnectable.interface';
import type { OnWindowSizeChangeCallback } from '@application/declarations/types/on-window-size-change-callback.type';
import type { PerformanceReport } from '@application/declarations/types/performance-report.type';
import { Application } from '@framework/application';
import type { PerfComponentSelector } from '@framework/declarations/types/perf-component-selector.type';
import componentStyles from './component.scss';

export class RouteAnalysisComponent extends HTMLElement implements Connectable, Disconnectable {
  public static readonly selector: PerfComponentSelector = 'perf-route-analysis';

  readonly #chartsContainer: HTMLElement = RouteAnalysisComponent.#getChartsContainerElement();

  readonly #runButton: HTMLButtonElement = RouteAnalysisComponent.#getButtonElement(
    'Run code and get report in console'
  );

  readonly #chartCanvas: HTMLCanvasElement = RouteAnalysisComponent.#getChartCanvasElement();
  #barChart: BarChart | undefined = undefined;
  readonly #windowResizingService: WindowResizingService = Application.getBackgroundService(WindowResizingService);

  readonly #executionService: ExecutionService = Application.getBackgroundService(ExecutionService);

  constructor() {
    super();

    const shadowRoot: ShadowRoot = this.attachShadow({ mode: 'closed' });
    const style: HTMLStyleElement = document.createElement('style');
    style.innerHTML = componentStyles;

    this.#chartsContainer.appendChild(this.#chartCanvas);

    shadowRoot.appendChild(style);
    shadowRoot.appendChild(this.#chartsContainer);
    shadowRoot.appendChild(this.#runButton);
  }

  static #getChartCanvasElement(): HTMLCanvasElement {
    const canvasElement: HTMLCanvasElement = document.createElement('canvas');
    return canvasElement;
  }

  static #getChartsContainerElement(): HTMLElement {
    const containerElement: HTMLElement = document.createElement('section');
    containerElement.classList.add('charts-container');
    return containerElement;
  }

  static #getButtonElement(text: string): HTMLButtonElement {
    const buttonElement: HTMLButtonElement = document.createElement('button');
    buttonElement.innerText = text;
    return buttonElement;
  }

  readonly #onWindowSizeChangesListener: OnWindowSizeChangeCallback = () => {
    if (this.#barChart === undefined) {
      return;
    }

    this.#barChart.resize();
  };

  readonly #onRunButtonClickListener: EventListener = () => {
    this.#executionService
      .transpile()
      .then(() => this.#executionService.generateExecutionReport())
      .then(() => {
        if (this.#barChart === undefined) {
          throw new ContextualError(this, 'bar chart creation failed');
        }

        const { executionTimeMs }: PerformanceReport = this.#executionService.performanceReport;
        // eslint-disable-next-line no-console
        console.log({ executionTimeMs });

        this.#barChart.setValue([
          {
            label: 'Execution Time (ms)',
            data: executionTimeMs,
            backgroundColor: ['rgba(255, 159, 64, 0.2)'],
            borderColor: ['rgba(255, 159, 64, 1)'],
            borderWidth: 1
          }
        ]);

        const labels: string[] = executionTimeMs.map((_: number, index: number) => String(index + 1));
        this.#barChart.setLabels(labels);

        this.#barChart.refresh();
      });
  };

  public connectedCallback(): void {
    this.#barChart = new BarChart(this.#chartCanvas);
    this.#barChart.resize();
    this.#windowResizingService.subscribeToWindowSizeChanges(this.#onWindowSizeChangesListener);

    this.#runButton.addEventListener('click', this.#onRunButtonClickListener);
  }

  public disconnectedCallback(): void {
    this.#runButton.removeEventListener('click', this.#onRunButtonClickListener);

    if (this.#barChart === undefined) {
      return;
    }

    this.#barChart.destroy();
    this.#windowResizingService.unsubscribeFromWindowSizeChanges(this.#onWindowSizeChangesListener);
  }
}
