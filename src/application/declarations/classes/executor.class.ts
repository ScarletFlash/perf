import type { PerformanceReport } from '../interfaces/performance-report.interface';
import { CodeExecutor } from './code-executor.class';

export class Executor {
  public async run(code: string): Promise<PerformanceReport> {
    const codeExecutor: CodeExecutor = new CodeExecutor(code);

    codeExecutor.runTimes(100);

    return Promise.resolve({
      executionTimeMs: []
    });

    // return new Promise((resolve: PromiseResolve<PerformanceReport>, reject: PromiseReject) => {
    //   if (this.#activeWorker === null) {
    //     reject(new Error('[Executor] worker is not created'));
    //     return;
    //   }

    //   this.#activeWorker.onmessage = (messageEvent: MessageEvent) => {
    //     const report: unknown = messageEvent.data;
    //     // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    //     if (isPerformanceReport(report)) {
    //       resolve(report);
    //       return;
    //     }

    //     reject(new Error('[Executor] PerformanceReport is invalid'));
    //   };
    // });
  }
}
