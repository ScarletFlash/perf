import { CodeSnippet } from '@application/declarations/classes/code-snippet.class';
import { CodeSnippetType } from '@application/declarations/enums/code-snippet-type.enum';
import { Application } from '@framework/application';
import { CodeSnippetsService } from './code-snippets.service';

export class StateService {
  readonly #codeSnippetsService: CodeSnippetsService = Application.getBackgroundService(CodeSnippetsService);

  constructor() {
    this.#prefillInitialValues();
  }

  #prefillInitialValues(): void {
    const initialSnippets: CodeSnippet[] = [
      new CodeSnippet({
        type: CodeSnippetType.Prelude,
        name: 'Prelude',
        code: `
const dataSet: number[] = new Array(100_000).fill(null).map(() => Math.random());

const result: unknown[] = [];
`
      }),
      new CodeSnippet({
        type: CodeSnippetType.Test,
        name: 'Test 1',
        code: `
dataSet.forEach((item: number) => result.push(item));
`
      }),
      new CodeSnippet({
        type: CodeSnippetType.Test,
        name: 'Test 2',
        code: `
for (const item of dataSet) {
  result.push(item);
}
`
      }),
      new CodeSnippet({
        type: CodeSnippetType.Test,
        name: 'Test 3',
        code: `
for (let index = 0; index < dataSet.length; index++) {
  result.push(dataSet[index]);
}
`
      })
    ];

    initialSnippets.forEach((snippet: CodeSnippet) => this.#codeSnippetsService.addSnippet(snippet));
  }
}
