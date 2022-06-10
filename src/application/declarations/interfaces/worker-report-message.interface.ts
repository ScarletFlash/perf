import type { WorkerReportMessageType } from '../enums/worker-report-message-type.enum';
import type { PerformanceReport } from './performance-report.interface';

export interface WorkerReportMessage<T extends WorkerReportMessageType = WorkerReportMessageType> {
  readonly type: T;
  readonly payload: T extends WorkerReportMessageType.ReportIsReady
    ? {
        performanceReport: PerformanceReport;
      }
    : null;
}
