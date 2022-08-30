import type { PerformanceReportItem } from '../interfaces/performance-report-item.interface';
import type { SnippetIterationExecutionInfo } from '../interfaces/snippet-iteration-execution-info.interface';
import type { SnippetPerformanceReport } from '../interfaces/snippet-performance-report.interface';
import type { CodeSnippetId } from '../types/code-snippet-id.type';
import type { PerformanceReport } from '../types/performance-report.type';

export class PerformanceReportAccumulator {
  readonly #reportBySnippetId: Map<CodeSnippetId, PerformanceReport> = new Map<CodeSnippetId, PerformanceReport>();

  constructor(iterationExecutionInfoList: SnippetIterationExecutionInfo[] = []) {
    this.resetFromIterationInfoList(iterationExecutionInfoList);
  }

  public get reports(): SnippetPerformanceReport[] {
    return Array.from(this.#reportBySnippetId.entries()).map(
      ([codeSnippetId, report]: [CodeSnippetId, PerformanceReport]): SnippetPerformanceReport => ({
        report,
        codeSnippetId
      })
    );
  }

  public resetFromIterationInfoList(iterationExecutionInfoList: SnippetIterationExecutionInfo[]): void {
    this.#reportBySnippetId.clear();

    iterationExecutionInfoList.forEach(({ codeSnippetId, performanceReportItem }: SnippetIterationExecutionInfo) => {
      const existingReport: PerformanceReport | undefined = this.#reportBySnippetId.get(codeSnippetId);
      const { executionTimeMs }: PerformanceReportItem = performanceReportItem;

      if (existingReport !== undefined) {
        existingReport.executionTimeMs.push(executionTimeMs);
        return;
      }

      const incomingPerformanceReport: PerformanceReport = {
        executionTimeMs: [executionTimeMs]
      };
      this.#reportBySnippetId.set(codeSnippetId, incomingPerformanceReport);
    });
  }
}
