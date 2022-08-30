import { ExecutionQueue } from '@application/declarations/classes/execution-queue.class';
import { ExecutionState } from '@application/declarations/enums/execution-state.enum';
import type { SnippetIterationExecutionInfo } from '@application/declarations/interfaces/snippet-iteration-execution-info.interface';
import type { OnExecutionInfoChangesCallback } from '@application/declarations/types/on-execution-info-changes-callback.type';
import type { OnExecutionStateChange } from '@application/declarations/types/on-execution-state-change.type';
import { Application } from '@framework/application';
import { CodeSnippetsService } from './code-snippets.service';

export class ExecutionService {
  public readonly eachSnippetIterationsCount: number = 100;

  #executionState: ExecutionState = ExecutionState.StandBy;

  readonly #codeSnippetsService: CodeSnippetsService = Application.getBackgroundService(CodeSnippetsService);

  readonly #onExecutionStateChangeCallbacks: Set<OnExecutionStateChange> = new Set<OnExecutionStateChange>();
  readonly #onExecutionInfoChangesCallbacks: Set<OnExecutionInfoChangesCallback> =
    new Set<OnExecutionInfoChangesCallback>();

  readonly #executionQueue: ExecutionQueue = new ExecutionQueue();

  readonly #accumulatedExecutionInfo: SnippetIterationExecutionInfo[] = [];

  constructor() {
    this.#executionQueue.subscribeToExecutionInfoChanges(this.#onExecutionInfoChanges);
  }

  public get accumulatedExecutionInfo(): SnippetIterationExecutionInfo[] {
    return this.#accumulatedExecutionInfo.concat();
  }

  public async toggleExecutionState(): Promise<void> {
    const isAlreadyExecuting: boolean = this.#executionState === ExecutionState.Running;
    isAlreadyExecuting ? this.#stopExecution() : await this.#startExecution();

    this.#onExecutionStateChangeCallbacks.forEach((callback: OnExecutionStateChange) => callback(this.#executionState));
  }

  public subscribeToExecutionStateChanges(callback: OnExecutionStateChange): void {
    this.#onExecutionStateChangeCallbacks.add(callback);
  }

  public unsubscribeFromExecutionStateChanges(callback: OnExecutionStateChange): void {
    this.#onExecutionStateChangeCallbacks.delete(callback);
  }

  public subscribeToExecutionInfoChanges(callback: OnExecutionInfoChangesCallback): void {
    this.#onExecutionInfoChangesCallbacks.add(callback);
  }

  public unsubscribeFromExecutionInfoChanges(callback: OnExecutionInfoChangesCallback): void {
    this.#onExecutionInfoChangesCallbacks.delete(callback);
  }

  readonly #onExecutionInfoChanges: OnExecutionInfoChangesCallback = (executionInfo: SnippetIterationExecutionInfo) => {
    this.#accumulatedExecutionInfo.push(executionInfo);
    this.#onExecutionInfoChangesCallbacks.forEach((callback: OnExecutionInfoChangesCallback) =>
      callback(executionInfo)
    );
  };

  async #startExecution(): Promise<void> {
    this.#accumulatedExecutionInfo.splice(0, this.#accumulatedExecutionInfo.length);

    const { testCaseSnippets, preludeSnippet }: CodeSnippetsService = this.#codeSnippetsService;

    await this.#executionQueue.add({ testCaseSnippets, preludeSnippet });

    this.#executionQueue.run(this.eachSnippetIterationsCount);
    this.#executionState = ExecutionState.Running;
  }

  #stopExecution(): void {
    this.#executionQueue.clear();
    this.#executionState = ExecutionState.StandBy;
  }
}
