import type { PerformanceReportItem } from '../interfaces/performance-report-item.interface';

export type PerformanceReport = {
  [P in keyof PerformanceReportItem]: PerformanceReportItem[P][];
};
