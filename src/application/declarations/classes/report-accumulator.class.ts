import type { PerformanceReportItem } from '../interfaces/performance-report-item.interface';
import type { PerformanceReport } from '../types/performance-report.type';

export class ReportAccumulator {
  readonly #reportItems: PerformanceReportItem[] = [];

  public get items(): PerformanceReport {
    const initialReportData: PerformanceReport = {
      executionTimeMs: []
    };
    return this.#reportItems.reduce((accumulatedData: PerformanceReport, currentItem: PerformanceReportItem) => {
      const { executionTimeMs } = accumulatedData;

      executionTimeMs.push(currentItem.executionTimeMs);

      return accumulatedData;
    }, initialReportData);
  }

  public pushItem(item: PerformanceReportItem): void {
    this.#reportItems.push(item);
  }

  public clear(): void {
    this.#reportItems.splice(0, this.#reportItems.length);
  }
}
