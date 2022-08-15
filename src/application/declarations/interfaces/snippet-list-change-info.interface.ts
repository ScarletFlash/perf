import type { CodeSnippet } from '../classes/code-snippet.class';
import type { SnippetsCount } from './snippets-count.interface';

export interface SnippetListChangeInfo {
  updatedSnippetList: CodeSnippet[];
  snippetsCount: SnippetsCount;
}
