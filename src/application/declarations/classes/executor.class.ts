import { isPerformanceReport } from '@application/utilities/is-performance-report.util';
import type { PerformanceReport } from '../interfaces/performance-report.interface';
import type { PromiseReject } from '../types/promise-reject.type';
import type { PromiseResolve } from '../types/promise-resolve.type';
import { WorkerProgramBuilder } from './worker-program-builder.class';

export class Executor {
  #activeWorker: Worker | null = null;
  #activeWorkerScriptUrl: string | null = null;

  readonly #workerProgramBuilder: WorkerProgramBuilder = new WorkerProgramBuilder();

  public async run(code: string): Promise<PerformanceReport> {
    const scriptFile: Blob = this.#workerProgramBuilder.getResultScript(code);
    this.#activeWorkerScriptUrl = URL.createObjectURL(scriptFile);
    this.#activeWorker = new Worker(this.#activeWorkerScriptUrl, {
      name: 'execution-worker',
      type: 'module'
    });

    return new Promise((resolve: PromiseResolve<PerformanceReport>, reject: PromiseReject) => {
      if (this.#activeWorker === null) {
        reject(new Error('[Executor] worker is not created'));
        return;
      }

      this.#activeWorker.onmessage = (messageEvent: MessageEvent) => {
        const report: unknown = messageEvent.data;
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (isPerformanceReport(report)) {
          resolve(report);
          return;
        }

        reject(new Error('[Executor] PerformanceReport is invalid'));
      };
    });
  }

  public stop(): void {
    if (this.#activeWorker !== null) {
      this.#activeWorker.terminate();
      this.#activeWorker = null;
    }

    if (this.#activeWorkerScriptUrl !== null) {
      URL.revokeObjectURL(this.#activeWorkerScriptUrl);
      this.#activeWorkerScriptUrl = null;
    }
  }
}
