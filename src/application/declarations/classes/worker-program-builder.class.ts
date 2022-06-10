import { WorkerReportMessageType } from '../enums/worker-report-message-type.enum';
import { WorkerRequestMessageType } from '../enums/worker-request-message-type.enum';
import type { WorkerReportMessage } from '../interfaces/worker-report-message.interface';
import type { WorkerRequestMessage } from '../interfaces/worker-request-message.interface';

export class WorkerProgramBuilder {
  public static getResultScript(payloadCode: string): Blob {
    const runFunctionCode: string = WorkerProgramBuilder.#getRunFunctionCode(payloadCode);
    const executionPayload: string = `(${WorkerProgramBuilder.#codeToRunAfterWorkerIsCreated()})(() => {${runFunctionCode}})`;
    return new Blob([executionPayload], { type: 'text/javascript' });
  }

  static #getRunFunctionCode(payloadCode: string): string {
    const codeToRunBeforePayload: string = ((): void => {
      const message: WorkerReportMessage = {
        type: WorkerReportMessageType.ExecutionIsStarted,
        payload: null
      };
      self.postMessage(message);
    }).toString();

    const codeToRunAfterPayload: string = ((): void => {
      const message: WorkerReportMessage = {
        type: WorkerReportMessageType.ExecutionIsFinished,
        payload: null
      };
      self.postMessage(message);
    }).toString();

    return `
(${codeToRunBeforePayload})()
${payloadCode}
(${codeToRunAfterPayload})()
`;
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
            runCallback();
            return;
          }

          case WorkerRequestMessageType.GenerateReport: {
            const onWorkerReportReady: WorkerReportMessage = {
              type: WorkerReportMessageType.ReportIsReady,
              payload: {
                performanceReport: {
                  executionTimeMs: []
                }
              }
            };
            self.postMessage(onWorkerReportReady);
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
