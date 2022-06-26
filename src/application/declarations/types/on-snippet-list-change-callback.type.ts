import type { CodeSnippet } from '../classes/code-snippet.class';

export type OnSnippetListChangeCallback = (updatedSnippetList: CodeSnippet[]) => void;
