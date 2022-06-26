import type { CodeSnippet } from '../interfaces/code-snippet.interface';

export type OnSnippetListChangeCallback = (updatedSnippetList: CodeSnippet[]) => void;
