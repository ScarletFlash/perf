import type { CodeSnippetId } from '../types/code-snippet-id.type';
import type { PerformanceReport } from '../types/performance-report.type';

export interface SnippetPerformanceReport {
  report: PerformanceReport;
  codeSnippetId: CodeSnippetId;
}
