import { WorkerProgramBuilder } from './worker-program-builder.class';

export class Executor {
  #activeWorker: Worker | null = null;
  #activeWorkerScriptUrl: string | null = null;

  readonly #workerProgramBuilder: WorkerProgramBuilder = new WorkerProgramBuilder();

  public run(code: string): void {
    const scriptFile: Blob = this.#workerProgramBuilder.getResultScript(code);
    this.#activeWorkerScriptUrl = URL.createObjectURL(scriptFile);
    this.#activeWorker = new Worker(this.#activeWorkerScriptUrl, {
      name: 'execution-worker',
      type: 'module'
    });
    // eslint-disable-next-line no-console
    this.#activeWorker.onmessage = (messageEvent: MessageEvent) => console.log(messageEvent.data);
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
