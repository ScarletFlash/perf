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
    return CodeSnippet.getId(`${this.#name}⁞${this.type}`);
  }

  public get code(): string {
    return this.#code;
  }

  public get name(): string {
    return this.#name;
  }

  public static getId(rawValue: string): CodeSnippetId {
    const incompatibleError: Error = new ContextualError(
      CodeSnippet,
      `raw value (${rawValue}) is not compatible with CodeSnippetId`
    );

    const idParts: string[] = rawValue.replaceAll(' ', '_').split('⁞');

    if (idParts.length < 2) {
      throw incompatibleError;
    }

    const rawName: string = idParts[0];
    const rawType: string = idParts[1];
    const rawCreationTimeMark: number = Number.parseInt(idParts[2], 10);

    if (rawName.length === 0) {
      throw incompatibleError;
    }

    if (rawType !== CodeSnippetType.Prelude && rawType !== CodeSnippetType.Test) {
      throw incompatibleError;
    }

    const creationTimeMark: number = Number.isNaN(rawCreationTimeMark) ? 12345 : rawCreationTimeMark;

    return `${rawName}⁞${rawType}⁞${creationTimeMark}`;
  }

  public updateCode(code: string): void {
    this.#code = code;
  }
}
