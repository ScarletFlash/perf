import type { CodeSnippetId } from '../types/code-snippet-id.type';
import type { IterationExecutionInfo } from './iteration-execution-info.interface';

export interface SnippetIterationExecutionInfo extends IterationExecutionInfo {
  codeSnippetId: CodeSnippetId;
}
