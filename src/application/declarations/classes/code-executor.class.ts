import { WorkerReportMessageType } from '../enums/worker-report-message-type.enum';
import { WorkerRequestMessageType } from '../enums/worker-request-message-type.enum';
import type { WorkerReportMessage } from '../interfaces/worker-report-message.interface';
import { ReportAccumulator } from './report-accumulator.class';
import { WorkerProgramBuilder } from './worker-program-builder.class';

export class CodeExecutor {
  readonly #worker: Worker;
  readonly #activeWorkerScriptUrl: string;
  readonly #reportAccumulator: ReportAccumulator = new ReportAccumulator();

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
    this.#reportAccumulator.clear();
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
        if (message.payload === null) {
          throw new Error('[CodeExecutor] invalid payload type');
        }

        this.#reportAccumulator.pushItem(message.payload);

        const shouldRunAgain: boolean = this.#currentIteration < this.#repeatCount;
        shouldRunAgain ? this.#requestExecution() : this.destroy();
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
}
