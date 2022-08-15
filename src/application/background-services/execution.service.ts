import { ExecutionQueue } from '@application/declarations/classes/execution-queue.class';
import { ExecutionStatus } from '@application/declarations/enums/execution-status.enum';
import type { OnExecutionStateChange } from '@application/declarations/types/on-execution-state-change.type';
import { Application } from '@framework/application';
import { CodeSnippetsService } from './code-snippets.service';

export class ExecutionService {
  #executionStatus: ExecutionStatus = ExecutionStatus.StandBy;

  readonly #codeSnippetsService: CodeSnippetsService = Application.getBackgroundService(CodeSnippetsService);

  readonly #onExecutionStateChangeCallbacks: Set<OnExecutionStateChange> = new Set<OnExecutionStateChange>();

  readonly #executionQueue: ExecutionQueue = new ExecutionQueue();

  public toggleExecutionState(): void {
    const isAlreadyExecuting: boolean = this.#executionStatus === ExecutionStatus.Running;
    isAlreadyExecuting ? this.#stopExecution() : this.#startExecution();

    this.#onExecutionStateChangeCallbacks.forEach((callback: OnExecutionStateChange) =>
      callback(this.#executionStatus)
    );
  }

  public subscribeToExecutionStateChanges(callback: OnExecutionStateChange): void {
    this.#onExecutionStateChangeCallbacks.add(callback);
  }

  public unsubscribeFromExecutionStateChanges(callback: OnExecutionStateChange): void {
    this.#onExecutionStateChangeCallbacks.delete(callback);
  }

  #startExecution(): void {
    const { testCaseSnippets, preludeSnippet }: CodeSnippetsService = this.#codeSnippetsService;
    this.#executionQueue.add({ testCaseSnippets, preludeSnippet }).then(() => {
      this.#executionQueue.run();
      this.#executionStatus = ExecutionStatus.Running;
    });
  }

  #stopExecution(): void {
    this.#executionQueue.clear();

    this.#executionStatus = ExecutionStatus.StandBy;
  }
}
