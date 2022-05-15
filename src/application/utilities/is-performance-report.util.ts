import type { PerformanceReport } from '@application/declarations/interfaces/performance-report.interface';

export function isPerformanceReport(input: unknown): input is PerformanceReport {
  if (typeof input !== 'object' || input === null) {
    return false;
  }

  return Object.entries(input).every(([key, value]: [string, unknown]) => {
    const hasIterationIndex: boolean = !Number.isNaN(Number.parseInt(key, 10));
    const hasReportItem: boolean = typeof value === 'object';
    return hasIterationIndex && hasReportItem;
  });
}
