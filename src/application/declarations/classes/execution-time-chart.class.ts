import { getColorFromString } from '@application/utilities/get-color-from-string.util';
import type { ChartConfiguration, ChartDataset } from 'chart.js';
import { Chart, registerables } from 'chart.js';
import type { ExecutionTimeChartData } from '../interfaces/execution-time-chart-data.interface';
import { ContextualError } from './contextual-error.class';

export class ExecutionTimeChart extends Chart {
  readonly #dataSets: ChartDataset[];
  readonly #labels: string[];

  constructor(canvas: HTMLCanvasElement) {
    Chart.register(...registerables);

    const context: CanvasRenderingContext2D | null = canvas.getContext('2d');

    if (context === null) {
      throw new ContextualError(ExecutionTimeChart, 'rendering context is unreachable');
    }

    const datasets: ChartDataset[] = [
      {
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: ['rgba(255, 99, 132, 0.2)'],
        borderColor: ['rgba(255, 99, 132, 1)'],
        borderWidth: 1
      },
      {
        label: '# of Votes',
        data: [3, 12, 2, 19, 3, 5],
        backgroundColor: ['rgba(255, 159, 64, 0.2)'],
        borderColor: ['rgba(255, 159, 64, 1)'],
        borderWidth: 1
      }
    ];

    const labels: string[] = [];
    const configuration: ChartConfiguration = {
      type: 'line',
      data: {
        labels,
        datasets
      },
      options: {
        // hover: {
        //   mode: 'index',
        //   intersect: false
        // },
        responsive: true,
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Iteration №'
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Execution Time (ms)'
            }
          }
        },
        interaction: {
          mode: 'index',
          intersect: false
        }
      }
    };
    super(context, configuration);

    this.#dataSets = datasets;
    this.#labels = labels;
  }

  public setValue(updatedValue: ExecutionTimeChartData[]): void {
    const dataSets: ChartDataset[] = updatedValue.map((executionTimeChartData: ExecutionTimeChartData) => {
      const { codeSnippetName: label, executionTimeMs: data }: ExecutionTimeChartData = executionTimeChartData;

      const dataSet: ChartDataset = {
        label,
        data,
        backgroundColor: [getColorFromString(label)],
        borderColor: [getColorFromString(label)],
        borderWidth: 1,
        pointStyle: 'circle',
        pointRadius: 0,
        pointHoverRadius: 0
      };

      return dataSet;
    });

    this.#dataSets.splice(0, this.#dataSets.length, ...dataSets);
  }

  public setIterationsCount(iterationsCount: number): void {
    if (iterationsCount < 0 || !Number.isInteger(iterationsCount)) {
      throw new ContextualError(this, 'Iterations count should be a positive integer');
    }

    const existingItemsCount: number = this.#labels.length;
    const difference: number = iterationsCount - existingItemsCount;
    const delta: number = Math.abs(difference);

    if (difference === 0) {
      return;
    }

    if (difference < 0) {
      this.#labels.splice(existingItemsCount - delta, delta);
      return;
    }

    new Array(delta)
      .fill(existingItemsCount + 1)
      .map((itemsCount: number, itemToPushIndex: number) => String(itemsCount + itemToPushIndex))
      .forEach((itemToPush: string) => this.#labels.push(itemToPush));
  }

  public refresh(): void {
    this.update('reset');
  }
}
