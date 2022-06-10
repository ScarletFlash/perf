import { WorkerReportMessageType } from '../enums/worker-report-message-type.enum';
import { WorkerRequestMessageType } from '../enums/worker-request-message-type.enum';
import type { WorkerReportMessage } from '../interfaces/worker-report-message.interface';
import type { WorkerRequestMessage } from '../interfaces/worker-request-message.interface';

const enum PerformanceMark {
  BeforeExecution = 'Start',
  AfterExecution = 'End'
}

export class WorkerProgramBuilder {
  public static getResultScript(payloadCode: string): Blob {
    const runCallback: string = `() => {${payloadCode}}`;
    const executionPayload: string = `(${WorkerProgramBuilder.#codeToRunAfterWorkerIsCreated()})(${runCallback})`;
    return new Blob([executionPayload], { type: 'text/javascript' });
  }

  static #codeToRunAfterWorkerIsCreated(): string {
    return ((runCallback: VoidFunction): void => {
      const onWorkerIsCreated: WorkerReportMessage = {
        type: WorkerReportMessageType.WorkerIsCreated,
        payload: null
      };
      self.postMessage(onWorkerIsCreated);

      self.addEventListener('message', ({ data }: MessageEvent) => {
        const request: WorkerRequestMessage = data;

        switch (request.type) {
          case WorkerRequestMessageType.Execute: {
            const onExecutionIsStarted: WorkerReportMessage = {
              type: WorkerReportMessageType.ExecutionIsStarted,
              payload: null
            };
            self.postMessage(onExecutionIsStarted);

            performance.mark(PerformanceMark.BeforeExecution);
            runCallback();
            performance.mark(PerformanceMark.AfterExecution);

            const { duration }: PerformanceMeasure = performance.measure(
              'executionTimeMs',
              PerformanceMark.BeforeExecution,
              PerformanceMark.AfterExecution
            );

            const onExecutionIsFinished: WorkerReportMessage = {
              type: WorkerReportMessageType.ExecutionIsFinished,
              payload: {
                executionTimeMs: duration
              }
            };
            self.postMessage(onExecutionIsFinished);

            return;
          }

          default: {
            return;
          }
        }
      });
    }).toString();
  }
}
