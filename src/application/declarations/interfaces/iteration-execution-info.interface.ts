import type { PerformanceReportItem } from './performance-report-item.interface';

export interface IterationExecutionInfo {
  performanceReportItem: PerformanceReportItem;
  iterationIndex: number;
  totalIterationsCount: number;
}
