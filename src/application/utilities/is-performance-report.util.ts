import type { PerformanceReport } from '@application/declarations/interfaces/performance-report.interface';

export function isPerformanceReport(input: unknown): input is PerformanceReport {
  if (typeof input !== 'object' || input === null) {
    return false;
  }

  const requiredReportKeys: Set<keyof PerformanceReport> = new Set<keyof PerformanceReport>(['executionTimeMs']);
  return Array.from(requiredReportKeys).every((key: keyof PerformanceReport) => key in input);
}
