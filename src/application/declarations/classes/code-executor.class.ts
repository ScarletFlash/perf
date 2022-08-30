import { WorkerReportMessageType } from '../enums/worker-report-message-type.enum';
import { WorkerRequestMessageType } from '../enums/worker-request-message-type.enum';
import type { WorkerReportMessage } from '../interfaces/worker-report-message.interface';
import type { OnIterationExecutionDoneCallback } from '../types/on-iteration-execution-done-callback.type';
import { ContextualError } from './contextual-error.class';
import { WorkerProgramBuilder } from './worker-program-builder.class';

export class CodeExecutor {
  readonly #worker: Worker;
  readonly #activeWorkerScriptUrl: string;

  #repeatCount: number = 0;
  #currentIteration: number = 0;

  constructor(code: string) {
    const scriptFile: Blob = WorkerProgramBuilder.getResultScript(code);
    this.#activeWorkerScriptUrl = URL.createObjectURL(scriptFile);
    this.#worker = new Worker(this.#activeWorkerScriptUrl, {
      name: 'code-executor',
      type: 'module'
    });

    this.#worker.addEventListener('message', this.#workerMessageListener);
  }

  #onIterationDone: OnIterationExecutionDoneCallback = () => void 0;

  public runTimes(repeatCount: number, onIterationDone: OnIterationExecutionDoneCallback): void {
    this.#repeatCount = repeatCount;
    this.#currentIteration = 0;
    this.#onIterationDone = onIterationDone;
    this.#requestExecution();
  }

  public destroy(): void {
    this.#worker.removeEventListener('message', this.#workerMessageListener);
    this.#worker.terminate();
    URL.revokeObjectURL(this.#activeWorkerScriptUrl);
  }

  readonly #workerMessageListener: EventListener = (event: Event) => {
    if (!(event instanceof MessageEvent)) {
      throw new ContextualError(this, 'invalid event type detected');
    }

    this.#handleMessage(event.data);
  };

  #handleMessage(message: WorkerReportMessage): void {
    switch (message.type) {
      case WorkerReportMessageType.WorkerIsCreated: {
        return;
      }

      case WorkerReportMessageType.ExecutionIsStarted: {
        return;
      }

      case WorkerReportMessageType.ExecutionIsFinished: {
        if (message.payload === null) {
          throw new ContextualError(this, 'invalid payload type');
        }

        this.#onIterationDone({
          iterationIndex: this.#currentIteration,
          totalIterationsCount: this.#repeatCount,
          performanceReportItem: message.payload
        });

        const shouldRunAgain: boolean = this.#currentIteration < this.#repeatCount;
        shouldRunAgain ? this.#requestExecution() : this.destroy();
        return;
      }

      default: {
        throw new ContextualError(this, 'unprocessable message type');
      }
    }
  }

  #requestExecution(): void {
    if (this.#currentIteration > this.#repeatCount) {
      throw new ContextualError(
        this,
        `[CodeExecutor] current iteration is invalid: expected <${this.#repeatCount}; received: ${
          this.#currentIteration
        }`
      );
    }

    this.#currentIteration++;
    this.#worker.postMessage({ type: WorkerRequestMessageType.Execute });
  }
}
