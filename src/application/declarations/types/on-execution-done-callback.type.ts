import type { PerformanceReport } from './performance-report.type';

export type OnExecutionDoneCallback = (performanceReport: PerformanceReport) => void;
