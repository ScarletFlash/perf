import { WorkerReportMessageType } from '../enums/worker-report-message-type.enum';
import { WorkerRequestMessageType } from '../enums/worker-request-message-type.enum';
import type { WorkerReportMessage } from '../interfaces/worker-report-message.interface';
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

  public runTimes(repeatCount: number): void {
    this.#repeatCount = repeatCount;
    this.#currentIteration = 0;

    this.#requestExecution();
  }

  public destroy(): void {
    this.#worker.removeEventListener('message', this.#workerMessageListener);
    this.#worker.terminate();
    URL.revokeObjectURL(this.#activeWorkerScriptUrl);
  }

  readonly #workerMessageListener: EventListener = (event: Event) => {
    if (!(event instanceof MessageEvent)) {
      throw new Error('[CodeExecutor] invalid event type detected');
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
        const shouldRunOneMoreTime: boolean = this.#currentIteration < this.#repeatCount;
        shouldRunOneMoreTime ? this.#requestExecution() : this.#requestReport();
        return;
      }

      case WorkerReportMessageType.ReportIsReady: {
        this.destroy();
        return;
      }

      default: {
        throw new Error('[CodeExecutor] unprocessable message type');
      }
    }
  }

  #requestExecution(): void {
    if (this.#currentIteration > this.#repeatCount) {
      throw new Error(
        `[CodeExecutor] current iteration is invalid: expected <${this.#repeatCount}; received: ${
          this.#currentIteration
        }`
      );
    }

    this.#currentIteration++;
    this.#worker.postMessage({ type: WorkerRequestMessageType.Execute });
  }

  #requestReport(): void {
    if (this.#currentIteration !== this.#repeatCount) {
      throw new Error('[CodeExecutor] execution is not finished yet');
    }

    this.#worker.postMessage({ type: WorkerRequestMessageType.GenerateReport });
  }
}
