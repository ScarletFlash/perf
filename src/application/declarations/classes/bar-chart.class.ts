import type { ChartConfiguration, ChartDataset } from 'chart.js';
import { Chart, registerables } from 'chart.js';

export class BarChart extends Chart {
  readonly #dataSets: ChartDataset[];
  readonly #labels: string[];

  constructor(canvas: HTMLCanvasElement) {
    Chart.register(...registerables);

    const context: CanvasRenderingContext2D | null = canvas.getContext('2d');

    if (context === null) {
      throw new Error('[BarChart] rendering context is unreachable');
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

    const labels: string[] = ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'];
    const configuration: ChartConfiguration = {
      type: 'bar',
      data: {
        labels,
        datasets
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    };
    super(context, configuration);

    this.#dataSets = datasets;
    this.#labels = labels;
  }

  public get value(): ChartDataset[] {
    return this.#dataSets;
  }

  public setValue(updatedValue: ChartDataset[]): void {
    this.#dataSets.splice(0, this.#dataSets.length, ...updatedValue);
  }

  public setLabels(updatedValue: string[]): void {
    this.#labels.splice(0, this.#labels.length, ...updatedValue);
  }

  public refresh(): void {
    this.update('reset');
  }
}
