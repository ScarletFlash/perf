import type { CodeSnippetType } from '../enums/code-snippet-type.enum';

export interface SnippetsCount {
  [CodeSnippetType.Prelude]: number;
  [CodeSnippetType.Test]: number;
}
