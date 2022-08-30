import { CodeSnippetsService } from '@application/background-services/code-snippets.service';
import { ExecutionService } from '@application/background-services/execution.service';
import { WindowResizingService } from '@application/background-services/window-resizing.service';
import { ContextualError } from '@application/declarations/classes/contextual-error.class';
import { PerformanceReportAccumulator } from '@application/declarations/classes/performance-report-accumulator.class';
import type { Connectable } from '@application/declarations/interfaces/connectable.interface';
import type { Disconnectable } from '@application/declarations/interfaces/disconnectable.interface';
import type { ExecutionTimeChartData } from '@application/declarations/interfaces/execution-time-chart-data.interface';
import type { SnippetIterationExecutionInfo } from '@application/declarations/interfaces/snippet-iteration-execution-info.interface';
import type { SnippetPerformanceReport } from '@application/declarations/interfaces/snippet-performance-report.interface';
import type { OnExecutionInfoChangesCallback } from '@application/declarations/types/on-execution-info-changes-callback.type';
import type { OnWindowSizeChangeCallback } from '@application/declarations/types/on-window-size-change-callback.type';
import { Application } from '@framework/application';
import type { PerfComponentSelector } from '@framework/declarations/types/perf-component-selector.type';
import { ExecutionTimeChart } from 'src/application/declarations/classes/execution-time-chart.class';
import componentStyles from './component.scss';

export class RouteAnalysisComponent extends HTMLElement implements Connectable, Disconnectable {
  public static readonly selector: PerfComponentSelector = 'perf-route-analysis';

  readonly #chartsContainer: HTMLElement = RouteAnalysisComponent.#getChartsContainerElement();

  readonly #chartCanvas: HTMLCanvasElement = RouteAnalysisComponent.#getChartCanvasElement();
  #executionTimeChart: ExecutionTimeChart | undefined = undefined;

  readonly #windowResizingService: WindowResizingService = Application.getBackgroundService(WindowResizingService);
  readonly #executionService: ExecutionService = Application.getBackgroundService(ExecutionService);
  readonly #codeSnippetsService: CodeSnippetsService = Application.getBackgroundService(CodeSnippetsService);

  readonly #performanceReportAccumulator: PerformanceReportAccumulator = new PerformanceReportAccumulator();

  constructor() {
    super();

    const shadowRoot: ShadowRoot = this.attachShadow({ mode: 'closed' });
    const style: HTMLStyleElement = document.createElement('style');
    style.innerHTML = componentStyles;

    this.#chartsContainer.appendChild(this.#chartCanvas);

    shadowRoot.appendChild(style);
    shadowRoot.appendChild(this.#chartsContainer);
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

  readonly #onWindowSizeChangesListener: OnWindowSizeChangeCallback = () => {
    if (this.#executionTimeChart === undefined) {
      return;
    }

    this.#executionTimeChart.resize();
  };

  readonly #onExecutionInfoChanges: OnExecutionInfoChangesCallback = (executionInfo: SnippetIterationExecutionInfo) => {
    // eslint-disable-next-line no-console
    console.log(executionInfo);
  };

  public connectedCallback(): void {
    this.#executionTimeChart = new ExecutionTimeChart(this.#chartCanvas);
    this.#executionTimeChart.resize();
    this.#windowResizingService.subscribeToWindowSizeChanges(this.#onWindowSizeChangesListener);
    this.#executionService.subscribeToExecutionInfoChanges(this.#onExecutionInfoChanges);

    this.#renderAccumulatedPerformanceReport();
  }

  public disconnectedCallback(): void {
    if (this.#executionTimeChart === undefined) {
      return;
    }

    this.#executionTimeChart.destroy();
    this.#windowResizingService.unsubscribeFromWindowSizeChanges(this.#onWindowSizeChangesListener);
    this.#executionService.unsubscribeFromExecutionInfoChanges(this.#onExecutionInfoChanges);
  }

  #renderAccumulatedPerformanceReport(): void {
    if (this.#executionTimeChart === undefined) {
      throw new ContextualError(this, 'Bar chart should be defined');
    }

    const { accumulatedExecutionInfo, eachSnippetIterationsCount }: ExecutionService = this.#executionService;
    this.#performanceReportAccumulator.resetFromIterationInfoList(accumulatedExecutionInfo);
    this.#executionTimeChart.setIterationsCount(eachSnippetIterationsCount);

    const chartData: ExecutionTimeChartData[] = this.#performanceReportAccumulator.reports.map(
      ({ codeSnippetId, report }: SnippetPerformanceReport) => {
        const codeSnippetName: string = this.#codeSnippetsService.getSnippetName(codeSnippetId);
        const executionTimeMs: number[] = report.executionTimeMs;
        return {
          codeSnippetName,
          executionTimeMs
        };
      }
    );
    this.#executionTimeChart.setValue(chartData);
  }
}
