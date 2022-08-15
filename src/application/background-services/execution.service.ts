import { CodeExecutor } from '@application/declarations/classes/code-executor.class';
import { Transpiler } from '@application/declarations/classes/transpiler.class';
import { ExecutionStatus } from '@application/declarations/enums/execution-status.enum';
import type { OnExecutionStateChange } from '@application/declarations/types/on-execution-state-change.type';
import type { PerformanceReport } from '@application/declarations/types/performance-report.type';

export class ExecutionService {
  #sourceCode: string = '';
  #transpiledCode: string = '';
  #performanceReport: PerformanceReport = {
    executionTimeMs: []
  };

  #executionStatus: ExecutionStatus = ExecutionStatus.StandBy;

  readonly #transpiler: Transpiler = new Transpiler();
  readonly #onExecutionStateChangeCallbacks: Set<OnExecutionStateChange> = new Set<OnExecutionStateChange>();

  public get performanceReport(): PerformanceReport {
    return this.#performanceReport;
  }

  public setSourceCode(code: string): void {
    if (code === this.#sourceCode) {
      return;
    }

    this.#sourceCode = code;
  }

  public async transpile(): Promise<void> {
    this.#transpiledCode = await this.#transpiler.transform(this.#sourceCode);
  }

  public async generateExecutionReport(): Promise<void> {
    const codeExecutor: CodeExecutor = new CodeExecutor(this.#transpiledCode);

    codeExecutor.runTimes(100);

    this.#performanceReport = await Promise.resolve({
      executionTimeMs: []
    });
  }

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
    this.#executionStatus = ExecutionStatus.Running;
    this.transpile().then(() => this.generateExecutionReport());
  }

  #stopExecution(): void {
    this.#executionStatus = ExecutionStatus.StandBy;
  }
}
