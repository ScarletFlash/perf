import type { CodeSnippet } from '../classes/code-snippet.class';

export type CodeSnippetId = `${CodeSnippet['name']}⁞${CodeSnippet['type']}⁞${number}`;
