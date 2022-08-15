import type { PerformanceReportItem } from '../interfaces/performance-report-item.interface';

export type PerformanceReport = {
  [P in keyof PerformanceReportItem]: PerformanceReportItem[P][];
};

// export interface PerformanceReport extends PerformanceReportMetrics {
//   codeSnippetId: CodeSnippetId;
// }
