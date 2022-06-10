import type { WorkerReportMessageType } from '../enums/worker-report-message-type.enum';
import type { PerformanceReportItem } from './performance-report-item.interface';

export interface WorkerReportMessage<T extends WorkerReportMessageType = WorkerReportMessageType> {
  readonly type: T;
  readonly payload: T extends WorkerReportMessageType.WorkerIsCreated
    ? null
    : T extends WorkerReportMessageType.ExecutionIsStarted
    ? null
    : T extends WorkerReportMessageType.ExecutionIsFinished
    ? PerformanceReportItem
    : never;
}
