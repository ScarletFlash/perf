import { CodeSnippetType } from '../enums/code-snippet-type.enum';
import type { CodeSnippetId } from '../types/code-snippet-id.type';
import { ContextualError } from './contextual-error.class';

interface CodeSnippetInit {
  type: CodeSnippetType;
  code: string;
  name: string;
}

export class CodeSnippet {
  #name: string = '';
  #code: string = '';

  public readonly type: CodeSnippetType;

  constructor({ type, name, code }: CodeSnippetInit) {
    this.type = type;
    this.#name = name;
    this.#code = code;
  }

  public get id(): CodeSnippetId {
    return `${this.#name}@${this.type}`;
  }

  public get code(): string {
    return this.#code;
  }

  public get name(): string {
    return this.#name;
  }

  public static getId(rawValue: string): CodeSnippetId {
    const incompatibleError: Error = new ContextualError(CodeSnippet, 'raw value is not compatible with CodeSnippetId');

    const idParts: string[] = rawValue.split('@');

    if (idParts.length !== 2) {
      throw incompatibleError;
    }

    const rawName: string = idParts[0];
    const rawType: string = idParts[1];

    if (rawName.length === 0) {
      throw incompatibleError;
    }

    if (rawType !== CodeSnippetType.Prelude && rawType !== CodeSnippetType.Test) {
      throw incompatibleError;
    }

    return `${rawName}@${rawType}`;
  }

  public updateCode(code: string): void {
    this.#code = code;
  }
}
