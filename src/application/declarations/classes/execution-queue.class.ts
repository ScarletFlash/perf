import type { CodeSnippetType } from '../enums/code-snippet-type.enum';
import type { CodeSnippetId } from '../types/code-snippet-id.type';
import type { OnExecutionDoneCallback } from '../types/on-execution-done-callback.type';
import type { PerformanceReport } from '../types/performance-report.type';
import { CodeExecutor } from './code-executor.class';
import type { CodeSnippet } from './code-snippet.class';
import { ContextualError } from './contextual-error.class';
import { Transpiler } from './transpiler.class';

interface QueueAddData {
  preludeSnippet: CodeSnippet<CodeSnippetType.Prelude>;
  testCaseSnippets: CodeSnippet<CodeSnippetType.Test>[];
}

interface CodeToExecute {
  code: string;
  codeSnippetId: CodeSnippetId;
}

interface SnippetExecutionInfo {
  performanceReport: PerformanceReport;
  codeSnippetId: CodeSnippetId;
}

type OnSnippetExecutionDone = (snippetExecutionInfo: SnippetExecutionInfo) => void;

export class ExecutionQueue {
  readonly #transpiler: Transpiler = new Transpiler();
  readonly #codeToExecute: CodeToExecute[] = [];

  #executionIsActive: boolean = false;
  #executionIsRequested: boolean = false;

  #checkExecutionAvailabilityIntervalId: number | undefined;

  public async add({ preludeSnippet, testCaseSnippets }: QueueAddData): Promise<void> {
    const transpilationItems: Promise<CodeToExecute>[] = testCaseSnippets.map(
      async (testCase: CodeSnippet<CodeSnippetType.Test>) => {
        const { code: preludeCode }: CodeSnippet = preludeSnippet;
        const { code: testCaseCode, id: codeSnippetId }: CodeSnippet = testCase;

        const codeToTranspile: string = `${preludeCode}\n${testCaseCode}`;
        const transpiledCode: string = await this.#transpiler.transform(codeToTranspile);
        const codeToExecute: CodeToExecute = { code: transpiledCode, codeSnippetId };
        return await Promise.resolve(codeToExecute);
      }
    );

    const transpilationResult: CodeToExecute[] = await Promise.all(transpilationItems);
    transpilationResult.forEach((codeToExecute: CodeToExecute) => this.#codeToExecute.push(codeToExecute));
  }

  public clear(): void {
    const deleteCount: number = this.#codeToExecute.length;
    this.#codeToExecute.splice(0, deleteCount);
  }

  public run(): void {
    this.#executionIsRequested = true;

    this.#checkExecutionAvailabilityIntervalId = setInterval(() => {
      if (!this.#executionIsRequested || this.#executionIsActive) {
        return;
      }

      const onSnippetExecutionDone: OnSnippetExecutionDone = (_snippetExecutionInfo: SnippetExecutionInfo) => void 0;

      if (this.#codeToExecute.length === 0) {
        return;
      }
      this.#executeOneSnippet(onSnippetExecutionDone);
    }, 1_000);
  }

  public stop(): void {
    this.#executionIsRequested = false;

    clearInterval(this.#checkExecutionAvailabilityIntervalId);
  }

  #executeOneSnippet(onSnippetExecutionDone: OnSnippetExecutionDone): void {
    const itemToExecute: CodeToExecute | undefined = this.#codeToExecute.at(0);

    if (itemToExecute === undefined) {
      throw new ContextualError(this, 'Item to execute is undefined');
    }
    this.#codeToExecute.splice(0, 1);

    const { code, codeSnippetId }: CodeToExecute = itemToExecute;
    const onDone: OnExecutionDoneCallback = (performanceReport: PerformanceReport) => {
      this.#executionIsActive = false;
      onSnippetExecutionDone({ codeSnippetId, performanceReport });
    };

    this.#executionIsActive = true;
    new CodeExecutor(code).runTimes(100, onDone);
  }
}
