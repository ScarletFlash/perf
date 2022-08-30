import type { CodeSnippetType } from '../enums/code-snippet-type.enum';
import type { IterationExecutionInfo } from '../interfaces/iteration-execution-info.interface';
import type { SnippetIterationExecutionInfo } from '../interfaces/snippet-iteration-execution-info.interface';
import type { CodeSnippetId } from '../types/code-snippet-id.type';
import type { OnExecutionInfoChangesCallback } from '../types/on-execution-info-changes-callback.type';
import type { OnIterationExecutionDoneCallback } from '../types/on-iteration-execution-done-callback.type';
import type { OnSnippetIterationExecutionDoneCallback } from '../types/on-snippet-iteration-execution-done-callback.type';
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

type OnSnippetIterationExecutionDone = (executionInfo: SnippetIterationExecutionInfo) => void;

export class ExecutionQueue {
  readonly #transpiler: Transpiler = new Transpiler();
  readonly #codeToExecute: CodeToExecute[] = [];

  #executionIsActive: boolean = false;
  #executionIsRequested: boolean = false;

  #checkExecutionAvailabilityIntervalId: number | undefined;

  readonly #onExecutionInfoChangesCallbacks: Set<OnExecutionInfoChangesCallback> =
    new Set<OnExecutionInfoChangesCallback>();

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

  public run(eachSnippetIterationsCount: number): void {
    this.#executionIsRequested = true;

    const checkIntervalMs: number = 1_000;
    this.#checkExecutionAvailabilityIntervalId = setInterval(() => {
      if (!this.#executionIsRequested || this.#executionIsActive) {
        return;
      }

      const onIterationExecutionDone: OnSnippetIterationExecutionDone = (
        iterationExecutionInfo: SnippetIterationExecutionInfo
      ) => {
        const { iterationIndex, totalIterationsCount }: SnippetIterationExecutionInfo = iterationExecutionInfo;

        const allIterationsAreExecuted: boolean = iterationIndex === totalIterationsCount;
        if (allIterationsAreExecuted) {
          this.#executionIsActive = false;
        }

        this.#onExecutionInfoChangesCallbacks.forEach((callback: OnExecutionInfoChangesCallback) =>
          callback(iterationExecutionInfo)
        );
      };

      if (this.#codeToExecute.length === 0) {
        return;
      }
      this.#executeFirstSnippetInQueue(onIterationExecutionDone, eachSnippetIterationsCount);
    }, checkIntervalMs);
  }

  public stop(): void {
    this.#executionIsRequested = false;

    clearInterval(this.#checkExecutionAvailabilityIntervalId);
  }

  public subscribeToExecutionInfoChanges(callback: OnExecutionInfoChangesCallback): void {
    this.#onExecutionInfoChangesCallbacks.add(callback);
  }

  public unsubscribeFromExecutionInfoChanges(callback: OnExecutionInfoChangesCallback): void {
    this.#onExecutionInfoChangesCallbacks.delete(callback);
  }

  #executeFirstSnippetInQueue(
    onIterationExecutionDone: OnSnippetIterationExecutionDoneCallback,
    eachSnippetIterationsCount: number
  ): void {
    const itemToExecute: CodeToExecute | undefined = this.#codeToExecute.at(0);

    if (itemToExecute === undefined) {
      throw new ContextualError(this, 'Item to execute is undefined');
    }
    this.#codeToExecute.splice(0, 1);

    const { code, codeSnippetId }: CodeToExecute = itemToExecute;
    const onDone: OnIterationExecutionDoneCallback = ({
      performanceReportItem,
      iterationIndex,
      totalIterationsCount
    }: IterationExecutionInfo) => {
      onIterationExecutionDone({
        codeSnippetId,
        performanceReportItem,
        iterationIndex,
        totalIterationsCount
      });
    };

    this.#executionIsActive = true;
    new CodeExecutor(code).runTimes(eachSnippetIterationsCount, onDone);
  }
}
