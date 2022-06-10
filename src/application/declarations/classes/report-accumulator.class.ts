import type { PerformanceReportItem } from '../interfaces/performance-report-item.interface';
import type { PerformanceReport } from '../interfaces/performance-report.interface';

export class ReportAccumulator {
  readonly #reportItems: PerformanceReportItem[] = [];

  public get report(): PerformanceReport {
    const initialReportData: PerformanceReport = {
      executionTimeMs: []

      // maxRamBytesBefore: [],
      // maxRamBytesAfter: [],

      // usedRamBytesBefore: [],
      // usedRamBytesAfter: []
    };
    return this.#reportItems.reduce((accumulatedData: PerformanceReport, currentItem: PerformanceReportItem) => {
      const { executionTimeMs } = accumulatedData;

      executionTimeMs.push(currentItem.executionTimeMs);

      // maxRamBytesBefore.push(currentItem.maxRamBytesBefore);
      // maxRamBytesAfter.push(currentItem.maxRamBytesAfter);

      // usedRamBytesBefore.push(currentItem.usedRamBytesBefore);
      // usedRamBytesAfter.push(currentItem.usedRamBytesAfter);

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
